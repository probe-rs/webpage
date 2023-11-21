import { Octokit } from "https://esm.sh/v133/octokit@3.1.0?dts";
import { parse } from "https://deno.land/std@0.194.0/yaml/mod.ts";
import { Schema } from "https://deno.land/std@0.194.0/yaml/schema.ts";
import { def } from "https://deno.land/std@0.194.0/yaml/schema/default.ts";
import { Type } from "https://deno.land/std@0.194.0/yaml/type.ts";
import { existsSync } from "https://deno.land/std@0.206.0/fs/exists.ts";
import { getJep106Manufacturer } from "../_includes/jep106.js";

export const layout = "layouts/plugins.jsx";
export const mainMenu = "plugins";
const REPO_PATH = "./probe-rs-repo";

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

/// Loads the newest probe-rs repo state from Github
const loadRepo = async (url) => {
  const repoFound = existsSync(REPO_PATH);
  let cmd;
  if (repoFound) {
    console.log("Repository found - pulling changes");
    cmd = new Deno.Command("git", {
      args: `-C ${REPO_PATH} pull`.split(" "),
    });
  } else {
    console.log("No repository found - cloning fresh");
    cmd = new Deno.Command("git", {
      args: `clone ${url} ${REPO_PATH}`.split(" "),
    });
  }
  let { stdout, stderr } = await cmd.output();
  console.log(new TextDecoder().decode(stdout));
  console.log(new TextDecoder().decode(stderr));
};

/// Checks out a specific state of the repository.
const checkoutRepoState = async (ref) => {
  console.log(`Checking out ${ref} in ${REPO_PATH}`);
  let cmd = new Deno.Command("git", {
    args: `-C ${REPO_PATH} checkout ${ref}`.split(" "),
  });
  let { stdout, stderr } = await cmd.output();
  console.log(new TextDecoder().decode(stdout));
  console.log(new TextDecoder().decode(stderr));
};

export const loadTargets = async (ref) => {
  await loadRepo("https://github.com/probe-rs/probe-rs.git");
  await checkoutRepoState(ref);

  const targets = [];
  const families = [];
  let manufacturers = {};
  const cache = {};
  const path = `${REPO_PATH}/probe-rs/targets`;
  for await (const dirEntry of Deno.readDir(path)) {
    if (dirEntry.name.endsWith(".yaml")) {
      const decoder = new TextDecoder("utf-8");
      const data = await Deno.readFile(`${path}/${dirEntry.name}`);
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
        variant.family = targetDescription.name;
        variant.manufacturer = jep;

        if (!cache[variant.name]) {
          cache[variant.name] = JSON.stringify(variant);
          targets.push(variant);
        }
      }

      families.push([targetDescription.name, jep]);
      if (jep) {
        if (manufacturers[jep]) {
          manufacturers[jep].push(targetDescription.name);
        } else {
          manufacturers[jep] = [targetDescription.name];
        }
      }
    }
  }
  targets.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
  families.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));

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
