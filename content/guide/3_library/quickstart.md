+++
title = "probe-rs quickstart"
+++
## Attaching to a target

```rs
use probe_rs::Probe;

// Get a list of all available debug probes.
let probes = Probe::list_all();

// Use the first probe found.
let probe = probes[0].open()?;

// Attach to a chip.
let session = probe.attach("nrf52")?;

// Select a core.
let core = session.core(0)?;

// Halt the attached core.
core.halt()?;
```

<b>probe-rs</b> can be used to automate your workflow.

Want to do
<ul>
    <li>hardware-in-the-loop testing?</li>
    <li>automatic WCET analysis?</li>
    <li>automatic firmware downloads in your project?</li>
</ul>

<b>probe-rs</b> was designed with such usecases in mind.<br>

Read more about <a href="/guide/basics#structure">the structure</a>.

## Reading and writing memory

```rs
use probe_rs::Core, Session};

// Attach to the first connected probe.
let session = Session::auto_attach("nrf52")?;

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

Reading and writing memory is trivial with <b>probe-rs</b>.

<b>probe-rs</b> supports different word sizes and block transfers.

Don't forget to unlock the flash before you write to it!

Read more about <a href="/guide/basics#core">memory operations</a>.
    
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

Of course the flash facility can also report progress.<br>

Any target that has a CMSIS-Pack can be converted into a <b>probe-rs</b> flash download target with our
<a href="https://github.com/probe-rs/target-gen" target="_blank">utility</a>

Read more about <a href="/guide/downloading">downloading flash</a>.