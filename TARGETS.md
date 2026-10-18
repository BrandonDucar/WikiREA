# Investigation Targets

This is a question-led backlog, not a list of completed reconstructions. The first
collection covers twelve topics; the catalog labels static, manual-source and
documentation-only stages separately. More targets will be promoted only when
their evidence is actually collected and reviewed.

## Major Products And Systems

| Target | First Useful Question | Current Work |
| --- | --- | --- |
| [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts) | How do historical corrections differ from incoming bars? | Selected static investigation published |
| [Polygon.io / Massive client](https://github.com/massive-com/client-js) | How should feed units, pagination and gaps be handled? | Selected static investigation published |
| [Polygon Bor](https://github.com/0xPolygon/bor) | What binds a receipt to a specific block? | Selected Go source read; no node execution |
| [Robinhood Crypto API](https://robinhood.com/us/en/support/articles/crypto-api/) | What is read authority versus order authority? | Official documentation reviewed only |
| [NASA Open MCT](https://github.com/nasa/openmct) | How do independent historical/live views share telemetry? | Selected static investigation published |
| [PhotoCraft](https://github.com/storytold/photocraft) | What identity and edit targets survive undo/snapshot restore? | Selected Rust implementation/tests read |
| [FilmCraft](https://github.com/storytold/filmcraft) | Can timeline edits become a bounded headless contract? | Repository discovery only |
| [GridCraft](https://github.com/storytold/gridcraft) | How does formula invalidation compare with evidence invalidation? | Repository discovery only |
| [Home Assistant](https://github.com/home-assistant/core) | How do integrations express state and effects? | Repository discovery only |

PhotoCraft and related Craft tools are independent applications, not Adobe source.
Their maintainers' descriptions of reimplementation are not proof of complete
feature parity. The [official app catalog](https://getartcraft.com/apps) labels
development stages. Polygon market data and Polygon blockchain are different subjects.

## Unexpected Hardware And Preservation

| Public Project | Interesting Direction | Boundary |
| --- | --- | --- |
| [libimobiledevice](https://github.com/libimobiledevice/libimobiledevice) | iPhone service interoperability | No phone/private backup accessed |
| [UTM](https://github.com/utmapp/UTM) | Virtual machine lifecycle on iOS/macOS | No machine image executed |
| [Asahi Linux docs](https://github.com/AsahiLinux/docs) | Apple Silicon interface documentation | Not all Apple software or hardware reconstructed |
| [epk2extract](https://github.com/openlgtv/epk2extract) | TV firmware container formats | No device or firmware image operated on |
| [Anova Oven Forwarder](https://github.com/huangyq23/anova-oven-forwarder) | Temperature/state telemetry versus heating commands | No appliance control or auth extraction |
| [ESPHome](https://github.com/esphome/esphome) | Configuration-to-firmware validation | No device flashing or electrical work |
| [Rockbox](https://github.com/Rockbox/rockbox) | Durable playlists and resume state on music players | Repository discovery only |
| [Ruffle](https://github.com/ruffle-rs/ruffle) | Flash compatibility and behavior preservation | Player source does not license arbitrary games |
| [Infinite Mac](https://github.com/mihaip/infinite-mac) | Historical computing in a browser | Software and disk-image rights separate |
| [DOSBox Staging](https://github.com/dosbox-staging/dosbox-staging) | Reproducible legacy PC environments | No legacy program executed |
| [OpenRA](https://github.com/OpenRA/OpenRA) | Strategy-game orders, replays and visibility | Engine and original game assets have separate rights |

The [microwave-controller simulator](https://github.com/lucaasporto/microwave-oven-simulator)
is a state-machine lead, not evidence that a commercial microwave was decompiled.
Device investigations begin with authorized, inert artifacts and synthetic tests.
No safety interlock bypass, high-voltage work or autonomous heating is included.

## Languages, Engines And Frameworks

Start with the [Node.js events investigation](wiki/javascript-runtimes.md).
The backlog there separates ECMA-262, TypeScript, V8, QuickJS, Deno, Bun,
React, Vue and WebAssembly. These are different layers, not interchangeable names
for JavaScript. Only the selected Node event source is currently analyzed here.

Priorities reflect editorial judgments about useful questions and accessible
evidence, not measured customer demand or an exhaustive GitHub ranking.

[Library home](wiki/index.md) | [Contribute an investigation](CONTRIBUTING.md)
