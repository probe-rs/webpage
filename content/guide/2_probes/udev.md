+++
title = "Installing udev rules"
+++
By default, the debug probes are only accessible by users with root privileges on Linux based systems.
It is recommend to use appropriate udev rules to allow users without root privileges 
access to the debug probes as well.

1. Download the file [99-probe-rs.rules](/content/99-probe-rs.rules) and place it in /etc/udev/rules.d
2. Run `udevadm control --reload` to ensure the new rules are used.
3. Run  `udevadm trigger` to ensure the new rules are applied to already added devices.
