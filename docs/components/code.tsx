import { Highlight, themes } from "prism-react-renderer";
import React from "react";

function Code({ children, className }: any) {
  const language = className?.replace(/language-/, "");

  if (!language) {
    return <code>{children}</code>;
  }

  return (
    <Highlight theme={themes.github} code={children.trim()} language={language}>
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

export default Code;
