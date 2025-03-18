# The new (new) probe.rs webpage

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
- Avoid maintenance issues of Deno & Lume.

## Development

[Install](https://deno.land/manual@v1.36.3/getting_started/installation) NodeJS
which is the JS runtime to generate all webpage docs.

Alternatively, use [Nix](https://nixos.org/download/) to fetch the
development shell tools:

```sh
nix-shell
```

Fetch dependencies. Be patient, it may take a while on the first run.

```sh
npm install
```

Then locally serve the documentation from the root of this repository. Be
patient, it may take a while on the first run.

```sh
npm run dev
```

When the documentation preview is ready and gets served, you will be greeted
with something like:

```
> probe.rs-astro@0.0.1 dev
> astro dev

 astro  v5.5.2 ready in 1355 ms

┃ Local    http://localhost:4322/probe.rs-astro
┃ Network  use --host to expose

10:04:56 watching for file changes...
```

## Building Static Site

To build the site, into the `dist/` folder:

```sh
npm run build
```

Note: it goes into a subfolder if astro.config.mjs' `BASE` is set!

You can start a local static server with [`static-web-server`](https://static-web-server.net/):

```sh
static-web-server --port 3000 --root dist
```

And visit it, _with_ your base path if set:

http://localhost:3000/probe.rs-astro/

## Targets Data Dependency

This repo currently pulls in targets data from https://github.com/julianguide/probe.rs-data using
NPM:

```sh
npm install https://github.com/julianguide/probe.rs-data
```

The dependency gets updated automatically by .github/workflows/update-probe-rs-dep.yml,
or can be updated manually with:

```sh
npm update probe.rs-data
```

## Changing URL

If changing the serving domain or path, update `site` and `base` in astro.config.mjs.

## Icons

Find free / open source icons (https://iconify.design/),
throw them in `src/icons`, and use an `<Icon />` tag:

```html
<Icon name="carbon--table-of-contents" class="text-green" />
```

## Original Template

This website is a customzied version of Astro's blog template:

```sh
npm create astro@latest -- --template blog
```