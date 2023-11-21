import Base from "./base.jsx";

export default (
  { title, header, install, badges, usage, support, latestRelease },
  filters,
) => {
  const assets = latestRelease.assets;
  const installerUrl =
    assets.find((a) => a.name == "probe-rs-installer.sh").browser_download_url;
  return (
    <Base pageCss="landing.css" title={title}>
      <div className="landing">
        <header className="landing-header">
          <h1 dangerouslySetInnerHTML={{ __html: header.title }}></h1>

          <figure className="landing-header-fire">
            <img src="/images/banner.svg" />
          </figure>

          <div className="landing-install">
            <div
              dangerouslySetInnerHTML={{ __html: filters.md(install.title) }}
            />

            <div className="landing-install-code">
              <pre><code>{ `curl -LsSf ${installerUrl} | sh` }</code></pre>
              <a
                className="landing-install-cta"
                href={install.url}
                aria-label="Continue to Getting Started"
              >
                <img src="/icons/arrow-right.svg" inline="true" />
              </a>
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: badges.map((badge) => filters.md(badge.html)).join(""),
              }}
            />
          </div>
        </header>

        <section className="landing-usage">
          {usage.map((block) => (
            <>
              <div className="landing-usage-text">
                <h2>{block.title}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: filters.md(block.description),
                  }}
                />
              </div>
              {block.code &&
                (
                  <div
                    className="landing-usage-code"
                    dangerouslySetInnerHTML={{
                      __html: filters.md(block.code),
                    }}
                  />
                )}
              {block.images &&
                (
                  <div className="landing-usage-image">
                    <div>
                      {block.images.map((image) => (
                        <img
                          src={image}
                          className={block.images.length > 1 ? "small" : ""}
                        />
                      ))}
                    </div>
                  </div>
                )}
            </>
          ))}
        </section>

        <section className="landing-suppport">
          <div className="landing-support-contribute">
            <h3>{support.contribute.title}</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: filters.md(support.contribute.description),
              }}
            />
          </div>
        </section>
      </div>
    </Base>
  );
};
