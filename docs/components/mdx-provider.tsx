import React from "react";
import { MDXProvider as ReactMDXProvider } from "@mdx-js/react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";

/**
 * TODO(ade): move this into its own file
 */
function Code({ children, className }: any) {
  const language = className?.replace(/language-/, "") as Language;

  if (!language) {
    return <code>{children}</code>;
  }

  return (
    <Highlight {...defaultProps} theme={theme} code={children.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className + " px-3 py-4"} style={{ ...style }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

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

export const MDXProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <ReactMDXProvider components={components}>{children}</ReactMDXProvider>;
};

export default MDXProvider;
