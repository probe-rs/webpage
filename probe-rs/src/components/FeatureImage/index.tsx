import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import React, { ReactDOM } from "react";

type Props = {
  src: string;
  className?: string;
};

export default function FeatureImage({ src, className }: Props): JSX.Element {
  return <img src={src} className={className} />;
}

export function FeatureImageSmall({ src, className }: Props): JSX.Element {
  return (
    <FeatureImage src={src} className={className ?? "" + " " + styles.small} />
  );
}
