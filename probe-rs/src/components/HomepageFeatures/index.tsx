import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import FeatureBlock from "../FeatureBlock";
import FeatureTitle from "../FeatureTitle";
import FeatureImage, { FeatureImageSmall } from "../FeatureImage";
import FeatureCode from "../FeatureCode";
import FeatureDescription from "../FeatureDescription";
import FeatureCodeTab from "../FeatureCodeTab";

export default function HomepageFeatures(): JSX.Element {
  return (
    <>
      <FeatureBlock>
        <FeatureTitle>Embedded programming made easy</FeatureTitle>
        <FeatureDescription>
          Run a program on your microchip with the ease of a native application.
          <br />
          <br />
          Easily print to STDOUT via{" "}
          <a href="https://github.com/probe-rs/rtt-target">RTT</a> and{" "}
          <a href="https://github.com/knurling-rs/defmt">defmt</a> encoding when
          using <strong>probe-rs run</strong>.
          <br />
          <br />
          <a href="/docs/tools/cargo-flash/">cargo-flash</a> can be used to just
          flash a target and <a href="/docs/tools/cargo-embed/">cargo-embed</a>
          can be used to get a full RTT terminal to also send commands to the
          target and view multiple channels at one.
        </FeatureDescription>
        <FeatureCode>
          <FeatureCodeTab
            title="rust"
            language="bash"
            code={`$ cargo run --release
  Compiling microbit v0.1.0 (/microbit/)
   Finished release [optimized + debuginfo] target(s) in 0.17s
    Running \`probe-rs run --chip nRF51822_xxAA target/thumbv6m-none-eabi/release/microbit\`
    Erasing sectors ✔ [00:00:00] [############] 5.00 KiB/5.00 KiB @ 8.09 KiB/s (eta 0s )
Programming pages   ✔ [00:00:00] [############] 5.00 KiB/5.00 KiB @ 5.29 KiB/s (eta 0s )

Hello from the microbit!
Going to udf to print a stacktrace on the host ...

Frame 0: exp_u128 @ 0x00000fa2
Frame 1: __udf @ 0x000000f2 inline
      /.cargo/registry/src/index.crates.io-6f17d22bba15001f/cortex-m-0.7.7/src/../asm/inline.rs:181:5
Frame 2: udf @ 0x00000000000000f2 inline
      /.cargo/registry/src/index.crates.io-6f17d22bba15001f/cortex-m-0.7.7/src/call_asm.rs:11:43
Frame 3: panic @ 0x00000000000000f2
      /repos/microbit/examples/gpio-hal-blinky/src/main.rs:36:9
Frame 4: exp_u128 @ 0x000006be
      /rustc/5680fa18feaa87f3ff04063800aec256c3d4b4be/library/core/src/ptr/const_ptr.rs:921:18
Frame 5: exp_u128 @ 0x000006ec
      /rustc/5680fa18feaa87f3ff04063800aec256c3d4b4be/library/core/src/num/bignum.rs:299:60
Frame 6: b @ 0x0000015e inline
      /repos/microbit/examples/gpio-hal-blinky/src/main.rs:45:5
Frame 7: a @ 0x0000000000000154 inline
      /repos/microbit/examples/gpio-hal-blinky/src/main.rs:41:5
Frame 8: __cortex_m_rt_main @ 0x0000000000000154
      /repos/microbit/examples/gpio-hal-blinky/src/main.rs:16:5
Frame 9: __cortex_m_rt_main_trampoline @ 0x00000104
      /repos/microbit/examples/gpio-hal-blinky/src/main.rs:10:1
Frame 10: <unknown function @ 0x000000ce> @ 0x000000ce inline
Frame 11: <unknown function @ 0x20004000> @ 0x20004000`}
          />

          <FeatureCodeTab
            title="C"
            language="bash"
            code={`$ make release
$ probe-rs run --chip nRF51822_xxAA build/microbit.elf
    Erasing sectors ✔ [00:00:00] [############] 5.00 KiB/5.00 KiB @ 8.09 KiB/s (eta 0s )
Programming pages   ✔ [00:00:00] [############] 5.00 KiB/5.00 KiB @ 5.29 KiB/s (eta 0s )

Hello from the microbit!
Going to udf to print a stacktrace on the host ...

Frame 0: exp_u128 @ 0x00000fa2
Frame 1: __udf @ 0x000000f2 inline
      /.cargo/registry/src/index.crates.io-6f17d22bba15001f/cortex-m-0.7.7/src/../asm/inline.rs:181:5
Frame 2: udf @ 0x00000000000000f2 inline
      /.cargo/registry/src/index.crates.io-6f17d22bba15001f/cortex-m-0.7.7/src/call_asm.rs:11:43
Frame 3: panic @ 0x00000000000000f2
      /repos/microbit/examples/gpio-hal-blinky/src/main.rs:36:9
Frame 4: exp_u128 @ 0x000006be
      /rustc/5680fa18feaa87f3ff04063800aec256c3d4b4be/library/core/src/ptr/const_ptr.rs:921:18
Frame 5: exp_u128 @ 0x000006ec
      /rustc/5680fa18feaa87f3ff04063800aec256c3d4b4be/library/core/src/num/bignum.rs:299:60
Frame 6: b @ 0x0000015e inline
      /repos/microbit/examples/gpio-hal-blinky/src/main.rs:45:5
Frame 7: a @ 0x0000000000000154 inline
      /repos/microbit/examples/gpio-hal-blinky/src/main.rs:41:5
Frame 8: __cortex_m_rt_main @ 0x0000000000000154
      /repos/microbit/examples/gpio-hal-blinky/src/main.rs:16:5
Frame 9: __cortex_m_rt_main_trampoline @ 0x00000104
      /repos/microbit/examples/gpio-hal-blinky/src/main.rs:10:1
Frame 10: <unknown function @ 0x000000ce> @ 0x000000ce inline
Frame 11: <unknown function @ 0x20004000> @ 0x20004000`}
          />
        </FeatureCode>
      </FeatureBlock>
      <FeatureBlock>
        <FeatureTitle>Easy debugging in VSCode</FeatureTitle>
        <FeatureDescription>
          Use <a href="/docs/tools/debugger/">VSCode's</a> awesome debug
          capabilities with our native debug plugin.
          <br />
          <br />
          Run the target, set breakpoints, halt on break point, inspect the
          stackframe and manipulate variables.
          <br />
          <br />
          <a href="https://github.com/probe-rs/rtt-target">RTT</a> is fully
          integrated and GDB-like expressions can be evaluated in the built in{" "}
          <a href="/docs/tools/debugger/">REPL</a>. <br />
          <br />
          VSCode not your cup of tea? No problem! probe-rs implements the{" "}
          <a href="https://microsoft.github.io/debug-adapter-protocol/overview">
            Debug Adapter Protocol
          </a>
          , so you can use other{" "}
          <a href="https://microsoft.github.io/debug-adapter-protocol/implementors/tools/">
            editors, IDEs, and visual debuggers
          </a>
          , such as
          <a href="https://github.com/puremourning/vimspector#readme">
            Vimspector
          </a>
          ...
        </FeatureDescription>
        <FeatureImage src="images/landing/probe-rs-debugger.png" />
      </FeatureBlock>
      <FeatureBlock>
        <FeatureTitle>A clean and intuitive API</FeatureTitle>
        <FeatureDescription>
          Manipulate your target from the host - read and write memory, set
          breakpoints, run, halt.
          <br />
          <br />
          Build production utilities or awesome HITL setups. The sky is the
          limit!
        </FeatureDescription>
        <FeatureCode>
          <FeatureCodeTab
            language="rust"
            title="main.rs"
            code={`use probe_rs::{(MemoryInterface, Permissions, Session)};

// Attach to the first connected probe.
let session = Session::auto_attach("nrf52", Permissions::default())?;

// Select the first core found. let mut core = session.core(0);
// Read a block of 50 32 bit words.
let mut data = [0u32;50];
core.read_32(0x2000_0000, &mut data)?;

// Read a single 32 bit word.
let word = core.read_word_32(0x2000_0000)?;

// Writing is just as simple.
let data = [0u32;50]; core.write_32(0x2000_0000, &data)?;

// of course we can also write 8bit words.
let data = [0u8;50]; core.write_8(0x2000_0000, &data)?;`}
          />
        </FeatureCode>
      </FeatureBlock>
      <FeatureBlock>
        <FeatureTitle>Every ARM or RISC-V target</FeatureTitle>
        <FeatureDescription>
          Hundreds of targets are shipped with probe-rs. You found a missing
          one?
          <br />
          <br />
          <a href="/docs/knowledge-base/cmsis-packs/#target-extraction">
            Generate
          </a>{" "}
          your own target description from an existing CMSIS-Pack in 2 minutes.
          <br />
          <br />
          No CMSIS-Pack?{" "}
          <a href="https://github.com/probe-rs/flash-algorithm-template">
            Write your own flash algorithm
          </a>{" "}
          in 2 hours with the help of our templates with automatic tests.`,
        </FeatureDescription>
        <FeatureImageSmall src="images/landing/manufacturers/arm.webp" />
        <FeatureImageSmall src="images/landing/manufacturers/nordic.svg" />
        <FeatureImageSmall src="images/landing/manufacturers/st.png" />
        <FeatureImageSmall src="images/landing/manufacturers/nxp.svg" />
        <FeatureImageSmall src="images/landing/manufacturers/espressif.svg" />
        <FeatureImageSmall src="images/landing/manufacturers/raspberrypi.png" />
        <FeatureImageSmall src="images/landing/manufacturers/risc-v.png" />
      </FeatureBlock>
      <FeatureBlock>
        <FeatureTitle>Supports many debug probes</FeatureTitle>
        <FeatureDescription>
          Debug targets via CMSIS-DAP, JLink, ST-Link and FTDI or add your own
          probe easily.
          <br />
          <br />
          We even have our own open-source probe to{" "}
          <a href="https://github.com/probe-rs/rusty-probe">build</a> or{" "}
          <a href="#">buy</a> (coming soon).
        </FeatureDescription>
        <FeatureImageSmall src="images/landing/probes/cmsis-dap.webp" />
        <FeatureImageSmall src="images/landing/probes/jlink.svg" />
        <FeatureImageSmall src="images/landing/probes/stlink.png" />
        <FeatureImageSmall src="images/landing/probes/ftdi.png" />
      </FeatureBlock>
    </>
  );
}
