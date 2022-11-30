import { FC } from "react";
import { AttributeHook } from "./attribute-hook";
import { BaseGroupProps } from "./base-group-props";
import { useBooleanAttribute } from "./use-attribute";

export type CheckAttributeHook = AttributeHook<HTMLInputElement>;

export const useCheckboxAttribute = (attribute: string): CheckAttributeHook => {
  const { id, error, value: checked, set } = useBooleanAttribute(attribute, false);

  const onChange: CheckAttributeHook["props"]["onChange"] = ({ target: { checked } }) => set(checked);
  return { error, props: { id, name: attribute, type: "checkbox", checked, onChange } };
};

export interface CheckGroupProps {
  /**
   * The attribute this input is for
   */
  attribute: string;
  /**
   * Render prop that will take all of data to render an input for the
   * attribute
   */
  children: (params: CheckAttributeHook) => JSX.Element;
}

export const CheckGroup: FC<BaseGroupProps<CheckAttributeHook>> = ({ children, attribute }) => {
  return children(useCheckboxAttribute(attribute));
};

export default CheckGroup;
