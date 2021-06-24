+++
title = 'probe-rs'


# The homepage contents
[extra]
lead = 'a modern, embedded debugging toolkit, written in Rust'
repo_license = 'Open-source Apache 2.0 or MIT License.'
repo_url = 'https://github.com/probe-rs/probe-rs'

[[extra.buttons]]
path = '/docs/getting-started/probe-setup/'
text = 'Get Started'

[[extra.buttons]]
url = 'https://github.com/sponsors/probe-rs'
text = 'Sponsor us'


[[extra.badges]]
html = '<a href="https://github.com/probe-rs/probe-rs" style="color:black" target="_blank"><i class="fab fa-github m-1" style="font-size:1.2em"></i></a>'
[[extra.badges]]
html = '<a href="https://crates.io/crates/probe-rs" target="_blank"><img src="https://meritbadge.herokuapp.com/probe-rs" alt="crates.io" class="m-1" /></a>'
[[extra.badges]]
html = '<a href="https://docs.rs/probe-rs" target="_blank"><img src="https://docs.rs/probe-rs/badge.svg" alt="documentation" class="m-1" /></a>'
[[extra.badges]]
html = '<a href="https://github.com/probe-rs/probe-rs/actions" target="_blank"><img src="https://github.com/probe-rs/probe-rs/workflows/CI/badge.svg" alt="GH Actions Status" class="m-1" /></a>'
[[extra.badges]]
html = '<a href="https://matrix.to/#/#probe-rs:matrix.org" target="_blank"><img src="https://img.shields.io/badge/chat-probe--rs%3Amatrix.org-brightgreen" alt="chat" class="m-1" /></a>'

[[extra.list]]
title = 'Flash programming'
content = 'Downloading a binary to your MCU is easy with probe-rs. We support ELF, ihex and plain binary.'
color = '#80ADBF'
img = 'flash.svg'

[[extra.list]]
title = 'Compatible'
content = 'ARM, RISC-V, CMSIS-DAP, STLink, JLink probe-rs supports it all. And many more to come!'
color = '#BF3459'
img = 'multilingual.svg'

[[extra.list]]
title = 'Cargo integration'
content = 'With cargo-flash you get everything cargo run gives you, but for embedded targets. No compromises.'
color = '#BF834E'
img = 'cargo.png'
url = '/guide/1_tools/cargo-flash'

[[extra.list]]
title = 'Extensible'
content = 'probe-rs can be used as a library, giving you even more flexibility'
color = '#964FC2'
img = 'extensible.svg'
url = '/guide#a-probe-rs-library'

[[extra.list]]
title = 'GDB integration'
content = 'probe-rs includes a GDB stub to integrate seamlessly into your usual workflow with common tools..'
color = '#000000'
img = 'gdb.svg'

[[extra.list]]
title = 'VSCode integration'
content = 'We provide a Microsoft DAP server implementation with probe-rs to debug in VSCode.'
color = '#4992BF'
img = 'vscode.svg'

+++
