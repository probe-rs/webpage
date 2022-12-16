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

The **probe-rs-debugger VS Code extension** uses the Microsoft Debug Adapter Protocol to implement an interactive debugging experience between VS Code and a probe-rs target.

The extension is currently in pre-production/Alpha stage, with limited functionality. For details of current status and functionality please read this [section](#current-working-functionality-and-known-limitations).

### Installation

- Install the **probe-rs-debugger** extension in VS Code, by downloading the _latest available_ `probe-rs-debugger-x.x.x.vsix` from the [Releases](https://github.com/probe-rs/vscode/releases) page in our repo (we will publish to the Microsoft Extension marketplace when we exit the 'Alpha' phase of this project)

  - Install the downloaded extension file from the command line, for example: `code --install-extension probe-rs-debugger-0.3.3.vsix` in the terminal
  - Alternatively,
    - To generate the extension from source code...(if you wish to update the version distributed with this repository), [please follow these instructions](#building-and-testing-the-debug-extension-in-vs-code)

- Install the **probe-rs-debugger** server component, from the comand line with: `cargo install --git https://github.com/probe-rs/probe-rs --force --branch master probe-rs-debugger`

### Usage and Configuration

[Visual Tour](#a-visual-guide-of-implemented-features)

To use the `probe-rs-debugger` extension for VS Code, you will need to configure a `launch.json` entry for your target project.

We recommend that you familiarize yourself with the [VSCode debug process](https://code.visualstudio.com/docs/editor/debugging), and specifically the section that discusses [the differences](https://code.visualstudio.com/docs/editor/debugging#_launch-versus-attach-configurations) between launch and attach request types.

The configuration choices may differ based on your use case, as demonstrated in the following examples:

- Start a debug session, by [launching a new](#using-the-launch-request-type) process on your target device.
- Start a debug session, by [attaching to an existing](#using-the-attach-request-type) process on your target device.
- Start a debug session (either form above) against a [remote debug server](#using-to-an-existing-probe-rs-debugger-server) process running on a server on a specific TCP/IP address and port.
- [Using RTT](#configuring-rtt-to-transfer-data) to transfer data (e.g. logs, and println) between VSCode and your target application

Many of the entries in `launch.json` are optional, and the values for each are described in the hover tips - alternatively, you can find the full list of available options in the [Appendix](#appendix-all-supported-configuration-options). When values are restricted, the allowable values are available through VS Code intellisense.

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
      "chip": "STM32H745ZITx", //!MODIFY
      "coreConfigs": [
        {
          "programBinary": "Relative or fully qualified path to your programBinary" //!MODIFY
        }
      ]
    }
  ]
}
```

The following fully configured examples can be used (with customizations to reflect your own project and chip) to help you get started.

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
      "speed": 24000, //!MODIFY (or remove)
      "probe": "PID:VID:<Serial>", //!MODIFY (or remove)
      "runtimeExecutable": "probe-rs-debugger",
      "runtimeArgs": ["debug"],
      "chip": "STM32H745ZITx", //!MODIFY
      "flashingConfig": {
        "flashingEnabled": true,
        "resetAfterFlashing": true,
        "haltAfterReset": false
      },
      "coreConfigs": [
        {
          "coreIndex": 0,
          "programBinary": "Relative or fully qualified path to your programBinary", //!MODIFY
          "svdFile": "Relative or fully qualified path to your programBinary" //!MODIFY
        }
      ],
      "env": {
        //!MODIFY (or remove)
        "RUST_LOG": "info" // If you set this variable, check the VSCode console log window for the location of the log file.
      },
      "consoleLogLevel": "Console" //Info, Debug
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
      "chip": "STM32H745ZITx", //!MODIFY
      "probe": "PID:VID:<Serial>", //!MODIFY (or remove)
      "coreConfigs": [
        {
          "coreIndex": 0,
          "programBinary": "Relative or fully qualified path to your programBinary", //!MODIFY
          "svdFile": "Relative or fully qualified path to your programBinary" //!MODIFY
        }
      ],
      "env": {
        //!MODIFY (or remove)
        "RUST_LOG": "info" // If you set this variable, check the VSCode console log window for the location of the log file.
      },
      "consoleLogLevel": "Console" //Info, Debug
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
      "chip": "STM32H745ZITx", //!MODIFY
      "probe": "PID:VID:<Serial>", //!MODIFY (or remove)
      "coreConfigs": [
        {
          "coreIndex": 0,
          "programBinary": "Relative or fully qualified path to your programBinary", //!MODIFY
          "svdFile": "Relative or fully qualified path to your programBinary" //!MODIFY
        }
      ],
      "env": {}, //!This won't take effect. Please set environment variables before launching `probe-rs-debugger`.
      "consoleLogLevel": "Console" //Info, Debug
    }
  ]
}
```

### Configuring RTT to transfer data

`probe-rs-debugger` and the VS Code extension supports using RTT in your target application.

For more information on how to configure your target application to use RTT, please refer to the instructions under the [cargo-embed](../cargo-embed#rtt)
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
              "showTimestamps": true // Include host-side timestamps for every line of data transferred from the target RTT output
            },
            {
              "channelNumber": 1,
              "dataFormat": "BinaryLE" // Treat data as raw binary data, and do not format in any way
            }
          ]
        }
      ]
    }
  ]
}
```

In addition to supporting RTT channels with [rtt-target](https://crates.io/crates/rtt-target), we also support using the [defmt](https://defmt.ferrous-systems.com) (a highly efficient logging framework that targets resource-constrained devices, and supports complex formatting and RUST_LOG-like logging.)

When using `defmt`, we can configure the client side based on what is captured in your application, and the `launch.json` only requires minimal additional configuration.

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
      "env": {
        "DEFMT_LOG": "info" //!MODIFY: Remove or use any of the supported DEFMT_LOG options.
      }
    }
  ]
}
```

**NOTE:** Using RTT along with low power modes has [some limitations](https://wiki.segger.com/RTT#Low-power_modes). Frameworks such as [embassy](https://github.com/embassy-rs/embassy) and [rtic](https://github.com/rtic-rs/cortex-m-rtic) uses low power by default and this can cause RTT to not produce any output on some devices. In some cases, this can be overcome by configuring your device to enable the RCC DMA clock before entering low power.

**NOTE:** When using `defmt` RTT, please keep the following limitations in mind.

- Due to the way the `defmt` crate works, it is currently not possible to mix `defmt` and `rtt-target` channels in a single application.
- The `defmt` crate always uses channel number 0 for its output.
- The `defmt` crate introduced a new log filter that filters out log statements at **build time**. To ensure your defmt logging is not default filtered to `error` level, you can either add the environment variable in your `.cargo/config` file, or add the `options` setting of your tasks.json (see below), to match your desired logging level on the target.

Adding DEFMT_LOG to `cargo/config`

```toml
[env]
DEFMT_LOG = "info"
```

Adding DEFMT_LOG to `tasks.json`

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
  - [x] Supports `connect-under-reset` for select targets.
  - [x] Tested against the following architectures:
    - [x] Cortex-M7 using STM32H745
    - [x] Cortex-M4 using nRF52833_xxAA
    - [x] Cortex-M0 using Raspberry PICO
    - [x] RISC-V using ESP32-C3
- [x] **Flash** the chip with your own binary.
  - [x] Supports `reset-after-flashing`, `full-chip-erase`, and `restore-unwritten-bytes`
  - [x] Supports `halt-after-reset`. This will allow you to set breakpoints in your main() function.
- [x] Set, clear, disable, enable hardware **Breakpoints**.
  - [x] In VSCode `Source view`, breakpoint locations will automatically be adjusted to code boundaries that lie safely between function prologues and epilogues.
  - [x] In VSCode `Disassembly view`, breakpoints are set at, and stepping works at, 'instruction level'
- [x] **UPDATED: Stepping** through executing code during debug:
  - [x] Supports stepping at 'statement' level with `Step Over`, `Step Into`, `Step Out`. Stepping desitnations will automatically be adjusted to code boundaries that lie safely between function prologues and epilogues.
  - [x] While VSCode 'Disassembly view` is open, all stepping automatically happens at 'instruction' granularity, and will allow the user to step to any target location, including instructions in a function prologue or epilogue.
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
      - [x] Formal parameters to functions.
    - [ ] TODO: Add support for additional types, such as Generics, etc.
    - [x] Use the `Set Variable` command in VSCode to update variable values.
    - [x] Use the `View Binary Data` command in VSCode to perform binary memory edits on the target device.
- [x] **Call Stack View**
  - [x] Supports a single thread, for a single core of the chip, but will **allow selection of any frames** that are in the current thread
  - [x] Supports the VSCode `Dissambly` view, and `SetInstructionBreakpoints`
  - [ ] TODO: Support multiple threads
  - [ ] TODO: Support chips with multiple cores
- [x] **Watch View** Monitor values of selected variables.
- [x] **RTT** - Configure RTT Channels and capture their output in the `VSCode Integrated Terminal`
  - [x] RTT Channels that support logging data to VSCode Terminal windows
- [x] Use the REPL command line in the Debug Console evaluate variables
- [x] Navigate and monitor SVD Peripheral registers

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

## Appendix: All supported configuration options.

This options available in `launch.json` are based on the configuration options of the [probe-rs library](https://docs.rs/probe-rs/latest/probe_rs/config/index.html), with names that are converted to camelCase, in order to be compatible with VSCode requirements. There are slight variations in supported options for `launch` or `attach` configurations, and these can be seen below. Please refer to the section "Launching and Attaching" in [the official MS DAP documentation](https://microsoft.github.io/debug-adapter-protocol/overview) for more details.

### Launch: Supported configuration options.

```json
"launch": {
  "required": [
    "chip",
    "coreConfigs"
  ],
  "properties": {
    "server": {
      "type": "string",
      "description": "Optionally connect to an existing `probe-rs-debugger` session on IP and Port, e.g. '127.0.0.1:50000'",
      "default": "127.0.0.1:50000"
    },
    "consoleLogLevel": {
      "type": "string",
      "description": "The level of log info printed to the console. This does NOT affect the RUST_LOG defined in the `env` property.",
      "enum": [
        "Console",
        "Info",
        "Debug"
      ],
      "enumDescriptions": [
        "The console will only contain error messages and process status messages.",
        "The console log will also contain high level information about interactions between the extension and the debug adapter.",
        "The console log will also contain detailed information about interactions between the extension and the debug adapter."
      ],
      "default": "Console"
    },
    "runtimeExecutable": {
      "type": "string",
      "description": "An OS resolvable path to the Probe-rs debugger executable.",
      "default": "probe-rs-debugger"
    },
    "runtimeArgs": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "String array of arguments to provide the startup arguments for the Probe-rs debugger executable.",
      "default": [
        "debug",
        "--dap"
      ]
    },
    "env": {
      "additionalProperties": {
          "type": "string"
      },
      "default": {},
      "description": "Environment variables defined as a key value pair. The 'key' is the name of the environment variable, and the 'value' is value of the environment variable.",
      "type": "object"
    },
    "cwd": {
      "type": "string",
      "description": "The working directory of the debugger, typically the RUST crate root",
      "default": "${workspaceFolder}"
    },
    "probe": {
      "type": "string",
      "description": "Use this flag to select a specific probe in the list. Use '--probe VID:PID' or '--probe VID:PID:Serial' if you have more than one probe with the same VID:PID."
    },
    "chip": {
      "type": "string",
      "description": "Please specify the appropriate chip from the list of supported chips reported by running `probe-rs-debugger list-chips`."
    },
    "connectUnderReset": {
      "type": "boolean",
      "description": "This option will result in the target reset pin being held high during the attach operation.",
      "default": false
    },
    "speed": {
      "type": "number",
      "description": "Specify the protocol speed in kHz."
    },
    "wireProtocol": {
      "type": "string",
      "description": "The correct wire Protocol to use.",
      "enum": [
        "Swd",
        "Jtag"
      ],
      "enumDescriptions": [
        "Use the Serial Wire Debug (SWD) protocol.",
        "Use the Joint Test Action Group (JTAG) protocol."
      ]
    },
    "allowEraseAll": {
      "type": "boolean",
      "description": "Allow the session to erase all memory of the chip or reset it to factory default.",
      "default": true
    },
    "flashingConfig": {
      "type": "object",
      "description": "These flashing options are applied when flashing one or more core `program_binary` files to the target memory.",
      "flashingEnabled": {
        "type": "boolean",
        "description": "Flash the target before debugging.",
        "default": true
      },
      "resetAfterFlashing": {
        "type": "boolean",
        "description": "Reset all cores on the target after flashing.",
        "default": true
      },
      "haltAfterReset": {
        "type": "boolean",
        "description": "Halt all cores on the target after reset.",
        "default": true
      },
      "fullChipErase": {
        "type": "boolean",
        "description": "Do a full chip erase, versus page-by-page erase.",
        "default": false
      },
      "restoreUnwrittenBytes": {
        "type": "boolean",
        "description": "Restore erased bytes that will not be rewritten from ELF.",
        "default": false
      }
    },
    "coreConfigs": {
      "type": "array",
      "description": "Each MCU core will have a mandatory `coreIndex`, `programBinary`, and `chip` as well as several other optional properties.",
      "items": {
        "required": [
          "programBinary"
        ],
        "coreIndex": {
          "type": "number",
          "description": "The zero based index of the MCU core for this session",
          "default": 0
        },
        "programBinary": {
          "type": "string",
          "description": "The path (relative to `cwd` or absolute) to the binary for your target firmware",
          "default": "./target/thumbv7em-none-eabihf/debug/${workspaceFolderBasename}"
        },
        "svdFile": {
          "type": "string",
          "description": "The path (relative to `cwd` or absolute) to the CMCIS-SVD file for your target core",
          "default": "./CMSIS.SVD"
        },
        "rttEnabled": {
          "type": "boolean",
          "description": "If true, the debugger will open an RTT Terminal tab for each of the active channels on the target.",
          "default": false
        },
        "rttChannelFormats": {
          "type": "array",
          "items": {
            "channelNumber": {
              "type": "number",
              "description": "The channel number to which this data format applies. If any active channel numbers are omitted, we will assume the default will be `dataFormat=String', and 'showTimestamps=false'."
            },
            "dataFormat": {
              "type": "string",
              "description": "One of the supported data formats for RTT channels.",
              "enum": [
                "String",
                "BinaryLE",
                "Defmt"
              ],
              "enumDescriptions": [
                "String (text) format.",
                "Binary Little Endian format.",
                "Deferred formatting (see: https://defmt.ferrous-systems.com)."
              ],
              "default": "String"
            },
            "showTimestamps": {
              "type": "boolean",
              "default": false,
              "description": "Enable the inclusion of timestamps in the RTT output for `dataFormat=String`."
            },
            "showLocation": {
              "type": "boolean",
              "default": true,
              "description": "Enable the inclusion of Defmt location information in the RTT output for `dataFormat=Defmt`."
            }
          }
        }
      }
    }
  }
}
```

### Attach: Supported configuration options.

```json
"attach": {
  "required": [
    "chip",
    "coreConfigs"
  ],
  "properties": {
    "server": {
      "type": "string",
      "description": "Optionally onnect to an existing `probe-rs-debugger` session on IP and Port, e.g. '127.0.0.1:50000'",
      "default": "127.0.0.1:50000"
    },
    "consoleLogLevel": {
      "type": "string",
      "description": "The level of log info printed to the console. This does NOT affect the RUST_LOG defined in the `env` property.",
      "enum": [
        "Console",
        "Info",
        "Debug"
      ],
      "enumDescriptions": [
        "The console will only contain error messages and process status messages.",
        "The console log will also contain high level information about interactions between the extension and the debug adapter.",
        "The console log will also contain detailed information about interactions between the extension and the debug adapter."
      ],
      "default": "Console"
    },
    "runtimeExecutable": {
      "type": "string",
      "description": "An OS resolvable path to the Probe-rs debugger executable.",
      "default": "probe-rs-debugger"
    },
    "runtimeArgs": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "String array of arguments to provide the startup arguments for the Probe-rs debugger executable.",
      "default": [
        "debug",
        "--dap"
      ]
    },
    "env": {
      "additionalProperties": {
          "type": "string"
      },
      "default": {},
      "description": "Environment variables defined as a key value pair. The 'key' is the name of the environment variable, and the 'value' is value of the environment variable.",
      "type": "object"
    },
    "cwd": {
      "type": "string",
      "description": "The working directory of the debugger, typically the RUST crate root",
      "default": "${workspaceFolder}"
    },
    "probe": {
      "type": "string",
      "description": "Use this flag to select a specific probe in the list. Use '--probe VID:PID' or '--probe VID:PID:Serial' if you have more than one probe with the same VID:PID."
    },
    "chip": {
      "type": "string",
      "description": "Please specify the appropriate chip from the list of supported chips reported by running `probe-rs-debugger list-chips`."
    },
    "connectUnderReset": {
      "type": "boolean",
      "description": "This option will result in the target reset pin being held high during the attach operation.",
      "default": false
    },
    "speed": {
      "type": "number",
      "description": "Specify the protocol speed in kHz."
    },
    "wireProtocol": {
      "type": "string",
      "description": "The correct wire Protocol to use.",
      "enum": [
        "Swd",
        "Jtag"
      ],
      "enumDescriptions": [
        "Use the Serial Wire Debug (SWD) protocol.",
        "Use the Joint Test Action Group (JTAG) protocol."
      ]
    },
    "allowEraseAll": {
      "type": "boolean",
      "description": "Allow the session to erase all memory of the chip or reset it to factory default.",
      "default": true
    },
    "flashingConfig": {
      "type": "object",
      "description": "These flashing options are applied when flashing one or more core `program_binary` files to the target memory.",
      "flashingEnabled": {
        "type": "boolean",
        "description": "Flash the target before debugging.",
        "default": true
      },
      "resetAfterFlashing": {
        "type": "boolean",
        "description": "Reset all cores on the target after flashing.",
        "default": true
      },
      "haltAfterReset": {
        "type": "boolean",
        "description": "Halt all cores on the target after reset.",
        "default": true
      },
      "fullChipErase": {
        "type": "boolean",
        "description": "Do a full chip erase, versus page-by-page erase.",
        "default": false
      },
      "restoreUnwrittenBytes": {
        "type": "boolean",
        "description": "Restore erased bytes that will not be rewritten from ELF.",
        "default": false
      }
    },
    "coreConfigs": {
      "type": "array",
      "description": "Each MCU core will have a mandatory `coreIndex`, `programBinary`, and `chip` as well as several other optional properties.",
      "items": {
        "required": [
          "programBinary"
        ],
        "coreIndex": {
          "type": "number",
          "description": "The zero based index of the MCU core for this session",
          "default": 0
        },
        "programBinary": {
          "type": "string",
          "description": "The path (relative to `cwd` or absolute) to the binary for your target firmware",
          "default": "./target/thumbv7em-none-eabihf/debug/${workspaceFolderBasename}"
        },
        "svdFile": {
          "type": "string",
          "description": "The path (relative to `cwd` or absolute) to the CMCIS-SVD file for your target core",
          "default": "./CMSIS.SVD"
        },
        "rttEnabled": {
          "type": "boolean",
          "description": "If true, the debugger will open an RTT Terminal tab for each of the active channels on the target.",
          "default": false
        },
        "rttChannelFormats": {
          "type": "array",
          "items": {
            "channelNumber": {
              "type": "number",
              "description": "The channel number to which this data format applies. If any active channel numbers are omitted, we will assume the default will be `dataFormat=String', and 'showTimestamps=false'."
            },
            "dataFormat": {
              "type": "string",
              "description": "One of the supported data formats for RTT channels.",
              "enum": [
                "String",
                "BinaryLE",
                "Defmt"
              ],
              "enumDescriptions": [
                "String (text) format.",
                "Binary Little Endian format.",
                "Deferred formatting (see: https://defmt.ferrous-systems.com)."
              ],
              "default": "String"
            },
            "showTimestamps": {
              "type": "boolean",
              "default": false,
              "description": "Enable the inclusion of timestamps in the RTT output for `dataFormat=String`."
            },
            "showLocation": {
              "type": "boolean",
              "default": true,
              "description": "Enable the inclusion of Defmt location information in the RTT output for `dataFormat=Defmt`."
            }
          }
        }
      }
    }
  }
}
```
