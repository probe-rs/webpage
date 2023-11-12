import Base from "./../base.jsx";
import PostDetails from "../../templates/post-details.jsx";

export default (
  { title, search, url },
  filters,
) => {
  const previousPost = search.previousPage(url, "type=posts");
  const nextPost = search.nextPage(url, "type=posts");
  return (
    <Base pageCss="posts.css" title={title}>
      <section className="posts">
        {search.pages("type=post", "date=asc", 3)
          .map((post) => (
            <article>
              <header>
                <h2 className="post-title">
                  <a
                    href={post.data.url}
                    aria-current={post.data.url == url ? "page" : false}
                  >
                    {post.data.title || post.data.url}
                  </a>
                </h2>
              </header>

              <PostDetails
                search={search}
                authors={post.data.authors}
                date={post.data.date}
                filters={filters}
                readingTime={post.data.readingTime}
              />

              <div
                className="post-excerpt body"
                dangerouslySetInnerHTML={{
                  __html: filters.md(post.data.excerpt),
                }}
              />

              <a href={post.data.url} className="link">
                Continue reading{" "}
                <span className="i baseline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                  >
                    <rect width="256" height="256" fill="none" />
                    <circle
                      cx="128"
                      cy="128"
                      r="96"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                    <polyline
                      points="112 88 152 128 112 168"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                  </svg>
                </span>
              </a>
            </article>
          ))}
      </section>
    </Base>
  );
};
