import React from "react";
import InputGroup from "../src/input-group";

export const Input = ({ attribute, type }: { attribute: string; type?: string }) => (
  <InputGroup attribute={attribute}>
    {({ props, error }) => (
      <div>
        <label htmlFor={attribute}>{attribute}</label>
        <input {...props} type={type || "text"} />
        <p>{error}</p>
      </div>
    )}
  </InputGroup>
);

export default Input;
