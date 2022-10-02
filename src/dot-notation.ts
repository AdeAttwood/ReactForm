/**
 * The type that can be used as a notation to access an object. If a string is
 * passed in then it will be split in to an array on the `.` char in the string
 */
type Notation = string | string[];

/**
 * The type that can be passed in that you will access via a dot notation
 */
type ObjectType = Record<string, any> | undefined;

/**
 * Get a value from a object from a dot notation
 */
export function get(object: ObjectType, notation: Notation): any {
  if (typeof object === "undefined") {
    return undefined;
  }

  if (typeof notation === "string") {
    notation = notation.split(".");
  }

  for (let i = 0; i < notation.length; i++) {
    object = object[notation[i]];
    if (typeof object === "undefined") {
      return object;
    }
  }

  return object;
}

/**
 * Set a value in a object from a dot notation
 */
export function set(object: ObjectType, notation: Notation, value: any): void {
  if (typeof object === "undefined") {
    return undefined;
  }

  if (typeof notation === "string") {
    notation = notation.split(".");
  }

  while (notation.length > 1) {
    const index = notation.shift();
    if (typeof index === "undefined" || typeof object === "undefined") {
      break;
    }

    if (typeof object[index] === "undefined") {
      object[index] = {};
    }

    object = object[index];
  }

  const index = notation.shift();
  if (typeof index === "undefined" || typeof object === "undefined") {
    return;
  }

  object[index] = value;
}
