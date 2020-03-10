The [Core](https://docs.rs/probe-rs/0.5.1/probe_rs/struct.Core.html) is probably the struct you will interact most with.
With the core struct you can manipulate the CPU and it's accessible memories.

In the previous sections we have learned how we attach to a core. Someties you want to access the core operations in quick fashion. This is what [Core::auto_attach()](https://docs.rs/probe-rs/0.5.1/probe_rs/struct.Core.html#method.auto_attach) is for. It lets you attach to the Core without first opening a Probe and a Session. It will select the Core as best as it can

```rs
let core = Core::auto_attach("chip_name")?;
```

Once you have attached to the Core, you are able to halt the Core at any point in time.

```rs
core.halt()?;
```

The [Core::halt()](https://docs.rs/probe-rs/0.5.1/probe_rs/struct.Core.html#method.halt) call does not ensure the Core will actually halt.
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

Of course manipulating the CPU alone is not enough. Therefore it's also possible to access the memories that are phyiscally accessible by the CPU.

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