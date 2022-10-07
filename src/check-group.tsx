import { FC } from "react";
import { useFormContext } from "./form-context";
import { AttributeHook } from "./attribute-hook";

export type CheckAttributeHook = AttributeHook<HTMLInputElement>;

export const useCheckboxAttribute = (attribute: string): CheckAttributeHook => {
  const formContext = useFormContext();

  return {
    error: formContext.firstError(attribute),
    props: {
      id: attribute,
      name: attribute,
      type: "checkbox",
      checked: Boolean(formContext.getAttribute(attribute)),
      onChange: ({ target: { checked } }) => {
        formContext.setAttribute(attribute, Boolean(checked));
      },
    },
  };
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

export const CheckGroup: FC<CheckGroupProps> = ({ children, attribute }) => {
  return children(useCheckboxAttribute(attribute));
};

export default CheckGroup;
