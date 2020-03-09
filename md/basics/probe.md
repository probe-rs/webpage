The [Probe](https://docs.rs/probe-rs/0.5.1/probe_rs/struct.Probe.html) struct represents the physical probe in code form.
It is used to do probe discovery, setting phyiscal parameters of the probe, spawning sessions and last but
not least use special probe specific features such as SWV tracing, hard reset, etc.
So if you are looking for non-core-architecture-specific functionality, the `Probe` struct is most likely the
right place to look.

While it is possible to open a probe from a boxed trait this is most likely not really helpful for a user. As a dev this is needed if you implement your own probe. More about this in the [chapter about implementing your own probe](/guide/basics#probe)</a>.

Best is to list the connected probes and open the one you like. Most likely there is one only anyways.

```rs
// Get a list of all available debug probes.
let probes = Probe::list_all();

// Use the first probe found.
let probe = probes[0].open()?;
```

Now you can access all the functionality a probe can offer. Not all probes offer the same functionality, which is why some calls may return a negative `Result`.

```rs
// Perform a hard reset of the connected target via the probe.
probe.target_reset()?;

// Select the debug protocol. Default is SWD.
probe.select_protocol(WireProtocol::Swd)?;

// Attach to a chosen target.
let session = probes[0].attach("nRF52")?;
```

Now we have got our [Session](https://docs.rs/probe-rs/0.5.1/probe_rs/struct.Session.html) ready to conduct further business.
Take a closer look at the [::attach()](https://docs.rs/probe-rs/0.5.1/probe_rs/struct.Probe.html#method.attach) call. Appart from passing a chip name, you can also pass various other arguments for selecting the chip.