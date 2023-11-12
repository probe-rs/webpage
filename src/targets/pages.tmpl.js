export const layout = "layouts/target.jsx";

export default async function* ({ loadTargets, latestRelease }) {
  const latestReleasedVersion = latestRelease.tag_name;
  const { targets: targetsLatest } = await loadTargets(latestReleasedVersion);
  const { targets: targetsMaster } = await loadTargets("master");
  for (const target of targetsLatest) {
    if (target.name.includes("nRF52")) {
      yield {
        url: `/targets/${latestReleasedVersion}/${target.name}.html`,
        title: target.name,
        target,
        body: "-",
      };
    }
  }
}
