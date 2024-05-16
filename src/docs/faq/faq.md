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
