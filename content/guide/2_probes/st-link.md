+++
title = "ST-Link Setup"
+++
The ST-Link is a debug probe from ST Microelectronics. 
It is commonly found on their evaluation boards,
such as the Discovery and Nucleo boards.

## Setup

### Linux

No additional drivers are required to use a ST-Link debug probe on Linux systems. 
To ensure that users without root privileges can use the debug probe, it is recommended to
configure udev as described in [udev rules](@/guide/2_probes/udev.md).

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
