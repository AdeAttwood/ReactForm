import React, { FC } from "react";
import { useFormContext } from "./form-context";
import { AttributeContextProvider, useAttributeContext } from "./attribute-context";
import { AttributeHook } from "./attribute-hook";
import { BaseGroupProps } from "./base-group-props";

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

export interface RadioGroupProps extends BaseGroupProps<{ error: string }> {
  /**
   * The options for this input
   */
  options: OptionType[];
}

export const RadioGroup: FC<RadioGroupProps> = ({ children, attribute, options }) => {
  const formContext = useFormContext();
  const error = formContext.firstError(attribute);

  return React.createElement(AttributeContextProvider, { attribute, options }, children({ error }));
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
