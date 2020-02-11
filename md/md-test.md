**BOLD**
```rust

use probe_rs::Probe;

// Get a list of all available debug probes.
let probes = Probe::list_all();

// Use the first probe found.
let probe = probes[0].open()?;

// Attach to a chip.
let session = probe.attach("nrf52")?;

// Select a core.
let core = session.attach_to_core(0)?;

// Halt the attached core.
core.halt()?;

```