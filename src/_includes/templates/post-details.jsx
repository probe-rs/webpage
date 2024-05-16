export default ({ search, authors, date, readingTime, filters }) => {
  const page = search.page(`type=author author="author"`);
  return (
    <div className="post-details">
      <p>
        by{" "}
        {authors.map((author, i) => (
          <>
            {page ? (
              <a data-pagefind-filter="author" href={page.data.url}>
                {author}
              </a>
            ) : (
              author
            )}
            {authors.length == 2
              ? i == authors.length - 1
                ? ""
                : " and "
              : authors.length > 2
              ? i == authors.length - 1
                ? ""
                : ", "
              : ""}
          </>
        ))}
      </p>
      <p>
        <time dateTime={filters.date(date, "DATETIME")}>
          {filters.date(date, "HUMAN_DATE")}
        </time>
      </p>
    </div>
  );
};
