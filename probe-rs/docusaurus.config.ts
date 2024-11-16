import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "probe-rs",
  tagline: "embedded development made easy",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://probe.rs",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "probe-rs", // Usually your GitHub org/user name.
  projectName: "webpage", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: ["docusaurus-plugin-sass"],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/probe-rs/webpage/tree/master",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/probe-rs/webpage/tree/master/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        pages: {},
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "probe-rs",
      logo: {
        alt: "probe-rs logo",
        src: "img/logo.svg",
      },
      items: [
        { to: "/targets", label: "Targets", position: "right" },
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "right",
          label: "Documentation",
        },
        { to: "/blog", label: "Blog", position: "right" },
        {
          href: "https://github.com/probe-rs/probe-rs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          items: [
            {
              label: "Matrix Chat",
              href: "https://matrix.href/#/#probe-rs:matrix.org",
              icon: "matrix",
            },
            {
              label: "GitHub",
              href: "https://github.com/probe-rs/probe-rs",
              icon: "github",
            },
            {
              label: "Open Collective",
              href: "https://opencollective.com/probe-rs",
              icon: "opencollective",
            },
            {
              label: "Github Sponsors",
              href: "https://github.com/sponsors/probe-rs",
              icon: "githubsponsors",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} the probe-rs project`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
