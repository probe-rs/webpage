import Base from "./base.jsx";
import humanFileSize from "./../helpers.js";

export default async (
  { title, description, loadTargets, latestRelease, ...data },
  filters,
) => {
  const { targets, families } = await loadTargets(latestRelease);
  return (
    <Base pageCss="targets.css" title={title}>
      <main className="targets">
        <header className="targets-header">
          <h1>{title}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: filters.md(description),
            }}
          />
        </header>

        <probe-rs-filter>
          <form className="targets-filter">
            <select name="family" className="selector">
              <option value="SHOW_ALL_FAMILIES">Show All</option>
              {families.map((name) => <option value={name}>{name}</option>)}
            </select>
          </form>

          <ul className="targets-list">
            {targets.map(
              (chip) => (
                <li
                  className="target"
                  data-family={chip.family}
                >
                  <a href={`/targets/${chip.name}`}>
                    <div className="border rounded m-2 p-2 border-secondary">
                      <h4>{chip.name}</h4>
                      <div>
                        <span className="tag is-small is-color-lightgreen">
                          {chip.cores.length}{" "}
                          {chip.cores.length > 1 ? "Cores" : "Core"}
                        </span>
                        {chip.memory_map.map((memory) => (
                          <>
                            {memory.Ram &&
                              (
                                <span className="tag is-small is-color-gold">
                                  {humanFileSize(
                                    memory.Ram.range.end -
                                      memory.Ram.range.start,
                                  )} Ram
                                </span>
                              )}
                            {memory.Nvm &&
                              (
                                <span className="tag is-small is-color-tomato">
                                  {humanFileSize(
                                    memory.Nvm.range.end -
                                      memory.Nvm.range.start,
                                  )} Flash
                                </span>
                              )}
                          </>
                        ))}
                      </div>
                    </div>
                  </a>
                </li>
              ),
            )}
          </ul>
        </probe-rs-filter>
      </main>
    </Base>
  );
};
