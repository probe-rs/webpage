+++
title = "J-Link Setup"
+++
The J-Link is a debug probe from [Segger](https://www.segger.com/). It is available as a stand-alone
product, but also integrated into evaluation boards directly.

Due to the proprietary nature of the J-Link, probe-rs will not achieve the same speed as the official J-Link tools.

## Setup

### Linux

No additional drivers are required to use a J-Link debug probe on Linux systems. 
To ensure that users without root privileges can use the debug probe, it is recommended to
configure udev as described in [udev rules](@/guide/2_probes/udev.md).

### Windows

Unfortunately, probe-rs doesn't work with the official drivers on Windows. To use probe-rs
it is necessary to install a generic WinUSB driver. The recommended way of doing this is
by using [Zadig](https://zadig.akeo.ie/) and selecting WinUSB as the driver for the J-Link probe.
This will uninstall the official driver, 
which means that the official Segger tools will not work anymore after this.


### Mac OS

No driver installation required.
