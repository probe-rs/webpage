---
title: "Creating a coredump"
description: "How to create coredumps?"
order: 40
---

Coredumps are snapshots of your device's memory at a particular point in time. They, along with the
firmware `.elf` enable us to reproduce and debug issues you may experience with variable resolution
during a debugging session.

## When should I consider creating a coredump?

Every time you see something off in the variable list, e.g. where probe-rs prints an error
instead of a value. The following image illustrates one such case:

<center><img src="/images/coredump/variable_resolution_issue.png" style="margin-top: 1em; margin-bottom: 1em; max-width:100%; max-height:100%; width: auto; height: auto;" alt="Unresolved variables" /></center>

## How can I create a coredump?

First up, stop your program at a point that illustrates your issue. Next, you should open the
`DEBUG CONSOLE` and type the following:

`dump <start address> <memory length> <output file path>`

For example, to dump memory in the range `0x20000000..0x20001000` you can type:

`dump 0x20000000 0x1000 out.dump`

You can also list multiple memory regions that will be saved in the same file. The following will
store the memory region `0x00000..0x10000` and `0x20000000..0x20004000`

`dump 0 65536 0x20000000 16384 out.dump`

<center><img src="/images/coredump/coredump.png" style="margin-top: 1em; margin-bottom: 1em; max-width:100%; max-height:100%; width: auto; height: auto;" alt="Example dump" /></center>

## What should I include in the coredump?

Please include both the whole RAM region of your device, as well as the used flash space.

## How can I send you my coredump?

If your coredump and `.elf` do not contain sensitive information, you can just post them to GitHub,
as part of a new [Bug Report](https://github.com/probe-rs/probe-rs/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=).

If you would like to keep your files private, ask around on our [Matrix chat](https://matrix.to/#/#probe-rs:matrix.org) first!
