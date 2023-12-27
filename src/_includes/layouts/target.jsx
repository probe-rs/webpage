import Base from "./base.jsx";
import humanFileSize from "./../helpers.js";

export default async ({ target, title }, filters) => {
  let svd = undefined;
  if (target.svd) {
    const decoder = new TextDecoder("utf-8");
    const data = await Deno.readFile(`src/targets/nrf52.json`);
    const json = decoder.decode(data);
    svd = JSON.parse(json);
  }

  return (
    <Base pageCss="target.css" title={title}>
      <main className="target">
        <section>
          <h1>{target.name}</h1>
        </section>
        <Memory target={target} />
        <SVD svd={svd} />
      </main>
    </Base>
  );
};

const Memory = ({ target: { cores, memory_map } }, filters) => {
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
                armv6m: { borderColor: "#ffd700", type: "ARMv6-M" },
                armv7m: { borderColor: "#ffb14e", type: "ARMv7-M" },
                armv7em: { borderColor: "#fa8775", type: "ARMv7-EM" },
                armv7a: { borderColor: "#ea5f94", type: "ARMv7-A" },
                armv8m: { borderColor: "#cd34b5", type: "ARMv8-M" },
                armv8a: { borderColor: "#9d02d7", type: "ARMv7-A" },
                riscv: { borderColor: "#0000ff", type: "RiSC-V" },
                xtensa: { borderColor: "#ff0000", type: "Xtensa" },
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
                : region.Nvm || region.Flash
                ? NVM_COLOR
                : region.Generic
                ? GENERIC_COLOR
                : UNKNOWN_COLOR;
              return (
                <div className="item" style={{ borderColor }}>
                  <h3>{type}</h3>
                  {region.name}
                  <pre>
                    &nbsp; 0x{info.range.start.toString(16)}
                    <br />- 0x{info.range.end.toString(16)}
                    <br />
                    {humanFileSize(info.range.end - info.range.start)}
                  </pre>
                  {cores.length > 1 && (
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

const SVD = ({ svd }, filters) => {
  if (!svd) {
    return <></>;
  }
  return (
    <section>
      <div className="body">
        <div className="container">
          <div className="data">
            <div className="svd" style={{ borderColor: "#ffb14e" }}>
              {svd.peripherals.map((peripheral) => (
                <Peripheral peripheral={peripheral} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Peripheral = ({ peripheral }, filters) => {
  return (
    <div className="peripheral">
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h3>
          {peripheral.name} @ 0x{peripheral.baseAddress.toString(16)} -{" "}
          {peripheral.description}
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          height="16"
          width="16"
          style={{ display: "inline", paddingTop: "2.5px" }}
        >
          <rect width="256" height="256" fill="none" />
          <path
            d="M181.66,122.34l-80-80A8,8,0,0,0,88,48V208a8,8,0,0,0,13.66,5.66l80-80A8,8,0,0,0,181.66,122.34Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};
