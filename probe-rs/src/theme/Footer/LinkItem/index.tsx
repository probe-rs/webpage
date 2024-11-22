import React, { Fragment } from "react";

import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import isInternalUrl from "@docusaurus/isInternalUrl";
import IconExternalLink from "@theme/Icon/ExternalLink";
import IconGithub from "./Icon/github";
import IconGithubSponsors from "./Icon/githubsponsors";
import IconMatrix from "./Icon/matrix";
import IconOpenCollective from "./Icon/opencollective";

import styles from "./styles.module.css";

interface Props {
  readonly item: FooterLinkItemType;
}

export type FooterLinkItemType = {
  label?: string;
  to?: string;
  href?: string;
  icon: string;
  html?: string;
  prependBaseUrlToHref?: string;
} & { [key: string]: unknown };

export default function FooterLinkItem({ item }: Props): JSX.Element {
  const { to, href, label, icon, prependBaseUrlToHref, ...props } = item;
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });

  const iconFunction = {
    github: IconGithub,
    githubsponsors: IconGithubSponsors,
    matrix: IconMatrix,
    opencollective: IconOpenCollective,
  }[icon];
  const iconComponent = iconFunction ? iconFunction() : <Fragment />;

  return (
    <Link
      className={styles.iconLink}
      {...(href
        ? {
          href: prependBaseUrlToHref ? normalizedHref : href,
        }
        : {
          to: toUrl,
        })}
      {...props}
    >
      {iconComponent}
      {label}
      {/* {href && !isInternalUrl(href) && <IconExternalLink />} */}
    </Link>
  );
}
