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
