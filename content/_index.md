+++
title = "probe-rs"


# The homepage contents
[extra]
lead = 'a modern, embedded debugging toolkit, written in Rust'
url = "/docs/getting-started/introduction/"
repo_version = "GitHub v0.1.0"
repo_license = "Open-source Apache 2.0 or MIT License."
repo_url = "https://github.com/probe-rs/probe-rs"

[[extra.list]]
title = "Flash programming"
content = 'Downloading a binary to your MCU is easy with probe-rs. We support ELF, ihex and plain binary.'
color = '#80ADBF'
img = 'flash.svg'

[[extra.list]]
title = "Compatible"
content = 'ARM, RISC-V, CMSIS-DAP, STLink, JLink probe-rs supports it all. And many more to come!'
color = '#BF3459'
img = 'multilingual.svg'

[[extra.list]]
title = "Cargo integration"
content = "With cargo-flash you get everything cargo run gives you, but for embedded targets. No compromises."
color = '#BF834E'
img = 'cargo.png'
url = '/guide/1_tools/cargo-flash'

[[extra.list]]
title = "Extensible"
content = "probe-rs can be used as a library, giving you even more flexibility"
color = '#964FC2'
img = 'extensible.svg'
url = '/guide#a-probe-rs-library'

[[extra.list]]
title = "GDB integration"
content = "probe-rs includes a GDB stub to integrate seamlessly into your usual workflow with common tools.."
color = '#000000'
img = 'gdb.svg'

[[extra.list]]
title = "VSCode integration"
content = "We provide a Microsoft DAP server implementation with probe-rs to debug in VSCode."
color = '#4992BF'
img = 'vscode.svg'

+++
