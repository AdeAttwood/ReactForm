import * as ReactForm from "../src";

test.each([
  // Components
  "CheckGroup",
  "Form",
  "InputGroup",
  "ListGroup",
  "ListOption",
  "RadioGroup",
  "RadioOption",
  "SelectGroup",

  // Hooks
  "useAttribute",
  "useAttributeContext",
  "useBooleanAttribute",
  "useCheckboxAttribute",
  "useDateAttribute",
  "useFormContext",
  "useSelectAttribute",
  "useStringAttribute",
  "useTextAttribute",
])("'%s' is exported from the index file", (variable: string) => {
  expect(ReactForm[variable as keyof typeof ReactForm]).not.toBeUndefined();
});
