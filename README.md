# probe.rs

## Development

The entire webpage is built with [zola](https://www.getzola.org/) which is based on statically compiled Markdown and [tera](https://github.com/Keats/tera) templates.
You can run the file watcher & compiler with `zola serve` during development. The webpage will automatically be reloaded everytime you change any involved file.

## Deployment

To deploy the webpage we use Docker.
The container can be built with `scripts/build_docker.sh` and run locally with `scripts/run_docker.sh`.
To deploy the container for the `probe.rs` domain, please contact @Yatekii or @tiwalun.