---
title: "Raspberry Pi"
description: "How to use probe-rs to debug a Raspberry Pi."
order: 30
---

## Overview

**probe-rs** supports JTAG debugging with the [Raspberry Pi 4B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/).  This can be used to debug a custom OS or bootloader, the Linux kernel, or a hypervisor running on the board.

A debug probe that supports JTAG is required.  SWD is not supported on the Raspberry Pi.  The J-Link probe has been extensively tested but any ARM & JTAG capable probe that **probe-rs** supports should work.

Both 32 and 64-bit CPU modes are supported.  **probe-rs** will automatically detect the mode the CPU is operating in and adjust accordingly.

## Setup

The Raspberry Pi must be configured to enable output of the JTAG signals over GPIO.  This can be done by adding the following to `boot/config.txt` on the SD card:

```ini
# Disable pull downs
gpio=27=pu

# Enable JTAG
enable_jtag_gpio=1
```

The board does not have a JTAG connector.  JTAG signals are exposed on the 40 pin GPIO header and must be jumpered to your probe:

| Signal | GPIO Pin | JTAG 2x10 connector Pin |
|--------|----------|-------------------------|
| TRST   | GPIO22   | 3                       |
| RTCK   | GPIO23   | 11                      |
| TDO    | GPIO24   | 13                      |
| TCK    | GPIO25   | 9                       |
| TDI    | GPIO26   | 5                       |
| TMS    | GPIO27   | 7                       |

At a minimum TDO, TCK, TDI, TMS, and a ground pin must be connected to your probe.  It is recommended that TRST be connected and that the probes VTref pin be connected to a 3.3v output pin on the Raspberry Pi.

## Using probe-rs

The chip name to use with **probe-rs** is `RaspberryPi4B`.  When connecting make sure the protocol is explicitly specified as JTAG or connection errors may occur.  For example, to use the gdb server:

`probe-rs gdb --protocol jtag --chip RaspberryPi4B`

