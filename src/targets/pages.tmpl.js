export const layout = "layouts/target.jsx";

export default async function* ({ loadTargets, latestRelease }) {
  // TODO:
  return;
  const { targets } = await loadTargets(latestRelease);
  for (const target of targets) {
    return {
      url: `/targets/${target.name}.html`,
      title: target.name,
      target,
      body: "-",
    };
  }
}
