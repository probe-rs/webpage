export const layout = "layouts/target.jsx";

export default async function* ({ loadTargets, latestRelease }) {
  const latestReleasedVersion = latestRelease.tag_name;
  const { targets: targetsLatest } = await loadTargets(latestReleasedVersion);
  const { targets: targetsMaster } = await loadTargets("master");
  for (const target of targetsLatest) {
    if (filter(target) || Deno.env.get("GITHUB_ACTIONS")) {
      yield {
        url: `/targets/${latestReleasedVersion}/${target.name}.html`,
        title: target.name,
        target,
        body: "-",
      };
    }
  }
  for (const target of targetsMaster) {
    if (filter(target) || Deno.env.get("GITHUB_ACTIONS")) {
      yield {
        url: `/targets/master/${target.name}.html`,
        title: target.name,
        target,
        body: "-",
      };
    }
  }
}

function filter(target) {
  return target.name.includes("nRF52");
}
