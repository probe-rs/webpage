import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

type Props = {
  title: String;
  code: String;
  language: String;
};

export default function FeatureCodeTab({ code, language }: Props) {
  return (
    <SyntaxHighlighter
      language={language}
      style={gruvboxDark}
      customStyle={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 20,
        margin: 0,
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
