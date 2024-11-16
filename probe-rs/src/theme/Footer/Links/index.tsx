import React from "react";
import LinkItem from "../LinkItem";

import styles from "./styles.module.scss";

function Separator() {
  return <span className={styles.linkSeparator}>·</span>;
}

interface Props {
  readonly links: FooterLinkItemType[];
}

export type FooterLinkItemType = {
  label?: string;
  to?: string;
  href?: string;
  icon: string;
  html?: string;
  prependBaseUrlToHref?: string;
} & { [key: string]: unknown };

export default function FooterLinks({ links }: Props): JSX.Element {
  return (
    <div className={styles.footerLinks}>
      {links.map((item, i) => (
        <React.Fragment key={i}>
          <LinkItem item={item} />
          {links.length !== i + 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
}
