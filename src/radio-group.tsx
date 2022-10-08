import React, { FC } from "react";
import { useFormContext } from "./form-context";
import { AttributeContext, useAttributeContext } from "./attribute-context";
import { AttributeHook } from "./attribute-hook";

export type RadioAttributeHook = AttributeHook<HTMLInputElement>;

export interface OptionType {
  /**
   * The label that will be passed into the render props
   */
  label: string;
  /**
   * The value that will be passed into the render props. This will also be
   * checked against the attribute value to determine if the input is checked
   * or not
   */
  value: string;
}

export interface RadioGroupProps {
  /**
   * The attribute this input is for
   */
  attribute: string;
  /**
   * The options for this input
   */
  options: OptionType[];
  /**
   * The child element for this component
   */
  children: (props: { error: string }) => React.ReactNode;
}

export const RadioGroup: FC<RadioGroupProps> = ({ children, attribute, options }) => {
  const formContext = useFormContext();
  const error = formContext.firstError(attribute);

  return <AttributeContext.Provider value={{ attribute, options }}>{children({ error })}</AttributeContext.Provider>;
};

export interface RadioOptionProps {
  children: (props: RadioAttributeHook & { label: string }) => any;
}

export const RadioOption: FC<RadioOptionProps> = ({ children }) => {
  const formContext = useFormContext();
  const { attribute, options } = useAttributeContext<OptionType>();

  const value = formContext.getAttribute(attribute);
  const error = formContext.firstError(attribute);

  return (
    <>
      {options.map((option) =>
        children({
          error,
          label: option.label,
          props: {
            id: [attribute, option.value].join("-"),
            type: "radio",
            name: attribute,
            checked: option.value === value,
            onChange: () => formContext.setAttribute(attribute, option.value),
          },
        })
      )}
    </>
  );
};

export default RadioGroup;
