+++
title = "Probe Setup"
description = "How to set up your debug probe to work with probe-rs."
date = 2021-05-01T08:20:00+00:00
updated = 2021-05-01T08:20:00+00:00
draft = false
weight = 20
sort_by = "weight"
template = "docs/page.html"

[extra]
toc = true
top = false
+++

The probe-rs project supports three probes out of the box.

Most of them require little to no setup. For linux, [udev](#udev-rules) rules are required for non admin access.

The [ST-Link](#st-link), to [J-Link](#segger-j-link) and [CMSIS-DAP](#cmsis-dap) based probes are supported.

# udev rules

By default, the debug probes are only accessible by users with root privileges on Linux based systems.
It is recommend to use appropriate udev rules to allow users without root privileges 
access to the debug probes as well.

1. Download the file [69-probe-rs.rules](/files/69-probe-rs.rules)[^1] and place it in /etc/udev/rules.d. 
2. Run `udevadm control --reload` to ensure the new rules are used.
3. Run  `udevadm trigger` to ensure the new rules are applied to already added devices.

If you're still unable to access the debug probes after following these steps, try adding your user to the plugdev group.

[^1]: The file needs to have an initial number lower than 73, otherwise the udev rules do not get applied properly. See [this Github discussion](https://github.com/systemd/systemd/issues/4288#issuecomment-348166161) for more information.

# CMSIS-DAP

CMSIS-DAP is a standard for debug probes which is managed by ARM. All probes implementing this
standard are supported by probe-rs.

## Setup

### Linux

No additional drivers are required to use CMSIS-DAP based probes on Linux systems. 
To ensure that users without root privileges can use the debug probe, it is recommended to
configure udev as described in [udev rules](#udev-rules).

### Windows

No driver installation required.

### Mac OS

No driver installation required.

# ST-Link

The ST-Link is a debug probe from ST Microelectronics. 
It is commonly found on their evaluation boards,
such as the Discovery and Nucleo boards.

## Setup

### Linux

No additional drivers are required to use a ST-Link debug probe on Linux systems. 
To ensure that users without root privileges can use the debug probe, it is recommended to
configure udev as described in [udev rules](#udev-rules).

### Windows

To use the ST-Link on Windows, you need to install the official drivers, which can be found on
the [ST website](https://www.st.com/content/st_com/en/products/development-tools/software-development-tools/stm32-software-development-tools/stm32-utilities/stsw-link009.html).


### Mac OS

No driver installation required.


## Supported Versions

The following versions of the ST-Link are supported:

* ST-Link V2, Firmware version 2.26 or higher
* ST-Link V3, Firmware version 3.2 or higher

If you get an error message indicating that the firmware is outdated, please use the
official ST tools to update the firmware.
The update tool can be found on 
the [ST website](https://www.st.com/en/development-tools/stsw-link007.html).

# SEGGER J-Link

The J-Link is a debug probe from [Segger](https://www.segger.com/). It is available as a stand-alone
product, but also integrated into evaluation boards directly.

Due to the proprietary nature of the J-Link, probe-rs will not achieve the same speed as the official J-Link tools.

## Setup

### Linux

No additional drivers are required to use a J-Link debug probe on Linux systems. 
To ensure that users without root privileges can use the debug probe, it is recommended to
configure udev as described in [udev rules](#udev-rules).

### Windows

Unfortunately, probe-rs doesn't work with the official drivers on Windows. To use probe-rs
it is necessary to install a generic WinUSB driver. The recommended way of doing this is
by using [Zadig](https://zadig.akeo.ie/) and selecting WinUSB as the driver for the J-Link probe.
This will uninstall the official driver, 
which means that the official Segger tools will not work anymore after this.


### Mac OS

No driver installation required.
