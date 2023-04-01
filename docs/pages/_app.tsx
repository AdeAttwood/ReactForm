import "../styles/light.scss";

import type { AppProps } from "next/app";
import React from "react";

import MDXProvider from "../components/mdx-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider>
      <Component {...pageProps} />
    </MDXProvider>
  );
}
