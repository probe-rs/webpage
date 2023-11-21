import Base from "../base.jsx";
import DocNavbar from "../../templates/doc-navbar.jsx";
import Toc from "../../templates/toc.jsx";
import PostDetails from "../../templates/post-details.jsx";

export default (
  { toc, title, children, search, url, readingTime, authors, date },
  filters,
) => {
  const previousPost = search.previousPage(url, "type=posts");
  const nextPost = search.nextPage(url, "type=posts");
  const page = search.page(`type=author author="author"`);
  return (
    <Base pageCss="post.css" title={title}>
      <div className="doc wide">
        <main className="doc-content-wide">
          <header className="doc-header">
            <h1>{title}</h1>
            <PostDetails
              search={search}
              authors={authors}
              filters={filters}
              date={date}
              readingTime={readingTime}
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
