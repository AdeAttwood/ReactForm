import React from "react";
import Form from "./form";

export type FormContextType<T extends {}> = ReturnType<Form<T>["getContextValue"]>;

/**
 * Create the base context that will hold all of the form data
 */
export const FormContext = React.createContext<FormContextType<any>>({} as any);

/**
 * Hook so that you can access the form data
 */
export function useFormContext<T extends {}>(): FormContextType<T> {
  return React.useContext(FormContext);
}
