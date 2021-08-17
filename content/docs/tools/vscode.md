+++
title = "VSCode"
description = "The vscode plugin & DAP server explained."
date = 2021-05-01T08:00:00+00:00
updated = 2021-08-16T08:00:00+00:00
draft = false
weight = 30
sort_by = "weight"
template = "docs/page.html"

[extra]
toc = true
top = false
+++

## Basics

The <b>probe-rs-debugger VS Code extension</b> uses the Microsoft Debug Adapter Protocol to implement an interactive debugging experience between VS Code and a probe-rs target.

The extension is currently in pre-production/Alpha stage, with limited functionality. For details of current status and functionality please read <a href="#Functionality">this section</a>.

<h3 class="guide" id="Installation">Installation</h3>

* Install the **probe-rs-debugger** extension in VS Code, by downloading the latest `probe-rs-debugger-0.2.2.vsix` from the [Releases](https://github.com/probe-rs/vscode/releases) page in our repo (we will publish to the Microsoft Extension marketplace when we exit the 'Alpha' phase of this project)
  * Install the extension by running `code --install-extension probe-rs-debugger-0.2.2.vsix` in the terminal
  * Alternatively, 
    * To generate the extension from source code...(if you wish to update the version distributed with this repository), <a href="#BuildAndRun">please follow these instructions</a> 

* Install the **probe-rs-debugger** server component, using instructions from [probe-rs-debugger](https://github.com/probe-rs/probe-rs/tree/master/debugger)

<h3 class="guide" id="Usage">Usage and Configuration</h3>

To use the `probe-rs-debugger` extension for VS Code, you will need to configure a `launch.json` entry for your target project.
The configuration choices are slightly different depending on if you wish to <a href="#launchConfig">Launch a new,</a> or <a href="#launchConfig">Attach to an existing,</a> `probe-rs-debugger` server.

Many of the entries in `launch.json` are optional, and the values for each are described in the hover tips. When values are restricted, the allowable values are available through VS Code intellisense.

A minimum configuration would look something like this (required customizations are indicated with //!MODIFY tags )

<h4 class="guide" id="minimumConfig">Launch'ing the `probe-rs-debugger` with minimum configufation<h4>

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "preLaunchTask": "${defaultBuildTask}",
            "type": "probe-rs-debug",
            "request": "launch",
            "name": "probe_rs Executable Test",
            "program_binary": "Fully qualified path to your program_binary", //!MODIFY
            "chip": "STM32H745ZITx", //!MODIFY
        }
    ]
}
```

The following fully configured examples can be used (with customizations to reflect your own project and chip) to help you get started.<br>

<h4 class="guide" id="launchConfig">Launching the `probe-rs-debugger` server automatically<h4>

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "probe-rs-debug",
            "request": "launch",
            "name": "probe_rs Executable launch example",
            "cwd": "${workspaceFolder}",
            "program_binary": "Relative or fully qualified path to your program_binary", //!MODIFY
            "chip": "STM32H745ZITx", //!MODIFY
            "connect_under_reset": true,
            "speed": 24000, //!MODIFY
            "probe": "PID:VID:<Serial>", //!MODIFY
            "runtimeExecutable": "probe-rs-debugger",
            "runtimeArgs": [
                "debug",
                "--dap"
            ],
            "core_index": 0,
            "flashing_enabled": true,
            "reset_after_flashing": true,
            "halt_after_reset": true,
            "console_log_level": "Info", //Error, Warn, Info, Debug 
        }
    ]
}
```

<h4 class="guide" id="attachConfig">Attachinging to an existing `probe-rs-debugger` server<h4>

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "preLaunchTask": "${defaultBuildTask}", //Configure a default build task for 'cargo build'
            "type": "probe-rs-debug",
            "request": "attach",
            "name": "probe_rs Server attach example",
            "server": "127.0.0.1:50001",
            "cwd": "${workspaceFolder}",
            "program_binary": "Relative or fully qualified path to your program_binary", //!MODIFY
            "chip": "STM32H745ZITx", //!MODIFY
            "connect_under_reset": true,
            "speed": 24000, //!MODIFY
            "probe": "PID:VID:<Serial>", //!MODIFY
            "core_index": 0,
            "flashing_enabled": true,
            "reset_after_flashing": true,
            "halt_after_reset": false,
            "console_log_level": "Info", //Error, Warn, Info, Debug           
        }
    ]
}
```

<h3 class="guide" id="RTT">Using RTT to transfer data (e.g. logs, and println) between VSCode and your target application</h3>

`probe-rs-debugger` and the VS Code extension supports using RTT in your target application.<br>

For more information on how to configure your target application to use RTT, please refer to the instructions under the 
<a href="../cargo-embed#RTT">cargo-embed</a> section of this guide.<br> 

In order to capture the RTT output in the VSCode extension, you will need to supply additional entries to your applications `launch.json` entry. You can use the following example and modify the channel information to match the `rtt-target` channel configurations in your application.

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "probe-rs-debug",
            "request": "launch",
            "name": "probe_rs rtt-target example",
            // ... <snip> ...
            "rtt_enabled": true,
            "rtt_timeout": 300,
            "rtt_channel_formats": [
                {
                    "channel_number": 0,
                    "data_format": "String", // Format RTT data as String data
                    "show_timestamps": true  // Include host-side timestamps for every line of data transferred from the target RTT output
                },
                {
                    "channel_number": 1,
                    "data_format": "BinaryLE" // Treat data as raw binary data, and do not format in any way
                }
            ]
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
            "rtt_enabled": true,
            // "rtt_timeout": 300, //!OPTIONAL
            // "rtt_channel_formats": [ //!OPTIONAL
            //     {
            //         "channel_number": 0,
            //         "data_format": "Defmt",
            //     }
            // ]
        }
    ]
}
```

<b>NOTE:</b>When using `defmt` RTT, please keep the following limitations in mind.<br>
* Due to the way the `defmt` crate works, it is currently not possible to mix `defmt` and `rtt-target` channels in a single application.
* The `defmt` crate always uses channel number 0 for its output.    

<b>TIP:</b>When using RTT, the data is streamed into a terminal window on a per channel basis. If your application uses multiple RTT channels, you may want to consider using the new [VSCode Terminal tabs](https://code.visualstudio.com/updates/v1_57#_integrated-terminal) setting.<br>

<h3 class="guide" id="Functionality">Current working functionality and known limitations</h3>

- [x] **Launch**: Automatcially launch probe-rs-debugger executable and connect to it, or ...
- [x] **Attach**: Use TCIP/IP port to connect to an existing probe-rs-debugger server
- [x] **Connect** to probe with probe-rs 
  - [x] Supports `connect-under-reset`
  - [ ] Only tested against STM32H745, using the Cortex-M7 core of this multi-core chip.
- [x] **Flash** the chip with your own binary. 
  - [x] Supports `reset-after-flashing`
  - [x] Supports `halt-after-reset`. This will allow you to set breakpoints in your main() function.
- [x] Set, clear, disable, enable hardware **Breakpoints**
- [x] **Step Over** executing code
  - [x] Step Over works at 'instruction' granularity, so sometimes requires multiple steps per line of code
  - [ ] Stepping at 'line' level, Step Into, Step Out, does not work yet
- [x] **Variables View**
  - [x] View values of core **Registers**, and changes during code execution
    - [ ] TODO: Expand to show additional architecture registers
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
- [x] **Call Stack View**
  - [x] Supports a single thread, for a single core of the chip, but will **allow selection of any frames** that are in the current thread
  - [ ] TODO: Support multiple threads
  - [ ] TODO: Support chips with multiple cores
- [ ] TODO: **Watch View** Nothing yet
- [x] **RTT** - Configure RTT Channels and capture their output in the `VSCode Integrated Terminal`
  - [x] RTT Channels that support Capture AND Input to VSCode Terminal windows
- [ ] TODO: Enable Debug Console to accept CLI commands via REPL

<h3 class="guide" id="BuildAndRun">Build and Testing the debug extension in VS Code</h3>

* Open the project folder in VSCode.
* Open a terminal and run the `yarn` command, to install VSCode development dependencies

<h4 class="guide" id="buildExecutable">To run against a compiled executable of `probe-rs-debugger`</h4>

* Modify the `debug-example` entry in '.vscode/launch.json' file to point to your target project.
* Press `F5` to __build and launch executable__ `probe-rs-debugger`. VSCode will open another VS Code window. In that window,
  * You will see the `debug-example` project you just configured.
* Select the debug environment `probe_rs Executable Test`.* Press `F5` to start debugging.
  
<h4 class="guide" id="buildDebuggable">To run against an debuggable instance of `probe-rs-debugger`</h4>

* Clone the [probe-rs](https://github.com/probe-rs/probe-rs.git) repository, and open it in VSCode. 
  * In this `probe-rs` repo, select the debug environment `DAP-Server probe-rs-debugger`
  * Press `F5` to start `probe-rs-debugger` as a debuggable server.
* Switch to the VSCode instance of the probe-rs `vscode` repository. 
  * Modify the `debug-example` entry in '.vscode/launch.json' file to point to your target project.
  * Press `F5` to __build and attach to the debuggable server instance of__ `probe-rs-debugger`. VSCode will open another VS Code window. In that window:
  * You will see the `debug-example` project you just configured.
  * Select the debug environment `probe_rs Server Test`.
  * Press `F5` to start debugging.