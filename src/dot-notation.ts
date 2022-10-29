/**
 * The type that can be used as a notation to access an object. If a string is
 * passed in then it will be split in to an array on the `.` char in the string
 */
type Notation = string | string[];

/**
 * The type that can be passed in that you will access via a dot notation
 */
type ObjectType = Record<string, any> | undefined;

type ObjectMatch = {
  /**
   * The resolved path to the matching value from the notation
   */
  path: string;
  /**
   * The end value that has been resolved
   */
  value: any;
};

/**
 * Get a value from a object from a dot notation
 */
export function get(object: ObjectType, notation: Notation): any {
  return getAll(object, notation)?.[0]?.value || undefined;
}

/**
 * Gets all matching values from a notation. This supports json path style deep
 * scan `users..name` for matching multiple items in an array of objects.
 */
export function getAll(object: ObjectType, notation: Notation): ObjectMatch[] {
  let matches: any[] = [];
  if (typeof object === "undefined") {
    return matches;
  }

  if (typeof notation === "string") {
    notation = notation.split(".");
  }

  for (let i = 0; i < notation.length; i++) {
    const currentNotation = notation[i];

    if (currentNotation === "" && Array.isArray(object)) {
      const subNotation = notation.slice(i + 1, notation.length);
      const prefixNotation = notation.slice(0, i);
      matches = matches.concat(
        object
          ?.map((item: any, index) => {
            return getAll(item, subNotation)
              .map(({ path, value }) => {
                return {
                  path: prefixNotation
                    .concat([index.toString(), path])
                    .filter((item) => item !== "")
                    .join("."),
                  value,
                };
              })
              .flat();
          })
          .flat()
      );
    }

    object = object?.[currentNotation];
  }

  if (!notation.includes("")) {
    matches.push({ path: notation.join("."), value: object });
  }

  return matches;
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
