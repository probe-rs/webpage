# probe.rs

## Development

The entire webpage is built with [warp](https://github.com/seanmonstar/warp) and [tera](https://github.com/Keats/tera).
You can run the webserver with `cargo run` during development. Templates will automatically be reloaded everytime you reload the page to ease development. This only happens in debug builds.

## Deployment

To deploy the webpage we use Docker.
The container can be built with `scripts/build_docker.sh` and run locally with `scripts/run_docker.sh`.
To deploy the container for the `probe.rs` domain, please contact @Yatekii or @tiwalun.