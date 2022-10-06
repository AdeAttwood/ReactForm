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
    multiple?: boolean;
    /**
     * The on change callback that will update the value in the form state
     */
    onChange: (props: React.ChangeEvent<T>) => void;
  };
};
