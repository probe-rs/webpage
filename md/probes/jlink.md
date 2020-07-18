# JLink

The JLink is a debug probe from [Segger](https://www.segger.com/). It is available as a stand-alone
product, but also integrated into evaluation boards directly.

Due to the proprietary nature of the JLink, probe-rs will not achieve the same speed as the official JLink tools.

## Setup

### Linux

No additional drivers are required to use a JLink debug probe on Linux systems. 
To ensure that users without root privileges can use the debug probe, it is recommended to
configure udev as described in [udev rules](/guide/udev).

### Windows

Unfortunately, probe-rs doesn't work with the official drivers on Windows. To use probe-rs
it is necessary to install a generic WinUSB driver. The recommended way of doing this is
by using [Zadig](https://zadig.akeo.ie/) and selecting WinUSB as the driver for the JLink probe.
This will uninstall the official driver, 
which means that the official Segger tools will not work anymore after this.


### Mac OS

No driver installation required.
