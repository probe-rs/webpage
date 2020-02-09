# ------------------------------------------------------------------------------
# Cargo Build Stage
# ------------------------------------------------------------------------------

FROM ekidd/rust-musl-builder:1.41.0 as cargo-build

RUN sudo apt-get update && \
    sudo apt-get install -y \
        llvm-dev \
        libclang-dev

# Copy the source
COPY src/ src/
COPY Cargo.toml Cargo.toml

# Build the application.
RUN cargo build --release

# ------------------------------------------------------------------------------
# Final Stage
# ------------------------------------------------------------------------------

FROM alpine:latest

WORKDIR /app

RUN mkdir housekeeping
RUN mkdir data

COPY --from=cargo-build /home/rust/src/target/x86_64-unknown-linux-musl/release/webpage .

COPY scripts/startup.sh housekeeping/startup.sh
COPY templates/ data/templates/
COPY static/ data/static/

RUN chmod 777 housekeeping/startup.sh

EXPOSE 3030

CMD /app/housekeeping/startup.sh
