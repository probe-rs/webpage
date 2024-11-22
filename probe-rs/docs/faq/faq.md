---
title: "FAQ"
description: "A collection of FAQ"
order: 00
---

## I cannot flash my target

Make sure you try with and without the `connect-under-reset` argument. Some chips need it and others don't support it at all.

## My stm32 target does not flash or boot, what to do?

Try to connect BOOT0 to ground and flash the firmware while doing that to unbrick your target.

## Why you can't use probe-rs with arduino/adafruit/micropython/u2f bootloaders?

These devkits don't contain a debug probe and are only flashed over USB/a serial interface.
Thus it is not possible for us to debug those targets.

## I get some weird probe error, how do I debug it?

## How to debug the debugger?

## probe-rs does fails to connect to RTT, what to do?

Make sure your firmware does not crash very early. This is a very common reason we actually never get to run RTT which makes probe-rs fail to find the necessary information to connect.

## How do I add a new target?

Please see the documentation on [CMSIS-Packs](/docs/knowledge-base/cmsis-packs)

## probe-rs gives me an error, what should I do?

If you encounter an error that you think is a bug in probe-rs, you should report it to us!

In case your issue reproduces in a reliable way (i.e., when running the same command you get the same error), you can generate a report that includes some important information in a zip file!
You can generate a report by appending `--report` to the failing command.

For example, if you encounter an error running `probe-rs run --chip atsamd51p19a path_to_elf`, you can generate a report by running the following:

`probe-rs run --chip atsamd51p19a path_to_elf --report`

The command will create `report.zip` in your current folder, and it will also print a link to open a GitHub issue pre-filled with a summary of the report.

> If you feel uncomfortable clicking weird links, you don't have to! It's just a shortcut to a new issue in the probe-rs GitHub repository!

Please add anything you might find relevant to the issue description! Additionally, please upload it along with your issue ticket!

### What does the zip contain?

The generated `report.zip` contains the following files:

- If applicable, the firmware image you're working with. Be aware that this might contain personal or otherwise sensitive information.
- Logs generated during execution.
- probe-rs version information.
