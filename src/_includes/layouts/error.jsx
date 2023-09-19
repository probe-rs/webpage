export const page_css = "error.css";

export default ({ title, children }, filters) => (
  <Base title={title}>
    <div className="error">
      <h1>{content.title}</h1>

      <figure className="error-fire">
        <img src="/images/banner.svg" />
      </figure>

      {filters.md(content.description)}

      <a href="{{ '/' |> url }}">
        <button type="button" className="button is-primary is-big">
          {content.button.title}
        </button>
      </a>
    </div>
  </Base>
);
