import { FC } from "react";

import { AttributeHook } from "./attribute-hook";
import { BaseGroupProps } from "./base-group-props";
import { useStringAttribute } from "./use-attribute";

export type TextAttributeHook = AttributeHook<HTMLInputElement>;

/**
 * Helper hook that will extract all the data necessary to render an input from
 * the from context
 */
export const useTextAttribute = (attribute: string): TextAttributeHook => {
  const { id, error, value, set } = useStringAttribute(attribute, "");

  const onChange: TextAttributeHook["props"]["onChange"] = ({ target: { value } }) => set(value);
  return { error, props: { id, name: attribute, value, onChange } };
};

/**
 * Input group component that is a wrapper for the `useTextAttribute` hook so
 * you don't have to create a new component for each input
 *
 * @example
 * <InputGroup attribute={attribute}>
 *  {({ props, error }) => (
 *    <div>
 *      <label htmlFor={props.id}>The Label</label>
 *      <input {...props} />
 *      {error && <span>{error}</span>}
 *    </div>
 *  )}
 *</InputGroup>
 */
export const InputGroup: FC<BaseGroupProps<TextAttributeHook>> = ({ children, attribute }) => {
  return children(useTextAttribute(attribute));
};

export default InputGroup;
