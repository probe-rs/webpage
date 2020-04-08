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
