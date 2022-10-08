import React, { FC } from "react";
import { useFormContext } from "./form-context";
import { AttributeContext, useAttributeContext } from "./attribute-context";

export interface ListGroupChildProps {
  /**
   * Callback function that will add a new item in to the list. This will use
   * the `newItem` function to generate a new item.
   */
  add: () => void;
}

export interface ListGroupProps {
  /**
   * The attribute this input is for
   */
  attribute: string;
  /**
   * Function that will return a new empty item. This will be called whenever
   * added a new item to the list. The default will return a new empty object.
   */
  newItem?: () => any;
  /**
   * Render a list of inputs
   */
  children: (props: ListGroupChildProps) => JSX.Element;
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

  return <AttributeContext.Provider value={{ attribute, options }}>{children({ add })}</AttributeContext.Provider>;
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
