The [Session](https://docs.rs/probe-rs/0.5.1/probe_rs/struct.Session.html) construct is an established connection of a Probe to a Chip.
The session can be used to list cores and attach to a core.
It can also read properties of the target and is used to facilitate some internal things.
Most likely the only thing you'll ever use a Session for is attaching to a core.

```rs
/// List and print all cores.
let cores = session.list_cores();
println!("{:?}", cores);

/// Attach to a core.
let core = session.attach_to_core(0);
```