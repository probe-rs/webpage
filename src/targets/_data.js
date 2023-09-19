import { Octokit } from "https://esm.sh/octokit@3.1.0?dts";
import { parse } from "https://deno.land/std@0.194.0/yaml/mod.ts";
import { Schema } from "https://deno.land/std@0.194.0/yaml/schema.ts";
import { def } from "https://deno.land/std@0.194.0/yaml/schema/default.ts";
import { Type } from "https://deno.land/std@0.194.0/yaml/type.ts";
import {
  BlobReader,
  TextWriter,
  ZipReader,
} from "https://deno.land/x/zipjs/index.js";
import { getJep106Manufacturer } from "../_includes/jep106.js";

export const layout = "layouts/plugins.jsx";
export const mainMenu = "plugins";

const auth = Deno.env.get("GITHUB_TOKEN");
const octokit = new Octokit({
  auth,
});

// console.log(
//   "Ratelimits: " +
//     JSON.stringify(
//       (
//         await octokit.request("GET /rate_limit", {
//           headers: {
//             "X-GitHub-Api-Version": "2022-11-28",
//           },
//         })
//       ).data.resources,
//       null,
//       4
//     )
// );

const loadZip = async (url) => {
  const fileObj = await fetch(url ?? 'https://github.com/probe-rs/probe-rs/archive/refs/heads/master.zip');
  const reader = new BlobReader(await fileObj.blob());

  const zipReader = new ZipReader(reader);
  const entries = await zipReader.getEntries();
  const filteredEntries = entries.filter((e) =>
    e.filename.includes("/targets/") &&
    e.filename.split("/").length === 4 &&
    !e.filename.endsWith("/")
  );
  return filteredEntries;
};

export const loadTargets = async (latestRelease) => {
  // const ts = await loadZip(latestRelease.zipball_url);
  const ts = await loadZip();

  const targets = [];
  const families = [];
  let manufacturers = {};
  const cache = {};
  for (const target of ts) {
    const writer = new TextWriter();

    const data = await target.getData(writer);
    const targetDescription = await openTarget(data);

    const variants = targetDescription.variants;
    const jep = targetDescription.manufacturer
      ? getJep106Manufacturer(
        targetDescription.manufacturer.cc,
        targetDescription.manufacturer.id,
      )
      : undefined;

    for (const variant of variants) {
      variant.family = targetDescription.name;
      variant.manufacturer = jep;

      if (!cache[variant.name]) {
        cache[variant.name] = JSON.stringify(variant);
        targets.push(variant);
      }
    }

    families.push([targetDescription.name, jep]);
    if (jep) {
      if (manufacturers[
        jep
      ]) {
        manufacturers[
          jep
        ].push(targetDescription.name)
      } else {
        manufacturers[
          jep
        ] = [targetDescription.name]
      }
    } else {
      console.log(targetDescription.name);
    }
  }
  targets.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
  families.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));

  console.log(manufacturers);
  manufacturers = Object.keys(manufacturers);
  manufacturers.sort();
  return { targets, families, manufacturers };
};

async function openTarget(target) {
  const targetDescription = parse(target, {
    schema: schema(),
  });

  return targetDescription;
}

function schema() {
  const arm = new Type("!Arm", {
    construct(data) {
      return data !== null ? { Arm: data } : {};
    },
    kind: "mapping",
  });

  const riscv = new Type("!Riscv", {
    construct(data) {
      return data !== null ? { Riscv: data } : {};
    },
    kind: "mapping",
  });

  const ram = new Type("!Ram", {
    construct(data) {
      return data !== null ? { Ram: data } : {};
    },
    kind: "mapping",
  });

  const nvm = new Type("!Nvm", {
    construct(data) {
      return data !== null ? { Nvm: data } : {};
    },
    kind: "mapping",
  });

  const flash = new Type("!Flash", {
    construct(data) {
      return data !== null ? { Flash: data } : {};
    },
    kind: "mapping",
  });

  const generic = new Type("!Generic", {
    construct(data) {
      return data !== null ? { Generic: data } : {};
    },
    kind: "mapping",
  });

  const extended = new Schema({
    explicit: [arm, riscv, ram, nvm, flash, generic],
    include: [def],
  });

  return extended;
}
