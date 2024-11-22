import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function FeatureTitle({ children }: Props): JSX.Element {
  return <h2>{children}</h2>;
}
