---
title: "Probe Setup"
description: "How to set up your debug probe to work with probe-rs."
order: 20
---

## Platform specifics

probe-rs supports multiple probes out of the box.

Most of them require little to no setup. For linux, [udev](#linux%3A-udev-rules) rules
are required for non admin access.

### Linux: udev rules

By default, the debug probes are only accessible by users with root privileges
on Linux based systems. It is recommend to use appropriate udev rules to allow
users without root privileges access to the debug probes as well.

1. Download the <a href="/files/69-probe-rs.rules" download>rules file</a> and place
   it in /etc/udev/rules.d.
2. Run `udevadm control --reload` to ensure the new rules are used.
3. Run `udevadm trigger` to ensure the new rules are applied to already added
   devices.

If you're still unable to access the debug probes after following these steps,
try adding your user to the plugdev group.

[^1]: The file needs to have an initial number lower than 73, otherwise the udev
rules do not get applied properly. See
[this Github discussion](https://github.com/systemd/systemd/issues/4288#issuecomment-348166161)
for more information.

### Windows: WinUSB drivers

Some of the probe implementations are implemented using [nusb](https://crates.io/crates/nusb) which
uses the WinUSB drivers on Windows. For these devices you will need to download
[Zadig](https://zadig.akeo.ie/) and select WinUSB as the driver for your probe. This will uninstall
any official drivers, which means that the official tools will most likely not work anymore after
this.

## CMSIS-DAP

CMSIS-DAP is a standard for debug probes which is managed by ARM. All probes
implementing this standard are supported by probe-rs.

### Setup

#### Linux

No additional drivers are required to use CMSIS-DAP based probes on Linux
systems. To ensure that users without root privileges can use the debug probe,
it is recommended to configure udev as described in [udev rules](#linux%3A-udev-rules).

#### Windows, macOS

No driver installation required.

## ST-Link

The ST-Link is a debug probe from ST Microelectronics. It is commonly found on
their evaluation boards, such as the Discovery and Nucleo boards.

### Supported Versions

The following versions of the ST-Link are supported:

- ST-Link V2, Firmware version 2.26 or higher
- ST-Link V3, Firmware version 3.2 or higher

If you get an error message indicating that the firmware is outdated, please use
the official ST tools to update the firmware. The update tool can be found on
the [ST website](https://www.st.com/en/development-tools/stsw-link007.html).

### Setup

#### Linux

No additional drivers are required to use a ST-Link debug probe on Linux
systems. To ensure that users without root privileges can use the debug probe,
it is recommended to configure udev as described in [udev rules](#linux%3A-udev-rules).

#### Windows

To use the ST-Link on Windows, you need to install the official drivers, which
can be found on the
[ST website](https://www.st.com/en/development-tools/stsw-link009.html).

#### macOS

No driver installation required.

## SEGGER J-Link

The J-Link is a debug probe from [Segger](https://www.segger.com/). It is
available as a stand-alone product, but also integrated into some evaluation boards
directly.

Due to the proprietary nature of the J-Link, probe-rs will not achieve the same
speed as the official J-Link tools.

### Setup

#### Linux

No additional drivers are required to use a J-Link debug probe on Linux systems.
To ensure that users without root privileges can use the debug probe, it is
recommended to configure udev as described in [udev rules](#linux%3A-udev-rules).

#### Windows

Unfortunately, probe-rs doesn't work with the official drivers on Windows. To
use probe-rs it is necessary to install a generic WinUSB driver. The recommended
way of doing this is by using [Zadig](#windows%3A-winusb-drivers).

#### macOS

No driver installation required.

## FTDI

FTDI refers to a family of debug probes built using USB-JTAG bridges from
[FTDI](https://ftdichip.com/). probe-rs supports the following chips:

- FT232H
- FT2232C, FT2232D, FT2232H
- FT4232H

Due to the configurable nature of these chips, not every probe may be picked up by probe-rs. If you
have a probe that you know contains an FTDI chip, but probe-rs does not recognise it, please open
a ticket on [GitHub](https://github.com/probe-rs/probe-rs/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=)!

The following devices are known to work with probe-rs:

- [esp-prog](https://docs.espressif.com/projects/espressif-esp-dev-kits/en/latest/other/esp-prog/user_guide.html)
- The debug interface of [ESP32-Ethernet-Kit V1.2](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/hw-reference/esp32/get-started-ethernet-kit.html)
- [Adafruit FT232H Breakout](https://learn.adafruit.com/adafruit-ft232h-breakout)
- Olimex ARM-USB devices:
   - [ARM-USB-OCD](https://www.olimex.com/Products/ARM/JTAG/ARM-USB-OCD/)
   - [ARM-USB-OCD-H](https://www.olimex.com/Products/ARM/JTAG/ARM-USB-OCD-H/)
   - [ARM-USB-TINY](https://www.olimex.com/Products/ARM/JTAG/ARM-USB-TINY/)
   - [ARM-USB-TINY-H](https://www.olimex.com/Products/ARM/JTAG/ARM-USB-TINY-H/)

### Setup

#### Linux

No additional drivers are required to use a FTDI-based debug probe on Linux systems.
To ensure that users without root privileges can use the debug probe, it is
recommended to configure udev as described in [udev rules](#linux%3A-udev-rules).

#### Windows

Unfortunately, probe-rs doesn't work with the official (VCP or D2xx) drivers on Windows. To
use probe-rs it is necessary to install a generic WinUSB driver. The recommended
way of doing this is by using [Zadig](#windows%3A-winusb-drivers).

#### macOS

No driver installation required.

## ESP32 devices with built-in USB-JTAG interface

Some ESP32 devices come with built-in debug probes. The availability of this interface varies,
but usually, if your device includes two USB ports, one labelled `USB`, the other `UART`, then
there's a good chance the one marked as `USB` can act as a debug probe.

### Setup

#### Linux

No additional drivers are required to use an ESP32 built-in debug interface on Linux systems.
To ensure that users without root privileges can use the debug probe, it is
recommended to configure udev as described in [udev rules](#linux%3A-udev-rules).

#### Windows, macOS

No driver installation required.
