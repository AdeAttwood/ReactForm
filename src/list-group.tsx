import React, { FC } from "react";
import { useFormContext } from "./form-context";
import { AttributeContextProvider, useAttributeContext } from "./attribute-context";
import { BaseGroupProps } from "./base-group-props";

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

export const ListGroup: FC<ListGroupProps> = ({ children, attribute, newItem }) => {
  const { getAttribute, setAttribute } = useFormContext();
  const options = getAttribute(attribute, []);

  if (typeof newItem === "undefined") {
    throw new Error("newItem must not be undefined.");
  }

  const add = () => {
    setAttribute(attribute, [...getAttribute(attribute, []), newItem()]);
  };

  return React.createElement(AttributeContextProvider, { attribute, options }, children({ add }));
};

ListGroup.defaultProps = {
  newItem: () => ({}),
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
