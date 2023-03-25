import React from "react";
import { FormContext } from "./form-context";

import { ErrorBag, isErrorBagObject } from "./validator";
import { get, set } from "./dot-notation";

/**
 * All the available values that the status of the form could be
 */
export type FormStatus = "clean" | "error" | "dirty" | "validating" | "submitting";

type OnSubmitParams<T> = {
  /**
   * The current state of the form at submit time
   */
  formState: T;
  /**
   * The raw React submit event passed from the React onSubmit callback
   */
  event: React.SyntheticEvent<HTMLFormElement>;
};

/**
 * Function callback that will be called when the form is submitted
 */
export type OnSubmitFunction<T = {}> = (params: OnSubmitParams<T>) => any | Promise<any>;

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
  onSubmit: OnSubmitFunction<T>;
  /**
   * Callback that is called whenever an attribute is changed
   */
  onChange?: (context: ReturnType<Form<T>["getContextValue"]>, attribute: string) => void;
  /**
   *
   * TODO(ade): sort out prop with children
   */
  children: any;
  /**
   * Errors for the form to be populated with with initializing the form. This
   * can be used to populated errors from the server on first page load.
   */
  errors?: ErrorBag;
}

/**
 * The internal state of the form
 */
export interface FormState<T> {
  /**
   * The internal status of the form
   */
  status: FormStatus;
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
     * The internal status of the form
     */
    status: this.getErrorStatus(this.props.errors || {}),
    /**
     * The form state of the current form
     */
    formState: this.props.initialValues,
    /**
     * Error messages for each attribute. Each key it the attribute name and the
     * value is an array of string that are the error messages returned from the
     * validation functions in the rules.
     */
    errors: this.props.errors || {},
  };

  /**
   * Callback to be called on submission of the form.
   *
   * This will validate the form and call the `onSubmit` props if there are no errors.
   * If the form is invalid then the state will be populated with the errors.
   */
  submit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({ status: "validating" });
    const errors = await this.props.validator?.validate(this.state.formState);
    const status = this.getErrorStatus(errors || {});
    if (errors && status === "error") {
      return this.setState({ errors, status });
    }

    this.setState({ status: "submitting" });

    try {
      await this.props.onSubmit({ formState: this.state.formState, event });
      this.setState({ status });
    } catch (error) {
      if (isErrorBagObject(error)) {
        return this.setErrors(error.errorBag);
      }

      this.setState({ status: "error" });
    }
  };

  /**
   * Gets the value for a given attribute
   */
  getAttribute = (attribute: string, defaultValue: any = "") => {
    const result = get(this.state.formState, attribute);
    return typeof result !== "undefined" ? result : defaultValue;
  };

  /**
   * Set the value for an attribute and queues this attribute to be validated
   */
  setAttribute = (attribute: string, value: any) => {
    const { formState, errors } = this.state;
    let { status } = this.state;

    set(formState, attribute, value);
    delete errors[attribute];

    if (this.props.validateTimeout > 0) {
      this.queueValidation(attribute, this.props.validateTimeout);
    }

    if (status === "clean") {
      status = "dirty";
    }

    this.setState({ formState, errors, status });
    this.props.onChange?.(this.getContextValue(), attribute);
  };

  /**
   * Gets the first error message found for an attribute. Undefined will be
   * returned if there are not validation errors for the attribute.
   */
  firstError = (attribute: string): string | undefined => {
    const attributeErrors = this.state.errors[attribute];
    if (typeof attributeErrors !== "undefined") {
      return attributeErrors[0];
    }
  };

  /**
   * Sets the errors for a the form. This will overwrite any errors that are in
   * the form and reset the status to the correct status based on the content
   * of the errors.
   */
  setErrors = (errors: ErrorBag) => this.setState({ errors, status: this.getErrorStatus(errors) });

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
    this.setState({ status: "validating" });

    for (const attribute of this.attributesToValidate) {
      const attributeErrors = await this.validateAttribute(attribute, formState);
      if (attributeErrors.length > 0) {
        errors[attribute] = attributeErrors;
      }
    }

    this.attributesToValidate = [];
    this.setState({ errors, status: this.getErrorStatus(errors) });
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
   * Get if the error bag has errors or is valid. In this case it will return
   * "clean" to indicate the form is valid.
   */
  private getErrorStatus(errors: ErrorBag): "clean" | "error" {
    return Object.keys(errors).length > 0 ? "error" : "clean";
  }

  /**
   * Gets all of the values that wil be available in the public context
   */
  private getContextValue = () => {
    return {
      status: this.state.status,
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
