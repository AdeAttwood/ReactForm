/**
 * The common type for the return type and render children props.
 */
export type AttributeHook<T> = {
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
     * The current value of the input.
     */
    value?: string | undefined;
    /**
     * The type of the input. This will only be set if there can only be one
     * value. Like on `useCheckboxAttribute` this can only be `checkbox`
     * however on `useTextAttribute` there can be different types this is up to
     * the developer to set.
     */
    type?: string;
    /**
     * If the attribute is checked or not. Only available when the type is
     * radio or checkbox
     */
    checked?: boolean;
    /**
     * True if this input will take multiple values.
     */
    multiple?: boolean;
    /**
     * The on change callback that will update the value in the form state
     */
    onChange: (props: React.ChangeEvent<T>) => void;
  };
};
