---
title: "cargo-flash"
description: "The cargo-flash utility explained."
order: 30
---

**cargo-flash** is a cargo extension and drop in replacement for `cargo run`.

## Installation

**cargo-flash** is installed as part of the **probe-rs** group of tools, see the
[Installation](/docs/getting-started/installation) page.

## Usage

You can use **cargo-flash** just like 'cargo run', but instead of running on the host,
**cargo-flash** will download your binary to the target and run.

Here are the basics

**cargo-embed** is installed as part of the **probe-rs** group of tools, see the
[Installation](/docs/getting-started/installation) page.

```sh
# In your cargo project directory, call
cargo flash --release --chip <chip_name>

# Don't know if your target is supported
# by cargo flash and what it's name is?
probe-rs chip list

# You can run your examples as usual with
cargo flash --example <your_example>

# Specifying manually what options should be used
cargo flash --release --chip nRF52840_xxAA --target thumbv6m-none-eabi --example gpio_hal_blinky

# Using a custom chip definition from a non-builtin file
cargo flash --release --chip-description-path nRF52840_xxAA.yaml --target thumbv6m-none-eabi --example gpio_hal_blinky
```

Any config flags that are accepted by 'cargo run' are accepted by **cargo-flash** too.
If not, hit us with an [issue](https://github.com/probe-rs/probe-rs/issues/new?assignees=&labels=bug,component:cargo-flash&projects=&template=bug_report.md&title=).

Happy coding!
