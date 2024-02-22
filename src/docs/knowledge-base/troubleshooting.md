---
title: "Troubleshooting"
description: "Troubleshooting problems that may arrise during use"
order: 100
---

## No DEFMT output

**Check `DEFMT_LOG` filter:**

Filter levels in order from lowest to highest severity are: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`

More info on DEFMT filtering levels [here](https://defmt.ferrous-systems.com/filtering.html)

This can be set multiple ways:
- If using `cargo run` on a probe-rs based runner:
  - `ENV VAR` at build time: `DEFMT_LOG=trace cargo build ...`
  - In `.cargo/config.toml` **Note:** there is a bug in cargo that does not automatically recognize changes when rebuilding.
    ```toml
    [env]
    DEFMT_LOG = "trace"
    ```
- If using [VSCode plugin](https://probe.rs/docs/tools/vscode/), 
  - It should be set in `.vscode/launch.json` under configurations/coreConfigs/options. 
  - Also be sure `rttEnabled` is `true` and `consoleLogLevel` is set to appropriate filter level:
    ```json
    "configurations": [{
    // SNIP...
    "coreConfigs": [{
        // SNIP ...,
        "rttEnabled": true,
        "options": {
            "env": {
                "DEFMT_LOG": "Trace" // Trace, Debug, Info, Warn, Error
            }
        },
    }],
    "consoleLogLevel": "Console", //Console, Info, Debug
    ```


**Check `memory.x` file is correct:**

- Make sure origin offsets are correct according to datasheet/ application
- Make sure lengths are correct according to datasheet/application
- Note: Lower values for RAM are OK, but values that exceed the chip's spec will cause a crash and not allow RTT to connect.


**Check correct Chip selected:**

- `.cargo/config.toml` under runner. Example:
    ``` toml
    runner = "probe-rs-cli run --chip STM32L451RCTx"
    ```
- If using VSCode plugin in `launch.json` configurations/chip
    ```json
    "configurations": [{
        // SNIP...
        "chip": "STM32L451RCTx",
        // SNIP...
    ```

**Check `defmt_rtt` is being "used" in code:**

If not, it will not be linked during compile. Example:
```rust
use defmt_rtt as _;
```

**On STM32 series chips, check the state of the `BOOT0` pin:**

- If BOOT0 is HIGH or floating, the core will run from internal bootloader instead of flashed firmware.
- BOOT0 should be pulled LOW for SWD programming, however even if it is HIGH or floating, programming may appear to succeed but firmware will not properly run.

**Make sure tooling is up to date:**

As with any set of tools being actively developed and improved, sometimes if one part is updated and there is a breaking change, the other tools must be updated as well in order to function.
