import { useFormContext } from "./form-context";

export function createUseAttributeHook<T>(convert: (value: any) => T) {
  return (attribute: string, defaultValue: T) => {
    const { firstError, getAttribute, setAttribute } = useFormContext();

    return {
      id: attribute,
      error: firstError(attribute),
      value: getAttribute(attribute, defaultValue || ""),
      set: (value: any) => setAttribute(attribute, convert(value)),
    };
  };
}

export const useAttribute = createUseAttributeHook<string>((value) => value);
export const useStringAttribute = createUseAttributeHook<string>((value) => String(value));
export const useDateAttribute = createUseAttributeHook<Date>((value) => new Date(value));
export const useBooleanAttribute = createUseAttributeHook<boolean>((value) => Boolean(value));
