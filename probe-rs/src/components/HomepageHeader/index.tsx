import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import styles from "./styles.module.scss";

export default function HomepageHeader(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.landingHeader}>
      <figure className={styles.landingHeaderLogo}>
        <img src="/images/banner.svg" />
      </figure>

      <h1>
        The <span>user-friendly & flexible</span> embedded toolkit{" "}
        <span> that works </span>
      </h1>

      <div className={styles.landingInstall}>
        <h3>
          Run the following or follow the{" "}
          <a href="/docs/getting-started/installation">instructions</a> for
          different installation methods
        </h3>

        <div className={styles.landingInstallCode}>
          <pre>
            <code>
              curl --proto '=https' --tlsv1.2 -LsSf
              https://github.com/probe-rs/probe-rs/releases/latest/download/probe-rs-tools-installer.sh
              | sh
            </code>
          </pre>
        </div>

        <div>
          <a href="https://crates.io/crates/probe-rs" target="_blank"><img src="https://img.shields.io/crates/v/probe-rs" alt="crates.io" className="m-1" /></a>
          <a href="https://docs.rs/probe-rs" target="_blank"><img src="https://docs.rs/probe-rs/badge.svg" alt="documentation" className="m-1" /></a>
          <a href="https://github.com/probe-rs/probe-rs/actions" target="_blank"><img src="https://img.shields.io/github/actions/workflow/status/probe-rs/probe-rs/ci.yml?branch=master" alt="GH Actions Status" className="m-1" /></a>
          <a href="https://matrix.to/#/#probe-rs:matrix.org" target="_blank"><img src="https://img.shields.io/badge/chat-probe--rs%3Amatrix.org-brightgreen" alt="chat" className="m-1" /></a>
        </div>
      </div>
    </header>
  );
}