+++
title = "cargo-embed"
+++
## Basics

<b>cargo-embed</b> is the big brother of cargo-flash.<br>
It can also flash a target just like cargo-flash, but it can also open an RTT terminal as well as a GDB server.<br>
<br>
And there is much more to come in the future!

<h3 class="guide">Installation</h3>

<a href="https://crates.io/crates/cargo-embed"
    target="_blank">cargo-embed</a> can be found on crates.io.
We recommend installing it via
<pre>cargo install cargo-embed</pre>

<h3 class="guide">Configuration</h3>

cargo-embed can be configured via a `Embed.toml` in the project root.

The data from this file is structured in two levels; the outer layer is a configuration profile name, inside each configuration there are then a series of sections with different options. When invoking cargo-embed, a different configuration name can be passed as an argument, which will load the settings under that profile instead of `default`.

The available options can be found in the <a href="https://github.com/probe-rs/cargo-embed/blob/master/src/config/default.toml" target="_blank">default.toml</a>. This example uses toml syntax to set each option under the `default` top-level profile key.

<h2 class="guide" id="basics">RTT</h2>

RTT stands for real time transfers and is a mechanism to transfer data between the debug host and the debuggee.<br>
<br>
In it's essence it provides a configurable amount of ringbuffers, which are read/written by the target and the debug
host.
The protocol initially was published by <a
    href="https://www.segger.com/products/debug-probes/j-link/technology/about-real-time-transfer/"
    target="_blank">Segger</a> but there is really no magic to it other then ringbuffers being worked.
This mechanism allows us to transfer data from the target to the host and vice versa really fast.<br>
<br>
RTT features:
<ul>
    <li>Fast duplex data transfers</li>
    <li>A configurable ammount of channels(buffers)</li>
    <li>Channels can be blocking and non blocking - your choice</li>
</ul>

This guide should get you going in no time to speed up your development with probe-rs.

<h3 class="guide" id="target-simple">The target side</h3>

For the target side, we offer <a href="https://crates.io/crates/rtt-target" target="_blank">rtt-target</a>, a small lib
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

<h3 class="guide" id="host-simple">The host side</h3>

On the host, just run

<pre>cargo-embed</pre>

with RTT enabled in the Embed.toml file.

Now you should be able to see all the 'Hello World!'s in a default Channel called Terminal!

<center><img src="/img/cargo-embed-simple.png" style="margin-top: 1em; margin-bottom: 1em;" /></center>

<h3 class="guide" id="target-simple">Don't panic!</h3>

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

<center><img src="/img/cargo-embed-panic.png" style="margin-top: 1em; margin-bottom: 1em;" /></center>

We intentionally ship no default panic handler, so that you may choose the channel of your choice to log the panic
to!<br>
<br>

So how do I get more channels, you might ask. Read on!

<h3 class="guide" id="target-simple">All the channels!</h3>

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
figure it when you examine channel two ;)<br>
<br>
On the host side it looks like

<center><img src="/img/cargo-embed.png" style="margin-top: 1em; margin-bottom: 1em;" /></center>

As you can observe, we see all three up channels. You can switch to and from them with the F-keys.
The down channel will automatically be associated with the corresponding up channel and an input field will
automatically be displayed for channels with a corresponding down channel. This is done via the channel number, which
must be the same for the up and down channels. This is the default rttui behavior and can be configured. RTT itself can handle any up/down
numbers combination.<br>
<br>
Now you should be able to debug conveninently. Happy coding!
