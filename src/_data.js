import { Octokit } from "https://esm.sh/v133/octokit@3.1.0?dts";

const auth = Deno.env.get("GITHUB_TOKEN");
const octokit = new Octokit({
  auth,
});

const response = await octokit.request(
  "GET /repos/{owner}/{repo}/releases/latest",
  {
    owner: "probe-rs",
    repo: "probe-rs",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  }
);

export const latestRelease = response.data;
