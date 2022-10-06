import React, { FC } from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "../src/form";
import SelectGroup from "../src/select-group";

interface SelectProps {
  attribute: string;
  multiple?: boolean;
  options: {
    label: string;
    value: string;
  }[];
}

const Select: FC<SelectProps> = ({ attribute, options, multiple }) => (
  <SelectGroup attribute={attribute} multiple={multiple}>
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
  { value: "four", label: "Four" },
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

it("will render and submit multiple values", async () => {
  const onSubmit = jest.fn();
  const { getByLabelText, getByText } = render(
    <Form initialValues={{}} onSubmit={onSubmit}>
      <Select attribute="selectMe" options={options} multiple />
      <button>Submit</button>
    </Form>
  );

  userEvent.selectOptions(getByLabelText("Select"), ["three"]);
  fireEvent.click(getByText("Submit"));

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit).toBeCalledWith(
    expect.objectContaining({
      formState: expect.objectContaining({ selectMe: ["three"] }),
    })
  );
});
