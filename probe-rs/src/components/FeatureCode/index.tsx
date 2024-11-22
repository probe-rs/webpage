import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import React, { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import FeatureCodeTab from "../FeatureCodeTab";

type Props = {
  children: React.ReactNode;
};

export default function FeatureCode({ children }: Props): JSX.Element {
  const [active, setActive] = useState(0);
  return (
    <div className={styles.landingUsageCode}>
      <ul className={styles.probeRsCodeMenu}>
        {React.Children.map(children, (c: React.ReactElement, index) => (
          <li>
            <button
              className={
                styles.probeRsCodeTab +
                (active === index ? ` ${styles.isActive}` : "")
              }
              onClick={() => setActive(index)}
            >
              {c.props.title}
            </button>
          </li>
        ))}
      </ul>
      {React.Children.toArray(children)[active]}
    </div>
  );
}
