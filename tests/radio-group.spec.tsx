import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "../src/form";
import { RadioGroup, RadioOption } from "../src/radio-group";

const options = [
  { label: "One", value: "one" },
  { label: "Two", value: "two" },
];

it("will render and submit with a radio list", async () => {
  const onSubmit = jest.fn();
  const { getByLabelText, getByText } = render(
    <Form initialValues={{}} onSubmit={onSubmit}>
      <RadioGroup attribute="pickOne" options={options}>
        {() => (
          <RadioOption>
            {({ props, label }) => (
              <div key={props.id} className="form-check">
                <input className="form-check-input" {...props} />
                <label className="form-check-label" htmlFor={props.id}>
                  {label}
                </label>
              </div>
            )}
          </RadioOption>
        )}
      </RadioGroup>
      <button>Submit</button>
    </Form>
  );

  await userEvent.click(getByLabelText("One"));
  await userEvent.click(getByText("Submit"));

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit).toBeCalledWith({ formState: { pickOne: "one" } });

  await userEvent.click(getByLabelText("Two"));
  await userEvent.click(getByText("Submit"));

  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit).toBeCalledWith({ formState: { pickOne: "two" } });
});
