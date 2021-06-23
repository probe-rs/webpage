+++
title = "0.11.0 Released! 🎉"
description = "0.11.0 Released! 🎉"
date = 2021-06-23T23:07:00+00:00
updated = 2021-06-23T23:07:00+00:00
draft = false
template = "blog/page.html"

[taxonomies]
authors = ["Yatekii", "Tiwalun"]

+++

We are happy to announce the huge release of probe-rs 0.11.0 today.
It has been a long time coming and is possibly our biggest release so far with over 7 months of development since the last one in November 2020!

This release sports a lot of internal improvements, bugfixes and ease of life additions.

## probe-rs

Most notable for probe-rs are:
    - Our flash layouter got a huge overhaul and fixed some issues with ihex files and small data chunks.
    - A lot of SWD improvements for J-Link to work better and faster!
    - Secure access on chips with TrustZone™ is now possible.
    - probe-rs now makes use of double buffering in the flash process which gives it a decent speed improvement.
    - Many papercut fixes and RISC-V support for the GDB server.
    - probe-rs can now perform flash verification after flashing!
    - A lot of bugfixes for the ARM Debug Interface.

On top of that we added support for a multitude of targets!
Many SAMD, STM32, nRF5x and LPC devices were added or got improvements.

For a full list, checkout the changelog on the [release page](https://github.com/probe-rs/probe-rs/releases/tag/v0.11.0).

## cargo-flash

For cargo-flash we improved the error reporting a lot. Before we would display the plain error probe-rs gave us which was not very actionable for the user.
Now we try to give the user an actionable hint like in the picture below.

<center><img src="/img/release-0.11.0/cargo-flash-hints.png" style="max-width:100%"></center>
<br>

We have a whole error/hint catalogue and try to expand this. This feature can easily be ported to other tools such as cargo-embed and probe-run too to ease the development.

## cargo-embed

cargo-embed got two big ease of life improvements:

- RTT and the GDB server can not run concurrently. Previously this was not possible at all. Now you can enable RTT and GDB at the same time. Make sure to put `RUST_LOG=off` such that the GDB server does not print into the RTT UI. This is of course a bit suboptimal and we are working better ways to use RTT unhindered.
- Typos or non-existant config flags are now spotted and reported to the user, such that things like `enable` vs `enabled` do not cost you hours of debugging anymore.

## Ongoing Work & Behind the Scenes

### VSCode Plugin

For a long time our VSCode plugin has been the little loved child on the sidelines. Recently, [@noppej](https://github.com/noppej) has put in serious work to make it properly useable! Unfortunately the additions barely didn't make it into this release, but will most likely be in one of the next ones around the corner.

<center><img src="/img/release-0.11.0/probe-rs-debugger.gif" style="max-width:100%"></center>
<br>

You can check out the current state in the [repo](https://github.com/probe-rs/vscode) to take a sneak peek.
While running, halting, breaking and stepping works already, stepping only steps single instructions at the moment, which can be tedious.
This is being worked on as well as RTT support in the VSCode terminal section! This will be extended in the near future to be a full plugin that also supports RTT down channels as well as an SVD viewer and ITM tracing!

A proof of concept of the SVD viewer can be seen below.

<center><img src="/img/release-0.11.0/svd-viewer.jpeg" style="max-width:100%"></center>

### Debug Sequences

Debug sequences are ARMs intended way of performing special procedures on targets which deviate from standards (within allowed reasons or even violating the spec) to unlock features of different targets which go beyond simple flashing.

As many of you might have experienced while using probe-rs, some chips do not work as well as others. Furthermore, some chips do not work at all or lack certain features. Sequences will improve this a lot!
To illustrate what sequences will bring to probe-rs, here is a few examples:

- Special reset needs of SAMD devices will be enabled by sequences, meaning those chips are less troublesome.
- Flashing secure or otherwise special memory portions such as the network core memory of the nRF5340 will be possible with sequences as it allows us to perform special unlock procedures.
- Unlocking locked chips such as the nRF52xxx series is something sequences will enable (this is not a hack, this is manufacturer intended functionality. You wont be able to read memory contents with it if the chip is locked. You will only be able to program it again after it was unlocked & erased).
- ITM tracing and other advanced features can be unlocked and enabled with sequences.

In short, sequences will enable many new possibilities around different targets that have been difficult until now!

And another cool thing sequences will enable is automatic target detection! No more passing `--chip xyz`, possible hints of target/architecture mismatch when flashing a miscompiled binary, etc!

### Multicore Support

[@dirbaio](https://github.com/Dirbaio) and [@diondokter](https://github.com/diondokter) have been hard at work to make the handling of multicore MCUs possible.
This is entangled somewhat with debug sequences and will most likely hit together.
Unlocking and flashing of a nRF5340 (two M33 cores) already works, but we are missing a few changes to the core library which will have to be made to finalize this addition.

Not part of this PR, but closely related and under development as well is SWD v2 Multidrop support. This will enable us to flash chips like the RaspberryPI Pico. While a useable [fork](https://github.com/rp-rs/probe-rs) already exists, some work is still left to integrate this properly into the probe-rs core.

### Hardware based testing

We have recently merged a great addition by [@Tiwalun](https://github.com/Tiwalun) to improve testing of our PRs in the form of a smoke testing tool in the main repository.
You can set it up to test each PR against the devkits you own. This will catch many regressions and errors before we can merge them into master.

To step this one up, we have worked on a [custom hardware rig](https://github.com/probe-rs/hive) which will allow us to do large scale automated testing of each PR on a set of N targets multiplexed against M debug probes.
A sneak peek of the rigs design can be seen below ;)

<center><img src="/img/release-0.11.0/hive.jpg" style="max-width:100%"></center>

To push this project a little further, I have put up a posting for a BSc theory with a local technical university (Switzerland). If you are a BSc student and would like to work on this, feel free to reach out to [@Yatekii](https://github.com/Yatekii) no matter of locality. I cannot promise anything but I will try to figure something out to make this work!

## Various

### hs-probe

We announced the [hs-probe](https://github.com/probe-rs/hs-probe) quite a while ago. Many of you have ordered one already. Unfortunately the manufacturing was hit by the global chip shortages as well. The good news is that on the 26th of June the manufacturing should conclude and we can start the shipping of the probes!
[Emil](https://github.com/korken89) has been working really hard to make this a possibility and get the probe manufactured even during chip shortages!
If you have not ordered a probe yet, and would like to get ahold one, you can do so on our [shop](https://shop.probe.rs/).

### Automatic releases

We now have a pipeline set up to automate releases of the probe-rs core library and related crates. This should allow us to release way more often so your own tools do not have to pull from master constantly.
At the start we are aiming for approximately one release every two weeks. This is an experiment and we will see how it goes. We believe that we should bring new functionality and especially fixes to you as soon as possible.

Alongside more releases I'd like to try to blog a little more about the ongoing development and curiosities we encounter. Though, to focus more on development and user support I will keep this promise as small as possible for now ;)

### Sponsoring

We put a lot of work into probe-rs, because we believe in it being an important cornerstone to the embedded development ecosystem.
All of this is voluntary work and we continue to do so.
But during times when the life at our dayjob is a little more stressful it can become hard to spend the evening putting in extra work hours, which is why we set up a sponsoring possibility.

At this point, thanks a lot to all of our sponsors that already contribute a great deal to probe-rs' continued development and support!

If you love probe-rs and want to see it grow and prosper, we would love if you considered [sponsoring] probe-rs' development. Some of us would love to at least work part time on the project to speed up it's development and improve the quality of our tooling. Additionally, as explained above, we have big plans for hardware based testing to ensure the highest possible quality software, which will impose some monetary cost of course.
You can do so through [Github](https://github.com/sponsors/probe-rs) or [OpenCollective](https://opencollective.com/probe-rs).

### probe-rs in Production

I have heard of a handful of companies that are using or going to use probe-rs in production to provision their devices. This excites us very much and reassures that we are actually making a change in the embedded ecosystem!

# Thank you!

Thanks a lot to all of our users & sponsors that show us that our work is appreciated.