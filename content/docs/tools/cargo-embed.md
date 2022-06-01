+++
title = "cargo-embed"
description = "The cargo-embed utility explained."
date = 2021-05-01T08:00:00+00:00
updated = 2022-06-01T08:00:00+00:00
draft = false
weight = 20
sort_by = "weight"
template = "docs/page.html"

[extra]
toc = true
top = false
+++

**cargo-embed** is the big brother of cargo-flash.

It can also flash a target just like cargo-flash, but it can also open an RTT terminal as well as a GDB server.

And there is much more to come in the future!

## Installation

[cargo-embed](https://crates.io/crates/cargo-embed) can be found on crates.io.
We recommend installing it via

    cargo install cargo-embed

## Configuration

cargo-embed can be configured via a `Embed.toml` in the project root.

The data from this file is structured in two levels; the outer layer is a configuration profile name, inside each configuration there are then a series of sections with different options. When invoking cargo-embed, a different configuration name can be passed as an argument, which will load the settings under that profile instead of `default`.

The available options can be found in the [default.toml](https://github.com/probe-rs/cargo-embed/blob/master/src/config/default.toml). This example uses toml syntax to set each option under the `default` top-level profile key.

## RTT

RTT stands for real time transfers and is a mechanism to transfer data between the debug host and the debuggee.

In it's essence it provides a configurable amount of ringbuffers, which are read/written by the target and the debug
host.
The protocol initially was published by [Segger](https://www.segger.com/products/debug-probes/j-link/technology/about-real-time-transfer/) but there is really no magic to it other than ringbuffers being used.
This mechanism allows us to transfer data from the target to the host and vice versa really fast.

RTT features:
* Fast duplex data transfers
* A configurable amount of channels(buffers)
* Channels can be blocking and non blocking - your choice

This guide should get you going in no time to speed up your development with probe-rs.

### Target

For the target side, we offer [rtt-target](https://crates.io/crates/rtt-target), a small lib
to set up the RTT structures in the target memory and read/write data from/to them.

A minimal example of a host firmware would be

```rs
#![no_std]
#![no_main]

use microbit as _;
use panic_halt as _;
use rtt_target::{rprintln, rtt_init_print};

#[cortex_m_rt::entry]
fn main() -> ! {
    rtt_init_print!();
    loop {
        rprintln!("Hello, world!");
    }
}
```

### Host

On the host, just run

    cargo-embed

with RTT enabled in the Embed.toml file.

Now you should be able to see all the 'Hello World!'s in a default channel called "Terminal"!

![Hello World output via RTT](/img/cargo-embed-simple.png)

### Don't panic!

Of course it is easy to log all panics via RTT! Here is a most simple example of a panic handler:

```rs
#![no_std]
#![no_main]

use core::panic::PanicInfo;
use microbit as _;
use rtt_target::{rprintln, rtt_init_print};

#[cortex_m_rt::entry]
fn main() -> ! {
    rtt_init_print!();
    loop {
        rprintln!("Hello, world!");

        for _ in 0..1_000_000 {
            cortex_m::asm::nop();
        }

        panic!("This is an intentional panic.");
    }
}

#[inline(never)]
#[panic_handler]
fn panic(info: &PanicInfo) -> ! {
    rprintln!("{}", info);
    loop {} // You might need a compiler fence in here.
}
```

And in the open rttui view you should see the panic.

![Example panic logged to your channel](/img/cargo-embed-panic.png)

We intentionally ship no default panic handler, so that you may choose the channel of your choice to log the panic
to.

So how do I get more channels, you might ask. Read on!

### All the channels!

You can define multiple channels via a provided macro as seen in this snippet

```rs
#![no_main]
#![no_std]

use microbit as _;
use panic_halt as _;

use core::fmt::Write;
use cortex_m_rt::entry;

use rtt_target::rtt_init;

#[entry]
fn main() -> ! {
    let channels = rtt_init! {
        up: {
            0: {
                size: 512
                mode: BlockIfFull
                name: "Up zero"
            }
            1: {
                size: 128
                name: "Up one"
            }
            2: {
                size: 128
                name: "Up two"
            }
        }
        down: {
            0: {
                size: 512
                mode: BlockIfFull
                name: "Down zero"
            }
        }
    };

    let mut output2 = channels.up.1;
    writeln!(
        output2,
        "Hi! I will turn anything you type on channel 0 into upper case."
    )
    .ok();

    let mut output = channels.up.0;
    let mut log = channels.up.2;
    let mut input = channels.down.0;
    let mut buf = [0u8; 512];
    let mut count: u8 = 0;

    loop {
        let bytes = input.read(&mut buf[..]);
        if bytes > 0 {
            for c in buf.iter_mut() {
                c.make_ascii_uppercase();
            }

            let mut p = 0;
            while p < bytes {
                p += output.write(&buf[p..bytes]);
            }
        }

        writeln!(log, "Messsge no. {}/{}", count, bytes).ok();

        count += 1;

        for _ in 0..1_000_000 {
            cortex_m::asm::nop();
        }
    }
}
```

In this example we define three up channels and one down channel.
The third up channel continuously logs, the second prints just a single info message and what the first one does, you'll
figure it when you examine channel two ;)

On the host side it looks like

![Output of chree channels](/img/cargo-embed.png)

As you can observe, we see all three up channels. You can switch to and from them with the F-keys.
The down channel will automatically be associated with the corresponding up channel and an input field will
automatically be displayed for channels with a corresponding down channel. This is done via the channel number, which
must be the same for the up and down channels. This is the default rttui behavior and can be configured. RTT itself can handle any up/down
numbers combination.

Now you should be able to debug conveniently. Happy coding!
