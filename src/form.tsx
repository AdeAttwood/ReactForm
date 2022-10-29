import React from "react";
import { FormContext } from "./form-context";

import type { ErrorBag } from "./validator";
import { get, set } from "./dot-notation";

export interface FormProps<T extends {}> {
  /**
   * The initial form state
   */
  initialValues: T;
  /**
   * The number of idle millisecond it will be until the validation on the
   * attribute is run. If the user input data into an input before the
   * timeout the timer is reset.
   *
   * @default 800
   */
  validateTimeout: number;
  /**
   * The validator for validating the form state. A generic object that can be
   * used to implement validation with our built in validator external schema
   * validation library like zod or a stand alone custom function.
   */
  validator?: {
    /**
     * A validation function that will validate all of the date. This is
     * typically called before the form is submitted.
     */
    validate: (data: T) => Promise<ErrorBag>;
    /**
     * Validates a single attribute. Usually when a input has changed
     */
    validateAttribute?: (attribute: string, data: T) => Promise<string[]>;
  };
  /**
   * TODO(ade): Sort out this doc
   */
  onSubmit: (params: { formState: T }) => void;
  /**
   * TODO(ade): sort out prop with children
   */
  children: any;
}

/**
 * The internal state of the form
 */
export interface FormState<T> {
  /**
   * Internal form values
   */
  formState: T;
  /**
   * A map of error that there are on any attributes. Will determine if the
   * form is valid or not.
   */
  errors: ErrorBag;
}

export class Form<T extends Record<string, any>> extends React.Component<FormProps<T>, FormState<T>> {
  /**
   * Queued attributes that need to be validated.
   *
   * Any any attributes in this array will be validated by
   * `this.validateTimeout`. After the validation has been run the array will
   * be reset.
   */
  private attributesToValidate: Array<string> = [];

  /**
   * The internal timer that will validate the `attributesToValidate` on the
   * callback
   */
  private validationTimeout: NodeJS.Timeout | null = null;

  /**
   * Default props if the user dose not pass any in.
   */
  public static defaultProps = {
    validateTimeout: 800,
    initialValues: {},
  };

  /**
   * Internal form state
   */
  state: FormState<T> = {
    /**
     * The form state of the current form
     */
    formState: this.props.initialValues,
    /**
     * Error messages for each attribute. Each key it the attribute name and the
     * value is an array of string that are the error messages returned from the
     * validation functions in the rules.
     */
    errors: {},
  };

  /**
   * Callback to be called on submission of the form.
   *
   * This will validate the form and call the `onSubmit` props if there are no errors.
   * If the form is invalid then the state will be populated with the errors.
   */
  submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const errors = await this.props.validator?.validate(this.state.formState);
    if (errors && Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    this.props.onSubmit({
      formState: this.state.formState,
    });
  };

  /**
   * Gets the value for a given attribute
   */
  getAttribute = (attribute: string, defaultValue: any = "") => {
    return get(this.state.formState, attribute) || defaultValue;
  };

  /**
   * Set the value for an attribute and queues this attribute to be validated
   */
  setAttribute = (attribute: string, value: any) => {
    const { formState, errors } = this.state;

    set(formState, attribute, value);
    delete errors[attribute];

    if (this.props.validateTimeout > 0) {
      this.queueValidation(attribute, this.props.validateTimeout);
    }

    this.setState({ formState, errors });
  };

  /**
   * Gets the first error message found for an attribute. Undefined will be
   * returned if there are not validation errors for the attribute.
   */
  firstError = (attribute: string): string => {
    return get(this.state.errors, [...attribute.split("."), "0"]);
  };

  /**
   * Queues an attribute to be validated after a timeout. If there is already a
   * validation in the queue it will be canceled and queued queued again with
   * the new list of attributes.
   */
  queueValidation = (attribute: string, timeout: number) => {
    if (!this.attributesToValidate.includes(attribute)) {
      this.attributesToValidate.push(attribute);
    }

    if (this.validationTimeout !== null) {
      clearTimeout(this.validationTimeout);
    }

    this.validationTimeout = setTimeout(this.validateTimeout, timeout);
  };

  /**
   * The function that wil validate all of the attributes that need to be
   * validated. It will set any errors from any of the attributes into the
   * component state
   *
   * @see {this.attributesToValidate}
   */
  validateTimeout = async () => {
    const { formState, errors } = this.state;

    for (const attribute of this.attributesToValidate) {
      const attributeErrors = await this.validateAttribute(attribute, formState);
      if (attributeErrors.length > 0) {
        errors[attribute] = attributeErrors;
      }
    }

    this.attributesToValidate = [];
    this.setState({ errors });
  };

  /**
   * Validates a single attribute against any of the validation rules rules
   * defined
   */
  validateAttribute = async (attribute: string, formState: T): Promise<string[]> => {
    const fun = this.props.validator?.validateAttribute;
    if (typeof fun === "undefined") {
      return [];
    }

    return await fun(attribute, formState);
  };

  /**
   * Gets all of the values that wil be available in the public context
   */
  private getContextValue = () => {
    return {
      formState: this.state.formState,
      errors: this.state.errors,
      firstError: this.firstError,
      getAttribute: this.getAttribute,
      setAttribute: this.setAttribute,
      submit: this.submit,
    };
  };

  render() {
    return (
      <FormContext.Provider value={this.getContextValue()}>
        <form onSubmit={this.submit}>{this.props.children}</form>
      </FormContext.Provider>
    );
  }
}

export default Form;
