import { FC } from "react";
import { useFormContext } from "./form-context";
import { AttributeHook } from "./attribute-hook";

export type TextAttributeHook = AttributeHook<HTMLInputElement>;

/**
 * Helper hook that will extract all the data necessary to render an input from
 * the from context
 */
export const useTextAttribute = (attribute: string): TextAttributeHook => {
  const formContext = useFormContext<{}>();

  return {
    error: formContext.firstError(attribute),
    props: {
      id: attribute,
      name: attribute,
      value: formContext.getAttribute(attribute),
      onChange: ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        formContext.setAttribute(attribute, value);
      },
    },
  };
};

export interface InputGroupProps {
  /**
   * The attribute this input is for
   */
  attribute: string;
  /**
   * Render prop that will take all of data to render an input for the
   * attribute
   */
  children: (params: TextAttributeHook) => JSX.Element;
}

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
export const InputGroup: FC<InputGroupProps> = ({ children, attribute }) => {
  return children(useTextAttribute(attribute));
};

export default InputGroup;
