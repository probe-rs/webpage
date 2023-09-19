---
title: "Quickstart"
description: "A quick example how to use probe-rs"
order: 10
---

## Attaching to a target

```rs
use probe_rs::{Permissions, Probe};
use std::time::Duration;

// Get a list of all available debug probes.
let probes = Probe::list_all();

// Use the first probe found.
let probe = probes[0].open()?;

// Attach to a chip.
let mut session = probe.attach("nrf52", Permissions::default())?;

// Select a core.
let mut core = session.core(0)?;

// Ask to halt the attached core, waiting for no longer than 1 second for the request to succeed
core.halt(Duration::from_secs(1))?;
```

**probe-rs** can be used to automate your workflow.

Want to do
* hardware-in-the-loop testing?
* automatic WCET analysis?
* automatic firmware downloads in your project?

**probe-rs** was designed with such usecases in mind.

Read more about [the structure](/guide/basics#structure).

## Reading and writing memory

```rs
use probe_rs::{MemoryInterface, Permissions, Session};

// Attach to the first connected probe.
let session = Session::auto_attach("nrf52", Permissions::default())?;

// Select the first core found.
let mut core = session.core(0);

// Read a block of 50 32 bit words.
let mut buff = [0u32;50];
core.read_32(0x2000_0000, &mut buff)?;

// Read a single 32 bit word.
let word = core.read_word_32(0x2000_0000)?;

// Writing is just as simple.
let buff = [0u32;50];
core.write_32(0x2000_0000, &buff)?;

// of course we can also write 8bit words.
let buff = [0u8;50];
core.write_8(0x2000_0000, &buff)?;
```

Reading and writing memory is trivial with **probe-rs**.

**probe-rs** supports different word sizes and block transfers.

Don't forget to unlock the flash before you write to it!

Read more about [memory operations](/guide/basics#core).

## Downloading to flash

```rs
use probe_rs::Probe;
use probe_rs::flash::download::{
    Format,
    download_file,
};

// Get a list of all available debug probes.
let probes = Probe::list_all();

// Use the first probe found.
let probe = probes[0].open()?;

// Attach to a chip.
let session = probe.attach("nrf52")?;

// Load the memory map.
let mm = session.memory_map();

download_file(
    &session,
    std::path::Path::new("/path/to/elf"),
    Format::Elf,
    &mm,
).unwrap();
```

Downloading firmware to your target is as easy.

Of course the flash facility can also report progress.

Any target that has a CMSIS-Pack can be converted into a **probe-rs** flash download target with our
[utility](https://github.com/probe-rs/probe-rs/tree/master/target-gen)

Read more about [downloading flash](/guide/downloading).
