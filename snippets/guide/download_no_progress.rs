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