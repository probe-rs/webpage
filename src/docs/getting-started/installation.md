---
title: "Installation"
description: "How to install probe-rs."
order: 20
---

## Using install scripts

### Linux, macOS

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/probe-rs/probe-rs/releases/latest/download/probe-rs-tools-installer.sh | sh
```

### Windows

```ps
irm https://github.com/probe-rs/probe-rs/releases/latest/download/probe-rs-tools-installer.ps1 | iex
```

## From package managers

### [homebrew](https://brew.sh/)

```bash
brew tap probe-rs/probe-rs
brew install probe-rs
```

### [cargo binstall](https://crates.io/crates/cargo-binstall)

```bash
cargo binstall probe-rs
```

## Installing from source (`cargo install`)

### Prerequisites

To build probe-rs from source, you will need a working Rust toolchain. The easiest way is to follow the [rustup installation instructions](https://rustup.rs).

#### Debian-based Linux

On Debian and derived distros (e.g. Ubuntu), the following packages need to be installed:

```bash
sudo apt install -y pkg-config libudev-dev
```

#### RPM-based Linux (Fedora, CentOS)

```bash
dnf install libusbx-devel libudev-devel
```

#### macOS, Windows

No additional setup is required.

### Installation

Install with `cargo install`. This will download the latest **development** sources, compile them, install the `probe-rs`, `cargo-flash` and `cargo-embed` binaries and put them in `$PATH`.

```bash
cargo install probe-rs-tools --git https://github.com/probe-rs/probe-rs --locked
```

See the [Cargo book](https://doc.rust-lang.org/cargo/commands/cargo-install.html) for details.
