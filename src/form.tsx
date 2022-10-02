import React from "react";
import { FormContext } from "./form-context";

import { get, set } from "./dot-notation";

type ValidationOptions = { attribute: string; match?: any };
type ValidationFunction<T> = (formState: T, options: ValidationOptions) => string;

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
   * Validation rules for the form state. This is a object keyed by the
   * attribute name with an array or validation function. The validation
   * function must return a string containing the error message, if the
   * validation was not successful. If undefined or an empty string is return
   * the attribute will be valid.
   *
   * @example
   * {
   *   userName: [
   *     ({ userName }) => {
   *       if (!userName) {
   *         return "User name is required"
   *       }
   *     }
   *   ],
   * }
   */
  rules?: { [key: string]: ValidationFunction<T>[] };
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
  errors: { [key: string]: string[] };
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
    rules: {},
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
  submit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const { errors, hasErrors } = this.validate(this.state.formState);
    if (hasErrors) {
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
    } else {
      const attributeErrors = this.validateAttribute(attribute, formState);
      if (attributeErrors.length > 0) {
        errors[attribute] = attributeErrors;
      }
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
  validateTimeout = () => {
    const { formState, errors } = this.state;

    for (const attribute of this.attributesToValidate) {
      const attributeErrors = this.validateAttribute(attribute, formState);
      if (attributeErrors.length > 0) {
        errors[attribute] = attributeErrors;
      }
    }

    this.attributesToValidate = [];
    this.setState({ errors });
  };

  /**
   * Validate all of the `formState` against all of the validation rules defined
   *
   * @param {Object} formState
   */
  private validate = (formState: T) => {
    const errors = {};
    const hasErrorRef = { current: false };
    this.validateInternal(formState, "", errors, hasErrorRef);

    return { errors, hasErrors: hasErrorRef.current };
  };

  private validateInternal(
    formState: Record<string, any>,
    parent: string,
    errors: Record<string, string>,
    hasErrorRef: { current: boolean }
  ) {
    for (const key of Object.keys(formState)) {
      const attribute = parent ? parent + "." + key : key;
      if (typeof formState[key] == "object") {
        this.validateInternal(formState[key], attribute, errors, hasErrorRef);
        continue;
      }

      const attributeErrors = this.validateAttribute(attribute, this.state.formState);
      if (attributeErrors.length) {
        hasErrorRef.current = true;
        Object.assign(errors, { [attribute]: attributeErrors });
      }
    }
  }

  /**
   * Validates a single attribute against any of the validation rules rules
   * defined
   */
  validateAttribute = (attribute: string, formState: T): Array<string> => {
    let rules: any = [];
    for (const rule of Object.keys(this.props.rules as any)) {
      const match = attribute.match(new RegExp(rule));
      if (match) {
        rules = rules.concat(this.props.rules?.[rule].map((callback: any) => [callback, { attribute, match }]));
      }
    }

    const errors = [];
    for (const [rule, args] of rules) {
      const error = rule(formState, args);
      if (typeof error === "string" && error.length) {
        errors.push(error);
      }
    }

    return errors;
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
