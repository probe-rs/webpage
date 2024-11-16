// import { Octokit } from "https://esm.sh/v133/octokit@3.1.0?dts";
// import { parse } from "https://deno.land/std@0.194.0/yaml/mod.ts";
// import { Schema } from "https://deno.land/std@0.194.0/yaml/schema.ts";
// import { def } from "https://deno.land/std@0.194.0/yaml/schema/default.ts";
// import { Type } from "https://deno.land/std@0.194.0/yaml/type.ts";
// import { existsSync } from "https://deno.land/std@0.206.0/fs/exists.ts";

import { Octokit } from "octokit";

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { getJep106Manufacturer } from "./jep106";
import { parse, Schema, Type, DEFAULT_SCHEMA } from "js-yaml";
import { exec as execInner } from 'node:child_process';
const util = require('node:util');
const exec = util.promisify(execInner);

export const layout = "layouts/plugins.jsx";
export const mainMenu = "plugins";
const REPO_PATH = "./probe-rs-repo";

const auth = process.env.GITHUB_TOKEN;
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

/// Loads the newest probe-rs repo state from Github
const loadRepo = async (url) => {
  const repoFound = existsSync(REPO_PATH);
  let cmd;
  if (repoFound) {
    console.log("Repository found - pulling changes");
    exec(`git -C ${REPO_PATH} pull`);
  } else {
    console.log("No repository found - cloning fresh");
    cmd = exec(`git clone ${url} ${REPO_PATH}`);
  }
  let { stdout, stderr } = await cmd;
  console.log(new TextDecoder().decode(stdout));
  console.log(new TextDecoder().decode(stderr));
};

/// Checks out a specific state of the repository.
const checkoutRepoState = async (ref) => {
  console.log(`Checking out ${ref} in ${REPO_PATH}`);
  let cmd = exec(`git -C ${REPO_PATH} checkout ${ref}`);
  let { stdout, stderr } = await cmd;
  console.log(new TextDecoder().decode(stdout));
  console.log(new TextDecoder().decode(stderr));
};

export async function loadTargets(gitRef: string): Promise<{ targets: Target[] }> {
  await loadRepo("https://github.com/probe-rs/probe-rs.git");
  await checkoutRepoState(gitRef);

  const targets = [];
  const cache = {};
  const path = `${REPO_PATH}/probe-rs/targets`;
  for await (const dirEntry of readdirSync(path)) {
    if (dirEntry.endsWith(".yaml")) {
      const decoder = new TextDecoder("utf-8");
      const data = await readFileSync(`${path}/${dirEntry}`);
      const yaml = decoder.decode(data);

      const targetDescription = await openTarget(yaml);

      const variants = targetDescription.variants;
      const jep = targetDescription.manufacturer
        ? getJep106Manufacturer(
          targetDescription.manufacturer.cc,
          targetDescription.manufacturer.id
        )
        : undefined;

      for (const variant of variants) {
        let item = {
          name: variant.name,
          manufacturer: jep,
          family: targetDescription.name,
          cores: variant.cores,
          memoryMap: variant.memory_map
        };

        if (!cache[variant.name]) {
          cache[variant.name] = JSON.stringify(variant);
          targets.push(item);
        }
      }
    }
  }
  return { targets };
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

  const xtensa = new Type("!Xtensa", {
    construct(data) {
      return data !== null ? { Xtensa: data } : {};
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

  const espressif = new Type("!Espressif", {
    construct(data) {
      return data !== null ? { Espressif: data } : {};
    },
    kind: "mapping",
  });

  const atsam_dsu = new Type("!AtsamDsu", {
    construct(data) {
      return data !== null ? { AtsamDsu: data } : {};
    },
    kind: "mapping",
  });

  const nordic_configid = new Type("!NordicConfigId", {
    construct(data) {
      return data !== null ? { NordicConfigId: data } : {};
    },
    kind: "mapping",
  });

  const nordic_ficr_info = new Type("!NordicFicrInfo", {
    construct(data) {
      return data !== null ? { NordicFicrInfo: data } : {};
    },
    kind: "mapping",
  });

  const infineon_scu = new Type("!InfineonScu", {
    construct(data) {
      return data !== null ? { InfineonScu: data } : {};
    },
    kind: "mapping",
  });

  const extended = new Schema({
    explicit: [arm, riscv, xtensa, ram, nvm, flash, generic, espressif, atsam_dsu, nordic_configid, nordic_ficr_info, infineon_scu],
    include: [(new Schema()).inclue],
  });

  return extended;
}

export interface Target {
  name: string,
  manufacturer: string,
  family: string,
  cores: Core[],
  memoryMap: any[]
}

export interface Core {

}

export interface Memory {

}