+++
title = "Installation"
description = "How to install probe-rs."
date = 2021-05-01T08:20:00+00:00
updated = 2021-05-01T08:20:00+00:00
draft = false
weight = 20
sort_by = "weight"
template = "docs/page.html"

[extra]
toc = true
top = false
+++


# Prerequisites

To build probe-rs, you will need a working Rust toolchain. The easiest way is to follow the [rustup installation instructions](https://rustup.rs).

Additionally, probe-rs depends on [libusb](https://libusb.info/) and optionally on [libftdi](https://www.intra2net.com/en/developer/libftdi/) libraries, which need to be installed to build probe-rs. Instructions for your OS are provided below.

## Debian-based Linux

On Debian and derived distros (e.g. Ubuntu), the following packages need to be installed:

```bash
sudo apt install -y pkg-config libusb-1.0-0-dev libftdi1-dev
```

If the libusb v0.1 dev package (`libusb-dev`) is installed when dependant crates are built, you may get link failures at the end of the build.

On Ubuntu you can fix this by removing it with

```bash
sudo apt purge libusb-dev
```

## RPM-based Linux (Fedora, CentOS)

```
dnf install systemd-devel libusbx-devel
```

## Windows

On Windows you can use [vcpkg](https://github.com/microsoft/vcpkg#quick-start-windows) to install the prerequisites:

```
# dynamic linking 64-bit
vcpkg install libftdi1:x64-windows libusb:x64-windows
set VCPKGRS_DYNAMIC=1

# static linking 64-bit
vcpkg install libftdi1:x64-windows-static-md libusb:x64-windows-static-md
```

## macOS

On macOS, [homebrew](https://brew.sh/) is the suggested method to install libftdi:

```
brew install libftdi
```

# Installation

Install with `cargo install`. This will install the `probe-rs`, `cargo-flash` and `cargo-embed` binaries and put them in `$PATH`.

```
cargo install probe-rs --features cli
```

To build with FTDI probe support, enable the `ftdi` feature;

```
cargo install probe-rs --features cli,ftdi
```

# What's next?

Follow the instructions in [Probe Setup](@/docs/getting-started/probe-setup.md).
