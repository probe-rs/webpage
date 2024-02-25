---
title: "Installation"
description: "How to install probe-rs."
order: 20
---

# Installing a precompiled binary (`cargo binstall`)

## Prerequisites

First, set up `cargo-binstall`. You can find setup instructions [`here`](https://crates.io/crates/cargo-binstall).

## Installation

`cargo binstall probe-rs`

# Installing from source (`cargo install`)

## Prerequisites

To build probe-rs from source, you will need a working Rust toolchain. The easiest way is to follow the [rustup installation instructions](https://rustup.rs).

### Debian-based Linux

On Debian and derived distros (e.g. Ubuntu), the following packages need to be installed:

```bash
sudo apt install -y pkg-config libudev-dev
```

### RPM-based Linux (Fedora, CentOS)

```bash
dnf install libusbx-devel libudev-devel
```

## Installation

Install with `cargo install`. This will install the `probe-rs`, `cargo-flash` and `cargo-embed` binaries and put them in `$PATH`.

```bash
cargo install probe-rs --features cli
```
