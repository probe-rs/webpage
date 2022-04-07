+++
title = "VSCode"
description = "The vscode plugin & DAP server explained."
date = 2021-05-01T08:00:00+00:00
updated = 2022-03-27T08:00:00+00:00
draft = false
weight = 30
sort_by = "weight"
template = "docs/page.html"

[extra]
toc = true
top = false
+++

## Basics

The **probe-rs-debugger VS Code extension** uses the Microsoft Debug Adapter Protocol to implement an interactive debugging experience between VS Code and a probe-rs target.

The extension is currently in pre-production/Alpha stage, with limited functionality. For details of current status and functionality please read this [section](#current-working-functionality-and-known-limitations).

### Installation

* Install the **probe-rs-debugger** extension in VS Code, by downloading the *latest available* `probe-rs-debugger-x.x.x.vsix` from the [Releases](https://github.com/probe-rs/vscode/releases) page in our repo (we will publish to the Microsoft Extension marketplace when we exit the 'Alpha' phase of this project)
  * Install the downloaded extension file from the command line, for example:  `code --install-extension probe-rs-debugger-0.3.3.vsix` in the terminal
  * Alternatively, 
    * To generate the extension from source code...(if you wish to update the version distributed with this repository), [please follow these instructions](#building-and-testing-the-debug-extension-in-vs-code) 

* Install the **probe-rs-debugger** server component, using instructions from [probe-rs-debugger](https://github.com/probe-rs/probe-rs/tree/master/debugger/README.md)

### Usage and Configuration

[Visual Tour](#a-visual-guide-of-implemented-features)

To use the `probe-rs-debugger` extension for VS Code, you will need to configure a `launch.json` entry for your target project. 

We recommend that you familiarize yourself with the [VSCode debug process](https://code.visualstudio.com/docs/editor/debugging), and specifically the section that discusses [the differences](https://code.visualstudio.com/docs/editor/debugging#_launch-versus-attach-configurations) between launch and attach request types.

The configuration choices may differ based on your use case, as demonstrated in the following examples:
- Start a debug session, by [launching a new](#using-the-launch-request-type) process on your target device.
- Start a debug session, by [attaching to an existing](#using-the-attach-request-type) process on your target device.
- Start a debug session (either form above) against a [remote debug server](#using-to-an-existing-probe-rs-debugger-server) process running on a server on a specific TCP/IP address and port.
- [Using RTT](#configuring-rtt-to-transfer-data) to transfer data (e.g. logs, and println) between VSCode and your target application

Many of the entries in `launch.json` are optional, and the values for each are described in the hover tips. When values are restricted, the allowable values are available through VS Code intellisense.

A minimum configuration would look something like this (required customizations are indicated with //!MODIFY tags )

#### Start a debug session with minimum configuration

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "preLaunchTask": "${defaultBuildTask}",
            "type": "probe-rs-debug",
            "request": "launch",
            "name": "probe_rs Executable Test",
            "coreConfigs": [
                {
                    "programBinary": "Relative or fully qualified path to your programBinary", //!MODIFY
                    "chip": "STM32H745ZITx", //!MODIFY
                }
            ]
        }
    ]
}
```

The following fully configured examples can be used (with customizations to reflect your own project and chip) to help you get started.<br>

#### Using the `launch` request type

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "probe-rs-debug",
            "request": "launch",
            "name": "probe_rs Executable launch example",
            "cwd": "${workspaceFolder}",
            "connectUnderReset": true,
            "speed": 24000, //!MODIFY (or remove)
            "probe": "PID:VID:<Serial>", //!MODIFY (or remove)
            "runtimeExecutable": "probe-rs-debugger",
            "runtimeArgs": [
                "debug"
            ],
            "coreIndex": 0,
            "flashingConfig": {
                "flashingEnabled": true,
                "resetAfterFlashing": true,
                "haltAfterReset": true,
            }
            "coreConfigs": [
                {
                    "programBinary": "Relative or fully qualified path to your programBinary", //!MODIFY
                    "chip": "STM32H745ZITx", //!MODIFY
                    "svdFile": "Relative or fully qualified path to your programBinary", //!MODIFY
                }
            ],
            "consoleLogLevel": "Info", //Error, Warn, Info, Debug, Trace 
        }
    ]
}
```

#### Using the `attach` request type

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "probe-rs-debug",
            "request": "attach",
            "name": "probe_rs Executable launch example",
            "cwd": "${workspaceFolder}",
            "speed": 24000, //!MODIFY (or remove)
            "probe": "PID:VID:<Serial>", //!MODIFY (or remove)
            "coreConfigs": [
                {
                    "coreIndex": 0,
                    "programBinary": "Relative or fully qualified path to your programBinary", //!MODIFY
                    "chip": "STM32H745ZITx", //!MODIFY
                    "svdFile": "Relative or fully qualified path to your programBinary", //!MODIFY
                }
            ],
            "consoleLogLevel": "Info", //Error, Warn, Info, Debug, Trace 
        }
    ]
}
```

#### Using to an existing `probe-rs-debugger` server

To start `probe-rs-debugger` as a standalone server:
```
probe-rs-debugger debug --port 50000 # Replace the value 50000 with any available TCP port number
```

Then use the following `launch.json` to connect to it:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "preLaunchTask": "${defaultBuildTask}", //Configure a default build task for 'cargo build'
            "type": "probe-rs-debug",
            "request": "launch",
            "name": "probe_rs Server attach example",
            "server": "127.0.0.1:50001", //!MODIFY ... can be a server that is remote from the VSCode session, but local to the probe 
            "cwd": "${workspaceFolder}",
            "speed": 24000, //!MODIFY (or remove)
            "probe": "PID:VID:<Serial>", //!MODIFY (or remove)
            "coreConfigs": [
                {
                    "coreIndex": 0,
                    "programBinary": "Relative or fully qualified path to your programBinary", //!MODIFY
                    "chip": "STM32H745ZITx", //!MODIFY
                    "svdFile": "Relative or fully qualified path to your programBinary", //!MODIFY
                }
            ],
            "consoleLogLevel": "Info", //Error, Warn, Info, Debug, Trace           
        }
    ]
}
```

### Configuring RTT to transfer data 

`probe-rs-debugger` and the VS Code extension supports using RTT in your target application.

For more information on how to configure your target application to use RTT, please refer to the instructions under the [cargo-embed](../cargo-embed#RTT)
section of this guide.

In order to capture the RTT output in the VSCode extension, you will need to supply additional entries to your applications `launch.json` entry. You can use the following example and modify the channel information to match the `rtt-target` channel configurations in your application.

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "probe-rs-debug",
            "request": "launch",
            "name": "probe_rs rtt-target example",
            "coreConfigs": [
                {
                    "coreIndex": 0,
                    // ... <snip> ...
                    "rttEnabled": true,
                    "rttChannelFormats": [
                        {
                            "channelNumber": 0,
                            "dataFormat": "String", // Format RTT data as String data
                            "showTimestamps": true  // Include host-side timestamps for every line of data transferred from the target RTT output
                        },
                        {
                            "channelNumber": 1,
                            "dataFormat": "BinaryLE" // Treat data as raw binary data, and do not format in any way
                        }
                    ]
                }
            ],
        }
    ]
}
```

In addition to supporting RTT channels with <a href="https://crates.io/crates/rtt-target" target="_blank">rtt-target</a>, we also support using the <a href="https://defmt.ferrous-systems.com" target="_blank">defmt</a> (a highly efficient logging framework that targets resource-constrained devices, and supports complex formatting and RUST_LOG-like logging)<br>

When using `defmt`, we can configure the client side based on what is captured in your application, and the `launch.json` only requires a single additional entry.

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "probe-rs-debug",
            "request": "launch",
            "name": "probe_rs rtt-target example",
            // ... <snip> ...
            "rttEnabled": true,
            // "rttChannelFormats": [ //!OPTIONAL
            //     {
            //         "channelNumber": 0,
            //         "dataFormat": "Defmt",
            //     }
            // ]
        }
    ]
}
```

**NOTE:** Using RTT along with low power modes has [some limitations](https://wiki.segger.com/RTT#Low-power_modes). Frameworks such as [embassy](https://github.com/embassy-rs/embassy) and [rtic](https://github.com/rtic-rs/cortex-m-rtic) uses low power by default and this can cause RTT to not produce any output on some devices. In some cases, this can be overcome by configuring your device to enable the RCC DMA clock before entering low power.

**NOTE:** When using `defmt` RTT, please keep the following limitations in mind.

* Due to the way the `defmt` crate works, it is currently not possible to mix `defmt` and `rtt-target` channels in a single application.
* The `defmt` crate always uses channel number 0 for its output.
* The `defmt` crate introduced a new log filter that filters out log statements at **build time**. To ensure your defmt logging is not default filtered to `error` level, you can either add the environment variable in your `.cargo/config` file, or add the `options` setting of your tasks.json (see below), to match your desired logging level on the target.

Adding DEFMT_LOG to `cargo/config`
```toml
[env]
DEFMT_LOG = "info"
```

Adding DEFMT_LOG to `launch.json`
```json
// ... <snip> ...
  "options": {
    "env": {
      "DEFMT_LOG": "info" //!MODIFY: Remove or use any of the supported DEFMT_LOG options.
    }
  },
  "tasks": [
// ... <snip> ...
```


**TIP:** When using RTT, the data is streamed into a terminal window on a per channel basis. If your application uses multiple RTT channels, you may want to consider using the new [VSCode Terminal tabs](https://code.visualstudio.com/updates/v1_57#_integrated-terminal) setting.

### Current working functionality and known limitations

- [x] **Launch**: Start a debug session on the target by (optionally) flashing the target firmware.
- [x] **Attach**: 
- [x] By default, VSCode will manage (start/stop) the `probe-rs-debugger` process to facilite a debug session against a target process. It is also possible for the user to manage the `probe-rs-debugger` as a standalone process, and then use TCIP/IP port to connect to from VSCode. 
- [x] **Connect** to the target with `probe-rs` 
  - [x] Supports `connect-under-reset`
  - [x] Tested against the following architectures:
    - [x] Cortex-M7 using STM32H745
    - [x] Cortex-M4 using nRF52833_xxAA
    - [x] Cortex-M0 using Raspberry PICO
    - [ ] RISC-V using ESP32-C3 - WIP
- [x] **Flash** the chip with your own binary. 
  - [x] Supports `reset-after-flashing`, `full-chip-erase`, and `restore-unwritten-bytes`
  - [x] Supports `halt-after-reset`. This will allow you to set breakpoints in your main() function.
- [x] Set, clear, disable, enable hardware **Breakpoints**. Breakpoint locations will automatically be adjusted to code boundaries that lie safely between function prologues and epilogues.
- [x] **UPDATED: Step Over** executing code
  - [x] Supports stepping at 'statement' level with `Step Over`, `Step Into`, `Step Out`. Stepping desitnations will automatically be adjusted to code boundaries that lie safely between function prologues and epilogues.
  - [x] Stepping while in the `Disassembly View` works at 'instruction' granularity, so sometimes requires multiple steps per line of code
- [x] **Variables View**
  - [x] View values of core **Registers**, and changes during code execution
  - [x] View values of **Locals** and **Statics** variables, and update values during code execution.
    - [x] Shows datatypes and values for the following Rust datatypes.
      - [x] Base types, including &str
      - [x] Enumerations
      - [x] Structures
      - [x] Pointers
      - [x] Variants
      - [x] Arrays
      - [x] Unions
      - [x] Options & Results
      - [x] Unit types
    - [ ] TODO: Add support for additional types, such as Generics, etc.
    - [x] **NEW:** Use the `Set Variable` command in VSCode to update variable values.
    - [x] **NEW:** Use the `View Binary Data` command in VSCode to perform binary memory edits on the target device. 
- [x] **Call Stack View**
  - [x] Supports a single thread, for a single core of the chip, but will **allow selection of any frames** that are in the current thread
  - [x] **NEW** Supports the VSCode `Dissambly` view, and `SetInstructionBreakpoints`
  - [ ] TODO: Support multiple threads
  - [ ] TODO: Support chips with multiple cores
- [x] **NEW:** **Watch View** Monitor values of selected variables.
- [x] **RTT** - Configure RTT Channels and capture their output in the `VSCode Integrated Terminal`
  - [x] RTT Channels that support logging data to VSCode Terminal windows
- [x] **NEW:** Use the REPL command line in the Debug Console evaluate variables
- [x] **NEW:** Navigate and monitor SVD Peripheral registers 

### Building and Testing the debug extension in VS Code

Please refer to the [repository README.md file](https://github.com/probe-rs/vscode) for the latest instructions on how to build and deploy the extension.

## A visual guide of implemented features

### The Basics, and viewing RTT data

<center><img src="/img/vscode/intro_and_rtt.gif" style="margin-top: 1em; margin-bottom: 1em; max-width:100%; max-height:100%; width: auto; height: auto;"  /></center>

### Use the `Set Variable` command to update variable values during debugging

<center><img src="/img/vscode/variable_set_value.gif" style="margin-top: 1em; margin-bottom: 1em; max-width:100%; max-height:100%; width: auto; height: auto;" /></center>

### Use the `View Binary Data` to view and perform binary edits of target memroy

<center><img src="/img/vscode/variable_edit_and_watch.gif" style="margin-top: 1em; margin-bottom: 1em; max-width:100%; max-height:100%; width: auto; height: auto;" /></center>

### Use the `Disassembly` to see the assembly code executed on the target, and set instruction breakpoints in this view

<center><img src="/img/vscode/disassemble_and_instruction_breakpoint.gif" style="margin-top: 1em; margin-bottom: 1em; max-width:100%; max-height:100%; width: auto; height: auto;" /></center>

### Use CMSIS-SVD definitions to navigate and monitor device peripheral registers

<center><img src="/img/vscode/SVD Peripheral Registers.gif" style="margin-top: 1em; margin-bottom: 1em; max-width:100%; max-height:100%; width: auto; height: auto;" /></center>
