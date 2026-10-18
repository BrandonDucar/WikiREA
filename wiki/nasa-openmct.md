# NASA Open MCT: Mission Time And Telemetry Providers

**Status:** selected source statically analyzed; no target runtime or mission-control deployment tested.

## Question And Source

How does a mission-control framework separate historical viewing, real-time
clocks and per-view temporal context?

[Pinned source](https://github.com/nasa/openmct/tree/e09bfaf47856b2b7ae2ea74334800b26fd27a41e):
`e09bfaf47856b2b7ae2ea74334800b26fd27a41e`.
[Manifest](../provenance/nasa-openmct.json)
contains six selected files. [REA result](../provenance/nasa-openmct.json):
three JS files parsed, zero parse failures, 58,993 bytes read and 31 analyzer
findings. One selected file is an upstream test: parsed, not executed.

## What The Code Shows

[TimeAPI](https://github.com/nasa/openmct/blob/e09bfaf47856b2b7ae2ea74334800b26fd27a41e/src/api/time/TimeAPI.js)
registers time systems and clocks separately. Numeric time values acquire meaning
from their time system; registration itself is not a unit conversion. Independent
contexts let a view use its own fixed bounds or real-time clock offsets. Context
selection follows the domain-object path, with a global context as the fallback.

[TelemetryAPI](https://github.com/nasa/openmct/blob/e09bfaf47856b2b7ae2ea74334800b26fd27a41e/src/api/telemetry/TelemetryAPI.js)
registers providers for historical request and subscription capabilities. A source
that can answer history requests is not automatically a live subscriber. Provider
selection and a returned value do not establish freshness, completeness or delivery
to our system; those need bounded observations and tests.

## Reusable Behaviors

- Separate event time, display bounds and the clock driving those bounds.
- Let a historical panel remain historical while another panel follows live time.
- Declare history and subscription capabilities separately, then test both.

Candidate use: an evidence-backed operational dashboard with a single mission
timeline, explicit per-panel time context and visible gaps. No NASA partnership,
endorsement or DreamNet integration is claimed.

## Verification Still Needed

Test incompatible time systems, invalid object paths, context removal, clock
changes, unsubscribing, provider failures and stale history. Imports and dependency
behavior outside the selected files are not covered. Browser behavior, upstream
tests, spacecraft systems and deployment infrastructure were not executed.

The selected license notice states Apache-2.0 and points to additional dependency
notices. Source availability is not permission to use NASA marks as endorsement.
Refresh when time/telemetry contracts or dependencies change.

Related: [operations glossary](operations-glossary.md), [TradingView](finance-first-pass.md#tradingview),
[bounded replay](mechanics.md), [library home](index.md).
