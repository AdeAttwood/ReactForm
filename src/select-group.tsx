import { FC } from "react";
import { AttributeHook } from "./attribute-hook";
import { useFormContext } from "./form-context";

export type SelectAttributeHook = AttributeHook<HTMLSelectElement>;

const filterOptions = (selectedOptions: HTMLCollectionOf<HTMLOptionElement>) => {
  return Array.from(selectedOptions)
    .map((option) => option.value)
    .filter((option) => option.length);
};

export const useSelectAttribute = (attribute: string, multiple?: boolean): SelectAttributeHook => {
  const formContext = useFormContext();

  return {
    error: formContext.firstError(attribute),
    props: {
      id: attribute,
      name: attribute,
      value: formContext.getAttribute(attribute, multiple ? [] : ""),
      multiple,
      onChange: ({ target: { value, selectedOptions } }) => {
        formContext.setAttribute(attribute, multiple ? filterOptions(selectedOptions) : value);
      },
    },
  };
};

export interface SelectGroupProps {
  /**
   * The attribute this input is for
   */
  attribute: string;
  /**
   * If the select input can handel multiple options being selected
   *
   * @default false
   */
  multiple?: boolean;
  /**
   * Render prop that will take all of data to render an input for the
   * attribute
   */
  children: (params: SelectAttributeHook) => JSX.Element;
}

export const SelectGroup: FC<SelectGroupProps> = ({ children, attribute, multiple }) => {
  return children(useSelectAttribute(attribute, multiple));
};

export default SelectGroup;
