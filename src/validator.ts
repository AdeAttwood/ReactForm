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
type ValidationFunction<T> = (formState: T, options: ValidationOptions) => string;

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
    for (const [attribute, validationFunctions] of Object.entries(this.rules)) {
      getAll(data as any, attribute).forEach(({ path, value }) => {
        const errors = validationFunctions
          .map((validationFunction) => validationFunction(data, { attribute, path, value }))
          .filter((item) => item);

        if (errors.length > 0) {
          validationErrors[path] = errors;
        }
      });
    }

    return validationErrors;
  }
}

/**
 * Helper function to create the validator functional style
 */
export function createValidator<T = any>(rules: Rules<T> = {}) {
  return new Validator(rules);
}

export default createValidator;
