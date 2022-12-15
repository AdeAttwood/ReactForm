import React, { FC } from "react";
import { AttributeContextProvider, useAttributeContext } from "./attribute-context";
import { BaseGroupProps } from "./base-group-props";
import { createUseAttributeHook } from "./use-attribute";

export interface ListGroupChildProps {
  /**
   * Callback function that will add a new item in to the list. This will use
   * the `newItem` function to generate a new item.
   */
  add: () => void;
}

export interface ListGroupProps extends BaseGroupProps<ListGroupChildProps> {
  /**
   * Function that will return a new empty item. This will be called whenever
   * added a new item to the list. The default will return a new empty object.
   */
  newItem?: () => any;
}

/**
 * The function that will be used as the default get new item prop. This will
 * return an empty object.
 */
const defaultNewItem = () => ({});

/**
 * Internal hook that will return the context state value as an array of items
 * for the list
 */
const useArrayAttribute = createUseAttributeHook((value) => value);

/**
 * Hook that will to abstract all the list logic.
 */
export function useListAttribute<T>(attribute: string, newItem: () => T) {
  const { id, error, value, set } = useArrayAttribute(attribute, []);
  const add = () => set([...value, newItem()]);

  return { id, error, value, set, add };
}

export const ListGroup: FC<ListGroupProps> = ({ children, attribute, newItem }) => {
  const { value: options, add } = useListAttribute(attribute, newItem || defaultNewItem);

  return React.createElement(AttributeContextProvider, { attribute, options }, children({ add }));
};

ListGroup.defaultProps = {
  newItem: defaultNewItem,
};

export interface ListOptionChildProps {
  /**
   * The index this option is at
   */
  index: string;
}

export interface ListOptionProps {
  /**
   * Render all the form elements for this list option
   */
  children: (props: ListOptionChildProps) => JSX.Element;
}

export const ListOption: FC<ListOptionProps> = ({ children }) => {
  const { options } = useAttributeContext();

  return (
    <>
      {Object.keys(options).map((index) =>
        children({
          index,
        })
      )}
    </>
  );
};

export default ListGroup;
