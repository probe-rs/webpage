---
title: "About probe-rs"
description: "What is probe-rs and what does it do"
order: 10
---

`probe-rs` is an embedded debugging and target interaction toolkit. It enables
its user to program and debug microcontrollers via a debug probe.

`probe-rs` helps you with

- Flashing firmware to `ARM` and `RISC-V` targets. More architectures are in the
  works.
- Reading and writing memory, running, halting, setting and reading breakpoints
  and resetting the target via `SWD` and `JTAG`.
- Running firmware on the target and getting back logs via `RTT` and `defmt` and
  printing a stacktrace on panic.
- Debugging the target via `VS Code` with running `RTT` logs, memory inspection
  and more.

This article explains embedded debugging in a bit more detail and where probe-rs
fits in. You can skip it if you are familiar with embedded debugging.{.tip}

## Embedded debugging

In most programming fields the software can be written on a computer system akin
to the system the software is finally executed on. It hosts an OS, which has
processes, network access and most likely even GUI.

For embedded systems, this is different. The software run on a target that is
severely limited in its capabilities. It does not run an operating system and
has very limited IO. To be able to download (aka flash) the software from a host
system to the target or debug the target with a debugger, the targets debug
interface has to be used. That interface is different depending on the targets
architecture, but is very rudimentary and based on reading and writing certain
target memory regions that control the debug system of the target.

Modern computers have interfaces - such as USB - much more advanced than the
targets and cannot use the protocol natively. For this reason a debug probe is
required which translates from the host interface - mostly USB but sometimes
Ethernet - to the target interface - for ARM e.g. this would be SWD.

<figure>
    <img src="/images/about-probe-rs/jlink.png"
         alt="A debug probe" height="200px">
    <figcaption>A debug probe - a very handy utensil in embedded debugging.</figcaption>
</figure>

Some newer targets have DFU (device firmware upgrade) support via USB, but
cannot be debugged via such. DFU is handy for just flashing targets, but due to
its severe limitations is not suitable for debugging and writing said software.

## probe-rs

probe-rs is a library that implements the protocols of debug probes from various
manufacturers and the protocols of different chip architectures. It furthermore
is able to flash many targets and download software onto them.

While probe-rs was originally targeted at the Rust community, it can freely be
used for programming in C as well.
