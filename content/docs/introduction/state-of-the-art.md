+++
title = "State Of The Art"
description = "The current state of embedded development."
date = 2021-05-01T08:00:00+00:00
updated = 2021-05-01T08:00:00+00:00
draft = true
weight = 10
sort_by = "weight"
template = "docs/page.html"

[extra]
toc = true
top = false
+++

Today there is a multitude of tools dedicated to operating debug probes.
One could think it is unnecessary effort to create another tool for this purpose.

To understand why we need another tool, we describe existing tools in the next paragraph and try to layout their pluses and downsides.

## Segger Tooling

**Positive**

+ Supports an extreme amount of targes.
+ Includes a lot of features and gets new chip additions frequently.
+ The tools are very stable.
+ Integrated into many IDEs and manufacturer tooling.
+ Has the possibility to be used as a library.

**Negative**
- Only works with their proprietary debug probe the J-Link.
- Proprietary license.
- The J-Link is quite expensive (200$+) for non-educational purposes though you can get a lesser version for 50$ if you use it for educational purposes.
- GDB based tooling; more on why this is bad, see [GDB](/guide/introduction/state-of-the-art/#gdb).
- Tooling has nineties UI and UX.
- The libary is not free to use.

## OpenOCD

**Positive**

+ Supports an extreme amount of targes.
+ Supports a lot of probes.
+ Integrated into many IDEs and manufacturer tooling.
+ Exists for a long time and has a lot of contributors.

**Negative**
- Old codebase in C.
- Proprietary license.
- The J-Link is quite expensive (200$+) for non-educational purposes though you can get a lesser version for 50$ if you use it for educational purposes.
- GDB based tooling; more on why this is bad, see [GDB](/guide/introduction/state-of-the-art/#gdb).
- Tooling has nineties UI and UX.


- openocd
- pyocd
- BMP
- GDB
- use as a library