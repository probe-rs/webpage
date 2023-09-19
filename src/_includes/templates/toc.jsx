export default ({ toc }) => {
  return toc.length
    ? (
      <nav className="toc">
        <ol>
          {toc.map((item) => (
            <li>
              <a href={`#${item.slug}`}>{item.text}</a>
              {(item.children.length > 0) &&
                (
                  <ul>
                    {item.children.map((child) => (
                      <li>
                        <a href={`#${child.slug}`}>{child.text}</a>
                        {(item.children.length > 0) &&
                          (
                            <ul>
                              {child.children.map((child2) => (
                                <li>
                                  <a href={`#${child2.slug}`}>{child2.text}</a>
                                </li>
                              ))}
                            </ul>
                          )}
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ol>
      </nav>
    )
    : "";
};
