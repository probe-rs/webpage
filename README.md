# The new probe.rs webpage

## Goals

- Create a more appealing frontpage that tells the visitor a bit better what we
  have to offer.
- Provide simple installation instructions. Part of this initiative is building
  proper release artifacts in the pipeline (see
  [#1721](https://github.com/probe-rs/probe-rs/pull/1721)).
- Make the entry into `probe-rs` usage even easier.
  - Explain how one uses `probe-rs run` properly.
  - How to troubleshoot
    - How to enable logs
    - What are common errors
      - Can we also add hints in our error messages
  - Clean up docs a lot and explain in more detail.
- Add a searchable list of provided targets with information about each target.

## Development

[Install](https://deno.land/manual@v1.36.3/getting_started/installation) deno
which is the JS runtime to generate all webpage docs.

You need a GitHub API token with repository read access to circumvent API rate
limiting. Store it in the `GITHUB_TOKEN` environment variable for the deno
process to pick up. Run `deno task serve` in this repository root.
