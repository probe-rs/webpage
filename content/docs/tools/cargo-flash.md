+++
title = "cargo-flash"
description = "The cargo-flash utility explained."
date = 2021-05-01T08:00:00+00:00
updated = 2021-05-01T08:00:00+00:00
draft = false
weight = 10
sort_by = "weight"
template = "docs/page.html"

[extra]
toc = true
top = false
+++

## Basics

**cargo-flash** is a cargo extension and drop in replacement for `cargo run`.

We recommend you install it with cargo after installing the [prerequisites](https://github.com/probe-rs/cargo-flash#prerequisites).
```sh
cargo install cargo-flash
```
You can use **cargo-flash** just like 'cargo run', but instead of running on the host,
**cargo-flash** will download your binary to the target and run.

Here are the basics

```sh
# Installing cargo flash is simple:
cargo install cargo-flash

# In your cargo project directory, call
cargo flash --release --chip <chip_name>

# Don't know if your target is supported
# by cargo flash and what it's name is?
cargo flash --list-chips

# You can run your examples as usual with
cargo flash --example <your_example>
```

Any config flags that are accepted by 'cargo run' are accepted by <b>cargo-flash</b> too.
If not, hit us with an [issue](https://github.com/probe-rs/cargo-flash/issues/new/choose).

Happy coding!
