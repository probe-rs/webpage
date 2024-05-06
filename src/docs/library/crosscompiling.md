---
title: "Crosscompiling"
description: "Cross-compiling probe-rs"
order: 100
---

Even though **probe-rs** can run on most systems, there can be cases where using `cargo install` is not possible due to system permissions or resource limitations.

In such cases you can Crosscompile **probe-rs** for use in **cargo-flash** or **cargo-embed** on a different architecture, and move the resulting static binary to the target system.

We will use a [**Raspberry pi 400**](https://www.raspberrypi.org/products/raspberry-pi-400/) as the target system as an example, where `cargo install probe-rs` on a default **Raspberry PI OS** installation is not possible to pass the `rustc` final Linking step for `probe-rs` due to system memory limitations.

After defining the target system architecture, in this example being `armv7-unknown-linux-gnueabihf`, here are two different ways to Crosscompile, each with their pros and cons.

## Using Cross

[Cross](https://github.com/rust-embedded/cross) self defines as:

> “Zero setup” cross compilation and “cross testing” of Rust crates

Its main advantage is to **not be susceptible** on the usual cross compilation issues that arise **from using the host machine's shared object libraries**, by using a Docker image to build the static binary.

The downside of this approach is that **you will have to rely on the Cross Project** and **supply the build environment Dockerfile**, making sure that it resembles the system you are building for with **a cross C toolchain installed** as much as possible.

Building the tools such as `cargo-flash` for the Raspberry Pi 400, on an `x86_64` Linux System, happens as follows:

```sh
# Cloning probe-rs on the system we will build the binary on.
git clone https://github.com/probe-rs/probe-rs

# Installing cross
cargo install cross

# `cd` into the probe-rs repository
# And create a `crossimage` folder
cd probe-rs && mkdir crossimage

# Create a Dockerfile resembling the target system,
# and put it inside the `crossimage` folder.
```

We can take an `armv7-unknown-linux-gnueabihf` base system from the `rust-embedded/cross` Docker Hub container registry.

After that, follow the instructions from the `probe-rs` [prerequisites](/docs/getting-started/installation#prerequisites) to prepare the image for the building steps.

You can download the Dockerfile for this example from [here](/files/cross-dockerfile.txt).

```sh
# Create and edit a Cross.toml file in the root of the cloned repo.
vim Cross.toml
```

Add the following to the `Cross.toml`. Which will define to `cross` which container should be used for the target architecture:

    ```toml
    [target.armv7-unknown-linux-gnueabihf]
    image = "crossimage"
    ```

```sh
# Build and tag the container image, specifying the name as defined in the `Cross.toml`.
docker build -t crossimage crossimage/

# Run cross to compile, cross arguments are the same as the `cargo` ones
cross build --release --target=armv7-unknown-linux-gnueabihf

# Done
```

You now have a statically built `cargo-flash` binary inside the `target/<architecture>/release` folder on the root directory of the cloned repo, which you can now move to the **Raspberry Pi 400** `cargo bin path` folder (usually `~/.cargo/bin`).

## Using LLVM

As using `LLVM` for crosscompiling can go out of the scope of just generating a `cargo-flash` binary, please follow the instructions on how to crosscompile in the **LLVM** [guide](https://www.llvm.org/docs/HowToCrossCompileLLVM.html).
