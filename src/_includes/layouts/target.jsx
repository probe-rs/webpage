import Base from "./base.jsx";
import humanFileSize from "./../helpers.js";

export default (
  { target, title },
  filters,
) => {
  return (
    <Base pageCss="target.css" title={title}>
      <main className="target">
        <section>
          <h1>{target.name}</h1>
        </section>
        <Memory target={target} />
      </main>
    </Base>
  );
};

const Memory = (
  { target: { cores, memory_map } },
  filters,
) => {
  const TOTAL_HEIGHT = 600;
  const WIDTH = 300;
  const TEXT_HEIGHT = 10;
  const RAM_COLOR = "#FFD700";
  const NVM_COLOR = "#0000FF";
  const GENERIC_COLOR = "#9D02D7";
  const UNKNOWN_COLOR = "#var(--color-background-3)";

  memory_map.sort((a, b) => {
    const { start: as } = Object.values(a)[0].range;
    const { start: bs } = Object.values(b)[0].range;
    if (as > bs) {
      return 1;
    } else if (as < bs) {
      return -1;
    } else return 0;
  });

  return (
    <section>
      <div className="body">
        <div className="column">
          <h2>Cores</h2>
          <div className="data">
            {cores.map((core) => {
              const { borderColor, type } = {
                "armv6m": { borderColor: "#ffd700", type: "ARMv6-M" },
                "armv7m": { borderColor: "#ffb14e", type: "ARMv7-M" },
                "armv7em": { borderColor: "#fa8775", type: "ARMv7-EM" },
                "armv7a": { borderColor: "#ea5f94", type: "ARMv7-A" },
                "armv8m": { borderColor: "#cd34b5", type: "ARMv8-M" },
                "armv8a": { borderColor: "#9d02d7", type: "ARMv7-A" },
                "riscv": { borderColor: "#0000ff", type: "RiSC-V" },
              }[core.type];

              return (
                <div className="item" style={{ borderColor }}>
                  <h3>{type}</h3>
                  <h4>{core.name}</h4>
                </div>
              );
            })}
          </div>
        </div>
        <div className="column">
          <h2>Memory Regions</h2>
          <div className="data">
            {memory_map.map((region) => {
              const type = Object.keys(region)[0];
              const info = Object.values(region)[0];
              const borderColor = region.Ram
                ? RAM_COLOR
                : (region.Nvm || region.Flash
                  ? NVM_COLOR
                  : (region.Generic ? GENERIC_COLOR : UNKNOWN_COLOR));
              return (
                <div className="item" style={{ borderColor }}>
                  <h3>{type}</h3>
                  {region.name}
                  <pre>
                    &nbsp; 0x{info.range.start.toString(16)}
                    <br />
                    - 0x{info.range.end.toString(16)}
                    <br />
                    {humanFileSize(info.range.end - info.range.start)}
                  </pre>
                  {cores.length > 1 &&
                    (
                      <p>
                        <h4>Access from cores</h4> [{info.cores.join(",")}]
                      </p>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
