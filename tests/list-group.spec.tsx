import { act, render, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Form from "../src/form";
import { useFormContext } from "../src/form-context";
import { InputGroup } from "../src/input-group";
import { ListGroup, ListOption, useListAttribute } from "../src/list-group";

it("will render and submit with a radio list", async () => {
  const onSubmit = jest.fn();
  const { getByLabelText, getByText } = render(
    <Form initialValues={{}} onSubmit={onSubmit}>
      <ListGroup attribute="tags" newItem={() => ""}>
        {({ add }) => (
          <div>
            <ListOption>
              {({ index, remove }) => (
                <InputGroup key={index} attribute={`tags.${index}`}>
                  {({ props }) => (
                    <div>
                      <label htmlFor={props.id}>Tag {parseInt(index) + 1}</label>
                      <input {...props} />
                      <button type="button" onClick={remove}>
                        Remove {parseInt(index) + 1}
                      </button>
                    </div>
                  )}
                </InputGroup>
              )}
            </ListOption>
            <button type="button" onClick={add}>
              Add Tag
            </button>
          </div>
        )}
      </ListGroup>
      <button>Submit</button>
    </Form>
  );

  await userEvent.click(getByText("Add Tag"));
  await userEvent.click(getByText("Submit"));

  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { tags: [""] } }));

  await userEvent.type(getByLabelText("Tag 1"), "Tag One");
  await userEvent.click(getByText("Submit"));

  expect(onSubmit).toBeCalledTimes(2);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { tags: ["Tag One"] } }));

  await act(async () => userEvent.click(getByText("Add Tag")));

  await userEvent.type(getByLabelText("Tag 2"), "Tag Two");
  await userEvent.click(getByText("Submit"));

  expect(onSubmit).toBeCalledTimes(3);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { tags: ["Tag One", "Tag Two"] } }));

  await userEvent.click(getByText("Remove 1"));
  await userEvent.click(getByText("Submit"));

  expect(onSubmit).toBeCalledTimes(4);
  expect(onSubmit).toBeCalledWith(expect.objectContaining({ formState: { tags: ["Tag Two"] } }));
});

it("will reorder the items", async () => {
  const initialValues = { myList: ["One", "Two", "Three"] };
  const hook = renderHook(() => useListAttribute("myList", () => ""), {
    wrapper: ({ children }: any) => {
      return (
        <Form onSubmit={jest.fn} initialValues={initialValues}>
          {children}
        </Form>
      );
    },
  });

  expect(hook.result.current.value).toStrictEqual(["One", "Two", "Three"]);

  await act(async () => {
    hook.result.current.reorder(0, 3);
  });

  expect(hook.result.current.value).toStrictEqual(["Two", "Three", "One"]);
});

const useCompbinedHook = (attribute: string) => {
  const context = useFormContext();
  const listAttribute = useListAttribute(attribute, () => "");

  return { context, listAttribute };
};

it("will remove validation errors when removing an item", async () => {
  const initialValues = { myList: ["One", ""] };
  const errors = { "myList.1": ["Item cannot be blank"] };
  const hook = renderHook(() => useCompbinedHook("myList"), {
    wrapper: ({ children }: any) => {
      return (
        <Form onSubmit={jest.fn} initialValues={initialValues} errors={errors}>
          {children}
        </Form>
      );
    },
  });

  expect(hook.result.current.context.firstError("myList.1")).toStrictEqual("Item cannot be blank");

  await act(async () => {
    hook.result.current.listAttribute.remove(1);
  });

  expect(hook.result.current.context.firstError("myList.1")).toBeUndefined();
});

it("will remove errors from nested items", async () => {
  const initialValues = { myList: [{ name: "Testing" }, { name: "" }] };
  const errors = { "myList.1.name": ["Item name cannot be blank"] };
  const hook = renderHook(() => useCompbinedHook("myList"), {
    wrapper: ({ children }: any) => {
      return (
        <Form onSubmit={jest.fn} initialValues={initialValues} errors={errors}>
          {children}
        </Form>
      );
    },
  });

  expect(hook.result.current.context.firstError("myList.1.name")).toStrictEqual("Item name cannot be blank");

  await act(async () => {
    hook.result.current.listAttribute.remove(1);
  });

  expect(hook.result.current.context.firstError("myList.1.name")).toBeUndefined();
});
