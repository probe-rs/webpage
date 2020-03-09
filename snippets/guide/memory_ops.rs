use probe_rs::Core;

let core = Core::auto_attach("nrf52")?;

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