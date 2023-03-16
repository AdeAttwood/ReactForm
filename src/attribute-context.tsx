import React from "react";

export type AttributeContextType<T> = {
  /**
   * The name of this attribute that the context if for
   */
  attribute: string;
  /**
   * A list of options that can be passed with the attribute if this type
   * requests multiple options
   */
  options: T[];
  /**
   * A callback function that will remove an item from the options at the index
   */
  remove?: (index: number) => void;
  /**
   * A callback that will reorder the options in the list. This will only apply
   * to a list group input
   */
  reorder?: (from: number, to: number) => void;
};

/**
 * Create the base context that will hold all of the form data
 */
export const AttributeContext = React.createContext<AttributeContextType<any>>({} as any);

export type AttributeContextProviderProps<T> = AttributeContextType<T> & React.PropsWithChildren;

export function AttributeContextProvider<T>(props: AttributeContextProviderProps<T>) {
  const { children, ...value } = props;
  return React.createElement(AttributeContext.Provider, { value }, children);
}

/**
 * Hook so that you can access the form data
 */
export function useAttributeContext<T extends {}>(): AttributeContextType<T> {
  return React.useContext(AttributeContext);
}
