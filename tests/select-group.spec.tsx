import React, { FC } from "react";
import { render, fireEvent } from "@testing-library/react";
import Form from "../src/form";
import SelectGroup from "../src/select-group";

interface SelectProps {
  attribute: string;
  options: {
    label: string;
    value: string;
  }[];
}

const Select: FC<SelectProps> = ({ attribute, options }) => (
  <SelectGroup attribute={attribute}>
    {({ error, props }) => (
      <div>
        <label htmlFor={props.id}>Select</label>
        <select {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span>{error}</span>}
      </div>
    )}
  </SelectGroup>
);

const options = [
  { value: "one", label: "One" },
  { value: "two", label: "Two" },
  { value: "three", label: "Three" },
];

it("will render and submit stuff", async () => {
  const onSubmit = jest.fn();
  const { getByLabelText, getByText } = render(
    <Form initialValues={{}} onSubmit={onSubmit}>
      <Select attribute="selectMe" options={options} />
      <button>Submit</button>
    </Form>
  );

  fireEvent.change(getByLabelText("Select"), { target: { value: "two" } });
  fireEvent.click(getByText("Submit"));

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit).toBeCalledWith(
    expect.objectContaining({
      formState: expect.objectContaining({ selectMe: "two" }),
    })
  );
});
