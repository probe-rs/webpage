import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import vento from "lume/plugins/vento.ts";
import attributes from "lume/plugins/attributes.ts";
import base_path from "lume/plugins/base_path.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import date from "lume/plugins/date.ts";
import esbuild from "lume/plugins/esbuild.ts";
import eta from "lume/plugins/eta.ts";
import feed from "lume/plugins/feed.ts";
import filter_pages from "lume/plugins/filter_pages.ts";
import inline from "lume/plugins/inline.ts";
import mdx from "lume/plugins/mdx.ts";
import picture from "lume/plugins/picture.ts";
import imagick from "lume/plugins/imagick.ts";
import sass from "lume/plugins/sass.ts";
import source_maps from "lume/plugins/source_maps.ts";
import svgo from "lume/plugins/svgo.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.1.0/toc/mod.ts";
import { Page } from "lume/core.ts";

const markdown = {
  plugins: [toc],
  keepDefaultPlugins: true,
};

const site = lume(
  {
    location: new URL("https://probe.rs"),
    dest: "./target",
    src: "./src",
    server: {
      // open: true,
    },
  },
  { markdown }
);

site.copy("static", ".");
site.copy([".gif"]);
site.use(jsx());
site.use(vento());
site.use(attributes());
site.use(base_path());
site.use(code_highlight());
site.use(date());
site.use(esbuild());
site.use(eta());
site.use(feed());
site.use(filter_pages());
site.use(inline());
site.use(mdx());
site.use(picture());
site.use(imagick());
site.use(sass());
site.use(source_maps());
site.use(svgo());
site
  .scopedUpdates((path) => path.endsWith(".png") || path.endsWith(".jpg"))
  .filter("slice", (arr, length) => arr.slice(0, length))
  .process([".html"], (page) => {
    const doc = page.document!;
    const blocks = doc.querySelectorAll("probe-rs-code");

    blocks.forEach((block, i) => {
      const pres = (block as unknown as HTMLElement).querySelectorAll(
        ":scope > pre"
      );

      const menu = doc.createElement("ul");
      menu.setAttribute("role", "tablist");
      menu.setAttribute("aria-label", "Code Tabs");
      menu.classList.add("probe-rs-code-menu");

      pres.forEach((pre, j) => {
        const title = pre.querySelector("code")!.getAttribute("title")!;

        const li = doc.createElement("li");
        li.setAttribute("role", "presentation");

        const button = doc.createElement("button");
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", j === 0 ? true : false);
        button.setAttribute("aria-controls", `panel-${i + 1}-${j + 1}`);
        button.setAttribute("id", `tab-${i + 1}-${j + 1}`);
        button.setAttribute("tabindex", j === 0 ? 0 : -1);
        button.innerText = title;
        button.classList.add("probe-rs-code-tab");

        if (j > 0) {
          pre.setAttribute("hidden", "true");
        } else {
          button.classList.add("is-active");
        }

        pre.setAttribute("role", "tabpanel");
        pre.setAttribute("aria-labelledby", `tab-${i + 1}-${j + 1}`);
        pre.setAttribute("id", `panel-${i + 1}-${j + 1}`);
        pre.setAttribute("tabindex", "0");

        li.append(button);
        menu.appendChild(li);
      });

      (block as unknown as HTMLElement).prepend(menu as unknown as Node);
    });
  })
  .preprocess([".md"], (page: Page) => {
    page.data.excerpt ??= (page.data.content as string).split(
      /<!--\s*more\s*-->/i
    )[0];
  });

export default site;
