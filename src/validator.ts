import { getAll } from "./dot-notation";

/**
 * Options that will be passed in that will help you get the data that will be
 * validated.
 */
type ValidationOptions = {
  /**
   * The path that is getting validated. This is the path you have used in your
   * rule. For example `users..name`
   */
  attribute: string;
  /**
   * The attribute string that is getting validated. This is the full string
   * that has been resolved from the path for example `users.0.name`
   */
  path: string;
  /**
   * The individual value that is getting validated.
   */
  value: any;
};

/**
 * A callback function that will validate a value. It must return a string, if
 * the string is not empty then it will include a error message that will be
 * displayed to the user.
 */
export type ValidationFunction<T> = (
  formState: T,
  options: ValidationOptions
) => string | undefined | Promise<string | undefined>;

/**
 * A list of rules that will can be validated. The key is a dot notation that
 * supports json path style deep scan for matching multiple values.
 */
type Rules<T> = Record<string, ValidationFunction<T>[]>;

/**
 * A list of error messages keyed by an attribute. This is the full resolved
 * notation that is used as a input attribute.
 */
export type ErrorBag = Record<string, string[]>;

export class Validator<T> {
  /**
   * This of rules that data will be validated against
   */
  private rules: Rules<T>;

  /**
   * Set up the validator
   */
  constructor(rules: Rules<T> = {}) {
    this.rules = rules;
  }

  /**
   * Creates a new validator with all the same rules.
   */
  clone() {
    // Shallow clone the rules into the new validators so the we are not
    // passing along the reference. This is so the `addRule` function will not
    // add to both validators.
    return new Validator<T>({ ...this.rules });
  }

  /**
   * Add a new rule to the validator. If a rules already exists for the
   * attribute then the function will be added to it.
   */
  addRule(attribute: string, validator: ValidationFunction<T>) {
    if (typeof this.rules[attribute] === "undefined") {
      this.rules[attribute] = [];
    }

    this.rules[attribute].push(validator);
    return this;
  }

  /**
   * Validates some data with the rules returning the errors.
   */
  async validate(data: T): Promise<ErrorBag> {
    const validationErrors: ErrorBag = {};
    const toValidate = Object.keys(this.rules)
      .map((attribute) => getAll(data as any, attribute).map((result) => ({ ...result, attribute })))
      .flat();

    for (const { path, value, attribute } of toValidate) {
      const errors = await this.applyFunction(attribute, path, value, data);
      if (errors.length > 0) {
        validationErrors[path] = errors;
      }
    }

    return validationErrors;
  }

  /**
   * Validates a single attribute and returns the errors
   */
  validateAttribute = (attribute: string, data: T): Promise<string[]> => {
    for (const validationPath of Object.keys(this.rules)) {
      for (const { path, value } of getAll(data as any, validationPath)) {
        if (path === attribute) {
          return this.applyFunction(validationPath, path, value, data);
        }
      }
    }

    return Promise.resolve([]);
  };

  /**
   * Calls all of the validation functions for an attribute
   */
  private async applyFunction(attribute: string, path: string, value: any, data: T) {
    return (
      await Promise.all(
        this.rules[attribute].map((validationFunction) => validationFunction(data, { attribute, path, value }))
      )
    ).filter((item): item is string => {
      return typeof item === "string" && item.length > 0;
    });
  }
}

/**
 * Tests to see if an object can be
 */
export function isErrorBagObject(object: any): object is { errorBag: ErrorBag } {
  return (
    object &&
    typeof object === "object" &&
    "errorBag" in object &&
    object.errorBag &&
    typeof object.errorBag === "object"
  );
}

/**
 * Helper function to create the validator functional style
 */
export function createValidator<T = any>(rules: Rules<T> = {}) {
  return new Validator(rules);
}

export default createValidator;
