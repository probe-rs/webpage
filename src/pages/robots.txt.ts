import type { APIRoute } from "astro";

const disallowedAgents = [
  // OpenAI training generative AI foundation models
  // https://platform.openai.com/docs/bots
  "GPTBot",

  // FB training AI models
  // https://developers.facebook.com/docs/sharing/webmasters/web-crawlers
  "meta-externalagent",

  // Google Gemini generative APIs
  // https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
  "Google-Extended",
];

export const GET: APIRoute = ({ site }) => {
  // prettier-ignore
  return new Response(
`User-agent: *
Allow: /

${disallowedAgents.map(a =>
`User-agent: ${a}
Disallow: /`).join('\n\n')}

Sitemap: ${new URL("sitemap-index.xml", site).href}`);
};
