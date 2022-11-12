import React from "react";
import Code from "./code";

const components = {
  /**
   * Pre tags don't need to rendered anything because they are rendered inside
   * the code block so we can add proper styles to them from the syntax
   * highlighter
   */
  pre: ({ children }: any) => children,
  code: Code,
  table: ({ children }: any) => <table className="table">{children}</table>,
};

export default components;
