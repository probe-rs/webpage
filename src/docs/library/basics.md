---
title: "Basic Usage"
description: "The very basics of using the probe-rs library."
order: 20
---

## The Probe struct

The [Probe](https://docs.rs/probe-rs/*/probe_rs/probe/struct.Probe.html) struct represents the physical probe in code form. To list available probes, use the [Lister](https://docs.rs/probe-rs/latest/probe_rs/probe/list/struct.Lister.html) struct.
It is used to set physical parameters of the probe, spawn sessions and last but
not least use special probe specific features such as SWV tracing, hard reset, etc.
So if you are looking for non-core-architecture-specific functionality, the `Probe` struct is most likely the
right place to look.

While it is possible to open a probe from a boxed trait this is most likely not really helpful for a user. As a dev this is needed if you implement your own probe. More about this in the [chapter about implementing your own probe](/guide/basics#probe).

Best is to list the connected probes and open the one you like. Most likely there is one only anyways.

```rs
// Get a list of all available debug probes.
let lister = Lister::new();

let probes = lister.list_all();

// Use the first probe found.
let probe = probes[0].open()?;
```

Now you can access all the functionality a probe can offer. Not all probes offer the same functionality, which is why some calls may return a negative `Result`.

```rs
// Perform a hard reset of the connected target via the probe.
probe.target_reset()?;

// Select the debug protocol. Default is SWD.
probe.select_protocol(WireProtocol::Swd)?;

// Attach to a chosen target.
let session = probes[0].attach("nRF52")?;
```

Now we have got our [Session](https://docs.rs/probe-rs/*/probe_rs/struct.Session.html) ready to conduct further business.
Take a closer look at the [::attach()](https://docs.rs/probe-rs/*/probe_rs/struct.Probe.html#method.attach) call. Apart from passing a chip name, you can also pass various other arguments for selecting the chip.

## The Session struct

The [Session](https://docs.rs/probe-rs/*/probe_rs/struct.Session.html) construct is an established connection of a Probe to a Chip.
The session can be used to list cores and attach to a core.
It can also read properties of the target and is used to facilitate some internal things.
Most likely the only thing you'll ever use a Session for is attaching to a core.

```rs
/// List and print all cores.
let cores = session.list_cores();
println!("{:?}", cores);

/// Attach to a core.
let core = session.core(0);
```

## The Core struct

The [Core](https://docs.rs/probe-rs/*/probe_rs/struct.Core.html) is probably the struct you will interact most with.
With the core struct you can manipulate the CPU and it's accessible memories.

In the previous sections we have learned how we attach to a core.
Sometimes you want to access the core operations in quick fashion.
This is what [Session::auto_attach()](https://docs.rs/probe-rs/*/probe_rs/struct.Session.html#method.auto_attach) is for.
It lets you attach to the Core without first opening a Probe.
It will try to open a connected prbe, and select the Core as best as it can

```rs
let session = Session::auto_attach("chip_name")?;
let core = session.core(0)?;
```

Once you have attached to the Core, you are able to halt the Core at any point in time.

```rs
core.halt()?;
```

The [Core::halt()](https://docs.rs/probe-rs/*/probe_rs/struct.Core.html#method.halt) call does not ensure the Core will actually halt.
So you might want to ask the core whether it has halted

```rs
while let Ok(halted) = core.core_halted()? {
    if halted {
        break;
    }
}
```

We can single step the CPU on a per instruction basis

```rs
core.step()?;
```

or just let the core run

```rs
core.run()?;
```

And of course we can reset the core

```rs
core.reset()?;
```

Keep in mind it sometimes has to run for the reset to work.
This is a soft reset and might come with kinks and quirks.
Check the Probe struct for a hard reset.

Of course it's also possible to manipulate the CPU registers

```rs
let reg = core.read_core_reg(0x00)?;
core.read_core_reg(0x00, reg | 0x42)?;
```

We can also use hardware breakpoints

```rs
// More often than not you will want to set a breakpoint.
core.set_hw_breakpoint(address)?;

// But of course you can also remove the breakpoint.
core.clear_hw_breakpoint(address)?;
```

Of course manipulating the CPU alone is not enough. Therefore it's also possible to access the memories that are physically accessible by the CPU.

```rs
// We can read a single word for the convenience of reading registers.
let value = core.read_word_32(address)?;

// For reading flash contents you'll most likely want a block memory access.
let mut buffer = [0; 1337];
core.read_32(address, &mut buffer)?;

// Since reading alone is no fun, we can also write data.
let value = 42;
core.write_word_32(address, value)?;

// And again, block-access.
let buffer = [0; 42];
core.write_32(address, &buffer)?;
```

probe-rs handles batching for bigger memory requests and should optimize for maximum speed.
