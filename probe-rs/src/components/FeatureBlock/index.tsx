import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import React from "react";
import FeatureTitle from "../FeatureTitle";
import FeatureCode from "../FeatureCode";
import FeatureImage, { FeatureImageSmall } from "../FeatureImage";
import FeatureDescription from "../FeatureDescription";

type Props = {
  children: React.ReactNode;
};

export default function FeatureBlock({ children }: Props): JSX.Element {
  let title = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === FeatureTitle) {
        return child;
      }
    }
    return null;
  }).filter((v) => v);

  let description = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === FeatureDescription) {
        return child;
      }
    }
    return null;
  }).filter((v) => v);

  let code = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === FeatureCode) {
        return child;
      }
    }
    return null;
  }).filter((v) => v);

  let images = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === FeatureImage || child.type === FeatureImageSmall) {
        return child;
      }
    }
    return null;
  }).filter((v) => v);

  return (
    <section className={styles.landingUsage}>
      <div className={styles.landingUsageText}>
        {title}
        {description}
      </div>
      {code && code}
      {images.length >= 1 && (
        <div className={styles.landingUsageImage}>
          <div>{images}</div>
        </div>
      )}
    </section>
  );
}
