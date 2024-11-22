---
title: "probe-rs"
description: "The probe-rs utility explained."
order: 10
---

The `probe-rs` CLI utility features many subcommands which are explained in the sections in this document.

The most commonly used one is the `probe-rs run` subcommand.

It should be the preferred way to do embedded development where applicable.

It should be noted that this works with any embedded binary. Be it ADA, C, C++, Rust or any other language that can be compiled into a native ARM binary.

## run

The `run` subcommand is a cargo target runner. It makes it possible to flash, start and print logs from your target with a simple `cargo run`.

To use the runner in your project, add it to your `.cargo/config.toml`

<probe-rs-code>

```rust { title=".cargo/config.toml" }
[target.<architecture-triple>]
runner = 'probe-rs run --chip <chip-name>'
```

Now you can execute `cargo run` in your project as you would for any native binaries and you will receive **RTT** and **defmt** logs in that very same console as if you wrote to standard out.

To use [RTT](https://docs.rs/rtt-target/latest/rtt_target/) or [defmt](https://docs.rs/defmt/0.3.5/defmt/), follow the instructions in the respective crates to integrate them into your firmware.

## attach

`probe-rs attach` works exactly like `probe-rs run` except that it does not issue a reset and does not flash the target on connecting to preserve the currently running state.

This is great for inspecting a target - where you might not even have knowledge of the firmware - without altering its state.

## Additional commands

To learn more about additional commands, use the `probe-rs help` or `probe-rs <command> --help` commands.

</probe-rs-code>
