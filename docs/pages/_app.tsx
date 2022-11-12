import React from "react";
import MDXProvider from "../components/mdx-provider";
import type { AppProps } from "next/app";

import "../styles/light.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider>
      <Component {...pageProps} />
    </MDXProvider>
  );
}
