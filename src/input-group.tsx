import { FC } from "react";
import { useFormContext } from "./form-context";

export type TextAttributeHook = {
  /**
   * An error on the attribute if there is one
   */
  error: string | undefined;
  /**
   * The props that can be passed to the input with all the necessary
   * attributes to hook up the input
   */
  props: {
    /**
     * The ID of the input
     */
    id: string;
    /**
     * The name of the input
     */
    name: string;
    /**
     * The current value of the input
     */
    value: string | undefined;
    /**
     * The on change callback that will update the value in the form state
     */
    onChange: (props: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

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
