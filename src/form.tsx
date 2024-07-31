import React from "react";

import { useFormContext } from "./form-context";
import { FormProvider, FormProviderProps } from "./form-provider";

function FormElement({ children, props }: any) {
  const { submit } = useFormContext();
  return (
    <form {...props} onSubmit={submit}>
      {children}
    </form>
  );
}

export type FormProps<T extends {}> = Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onChange"> &
  FormProviderProps<T>;

export function Form<T extends {}>(props: FormProps<T>) {
  const { initialValues, validateTimeout, validator, onSubmit, onChange, errors, children } = props;

  return (
    <FormProvider {...{ initialValues, validateTimeout, validator, onSubmit, onChange, errors }}>
      <FormElement {...props}>{children}</FormElement>
    </FormProvider>
  );
}

export default Form;
