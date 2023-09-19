import Base from "./base.jsx";
import DocNavbar from "../templates/doc-navbar.jsx";
import Toc from "../templates/toc.jsx";

export default (
  { toc, title, children, search, url, description, mainMenu, docsMenu },
  filters,
) => {
  const previousPost = search.previousPage(
    url,
    "url^=/docs/",
    "section_order order title",
  );
  const nextPost = search.nextPage(
    url,
    "url^=/docs/",
    "section_order order title",
  );
  return (
    <Base pageCss="docs.css" title={title}>
      <div className="doc">
        <DocNavbar
          mainMenu={mainMenu}
          docsMenu={docsMenu}
          url={url}
          search={search}
        />

        <main className="doc-content">
          <header className="doc-header">
            <h1>{title}</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: filters.md(description),
              }}
            />

            <Toc toc={toc} />
          </header>

          <div className="doc-body">
            {children}
          </div>

          <footer className="doc-footer">
            <ul className="doc-pagination">
              {previousPost &&
                (
                  <li className="is-prev">
                    <a href={previousPost.data.url} rel="prev">
                      ← Previous
                      <strong>{previousPost.data.title}</strong>
                    </a>
                  </li>
                )}
              {nextPost &&
                (
                  <li className="is-next">
                    <a href={nextPost.data.url} rel="next">
                      Next →
                      <strong>{nextPost.data.title}</strong>
                    </a>
                  </li>
                )}
            </ul>
          </footer>
        </main>
      </div>
    </Base>
  );
};
