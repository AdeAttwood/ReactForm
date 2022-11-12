import React from "react";
import { MDXProvider as ReactMDXProvider } from "@mdx-js/react";

import components from "./mdx-components";

export const MDXProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <ReactMDXProvider components={components}>{children}</ReactMDXProvider>;
};

export default MDXProvider;
