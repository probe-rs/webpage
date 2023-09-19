export default ({ docsMenu, url, search }) => (
  <nav className="doc-navbar">
    {docsMenu.map((section) => (
      <details className="doc-navbar-section" open={url.includes(section.id)}>
        <summary>
          <span className="doc-navbar-section-title">{section.title}</span>
        </summary>
        <ul className="doc-navbar-section-links">
          {search.pages("url^=/docs/" + section.id, "order title").map(
            (page) => (
              <li>
                {page.data.url == url
                  ? (
                    <a
                      href={page.data.url}
                      aria-current="page"
                      title={page.data.description}
                    >
                      {page.data.title}
                    </a>
                  )
                  : (
                    <a href={page.data.url} title={page.data.description}>
                      {page.data.title}
                    </a>
                  )}
              </li>
            ),
          )}
        </ul>
      </details>
    ))}
  </nav>
);
