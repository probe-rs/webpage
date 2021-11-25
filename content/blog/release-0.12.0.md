+++
title = "0.12.0 Released! 🎉"
description = "0.12.0 Released! 🎉"
date = 2021-11-25T14:00:00+00:00
updated = 2021-11-25T14:00:00+00:00
draft = false
template = "blog/page.html"

[taxonomies]
authors = ["Yatekii"]

+++

Hi everyone!

After [two long weeks](/blog/release-0-11-0/#automatic-releases) we are back with the release of 0.12.0.

We have had a lot of development on various fronts on which I intend to give an overview down below.

## probe-rs

We have two huge new features in probe-rs which do not seem like much from a regular user perspective but actually enable us to implement a lot of additional functionality down the road.

First of all we finally merged [Sequence support](/blog/release-0-11-0/#debug-sequences). There is only one target (namely the LPC55S69) which has custom sequences, but there are a lot more chips which can profit from this to do chip-unlock, multicore, special reset sequences and much more.

The second bigger thing is multicore support and DPv2 support. While multicore is pretty much self explanatory, DPv2 support enables us to select a DebugPort, which enables us to do Multidrop SWD. This is a not so much used functionality, but while it's cool to have anyways, it is required to support the RPi2040, which has one DebugPort for each core instead of one for both, which regular multicore targets do.
Also, for proper multicore support on all targets, many of them will need to implement sequences to unlock additional cores, which is not implemented for most of them yet.
A big thank you for this goes to [Dirbaio](https://github.com/Dirbaio) and [diondokter](https://github.com/diondokter).

Apart from that we added various smaller things that make developer life easier; to see what changed, please have a look at the [CHANGELOG.md](https://github.com/probe-rs/probe-rs/blob/master/CHANGELOG.md).

## VSCode

Our [VSCode plugin](https://github.com/probe-rs/vscode) is included in this release. While it surely still is rough around the edges, it is definitely useable and I encourage all of you to give it a shot so that we can identify all the issues and make it even better. [@noppej](https://github.com/noppej) and recently [@Tiwalun](https://github.com/Tiwalun) too have been hard at work to provide you with a good debugging experience. Thank you!

You can find more info around using the plugin in the Repo and on our Guide.

## Hardware Based Testing

Behind the scenes, our newest crewmember, [@TeyKey1](https://github.com/TeyKey1) has been very hard at work for his BSc thesis to make large scale HW testing for probe-rs a reality.

You can find all the info around the designs in the [repo](https://github.com/probe-rs/hive).

The design has been revamped from last blog's [sneakpeek](/blog/release-0-11-0/#hardware-based-testing) and is now oriented a bit differently. Previously I tried to make the design to fit as many possible targets and probes as possible and due to hardware and monetary constraints, the design disregarded runtime. So in the old design if we actually tested a lot of targets it would result in immense testing times because the design could not multiplex well. Additionally, the old design was not suitable to be built for every dev so they could test at home - even if they'd put less targets on the test.

So the new design takes all of this into consideration. It features a compact build with a bit less possible targets and probes: 4 probes and 32 targets can be tested with 4 tests at once being possible - one on each probe. The design features a RaspberryPi 4 as a base and stacks shields with chip daughterboards on top.
This enables everyone to design a daugtherboard which can be manufactured and included in the test-rig. If we need more than 4 probes or more than 32 targets, we can assemble a second rig - all at a very low cost of manufacturing with a very modular design.

The project itself is split into two parts. The first (this autumn semester) aims at making a testrig with a basic firmware to have the hardware working and tested. At the moment it looks like this will be done in time.
The next semester will be the second part, where Thierry will work on doing nice integration of the testrig with Github, automate everything to run on new PRs, write tests for the targets and test out all the daughterboards he designed.

If you have any wishes or ideas for the daughterboards or the tests to be performed, please voice them and we'll see if they can be included.

I am very stoked for this especially, as it enables us to make changes more fearlessly and test things very well!

## Automatic Releases

While this time the release was less than 2 hours work and thus more pleasant, we still did not manage to cut an earlier release. We will try on in the future to improve this ;)

## hs-probe

We have shipped many hs-probes - 166 to be precise - over the last few months. Very exciting!

For me personally, this has been a very unpleasant experience due to difficulties with shipping things to various locations on the planet. I put in many many more hours than I ever planned and in the end it would have been easier to do all the shipping myself.
Most likely I wont be doing this again.

I hope all the hs-probe owners are happy with their probes :)

If you are still waiting on a stuck order, please contact me. Unfortunately my possibilities here are limited. Most shipping providers apparently do not report shipping status back properly and have very different requirements and delivery times based on country and shipping provider.

Also, we have a little stock left still and I am happy to send those out.

# Thank you!

Thanks a lot to all of our developers, sponsors & users that made this a reality and appreciate the work put in.