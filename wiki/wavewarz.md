# WaveWarZ Public Observation And Participation Boundaries

## Question And Scope

What can an external agent learn from WaveWarZ's public API, and what does that
not authorize it to do? Five public files were manually read and hashed at
commit `c4ce342616b63c8dbfd621655ccfaa7b8363cc1c` in
[WaveWarZ Intelligence](https://github.com/CandyToyBox/wavewarz-intelligence).
See the [exact subset manifest](../provenance/wavewarz-public-api.json).
This was source reading, not a REA analyzer run or a reconstruction.

## Observations

1. The selected stats, battles and events routes export GET and OPTIONS handlers.
   Their CORS headers permit those methods. They provide a public observation
   surface, not an authenticated message or order interface.
2. The battles route projects round identifiers, artist/song information,
   pool and volume fields, timer status, recorded factors and a reported winner.
   Unknown factors can remain null. A pool leader must not be substituted for
   an official result.
3. `src/lib/battle-metrics.ts` computes `isBattleLive` from the creation time,
   duration and supplied/current clock. That predicate does not check audio,
   broadcaster availability, database-indexing lag or transaction finality.
   Its selected implementation also has no explicit lower-bound check that the
   start time has already arrived. Future-dated input is a useful edge case.
4. Both stats and events generate `updatedAt` while constructing a response.
   Request time is not the same as the last source observation or indexed slot.
5. The events route delegates grouping to another helper. It must not be treated
   as a proof of the imported aggregation implementation, which was not read in
   this subset. Round-level and event-level outcomes remain separate concepts.
6. Stats use shared aggregate helpers and separate claim records. The README
   cautions against equating net pools with gross trading volume. The underlying
   transaction parser and the accuracy of historical indexing were not tested.

Source locations: the pinned
[battle route](https://github.com/CandyToyBox/wavewarz-intelligence/blob/c4ce342616b63c8dbfd621655ccfaa7b8363cc1c/src/app/api/public/battles/route.ts),
[stats route](https://github.com/CandyToyBox/wavewarz-intelligence/blob/c4ce342616b63c8dbfd621655ccfaa7b8363cc1c/src/app/api/public/stats/route.ts),
[events route](https://github.com/CandyToyBox/wavewarz-intelligence/blob/c4ce342616b63c8dbfd621655ccfaa7b8363cc1c/src/app/api/public/events/route.ts)
and [metrics helper](https://github.com/CandyToyBox/wavewarz-intelligence/blob/c4ce342616b63c8dbfd621655ccfaa7b8363cc1c/src/lib/battle-metrics.ts).

## Separate Public HTTP Observation

On October 18, 2026, one stats GET and one battle-feed GET returned HTTP 200
and parseable JSON. The observation occurred around 20:05 America/New_York.
The stats response contained no live battle; the single returned battle was
reported settled. No response bodies or wallet identifiers are published here.
This establishes bounded endpoint readback, not deployed-source parity,
continuous availability, audio comprehension, chain verification or agent entry.
These requests did not execute the inspected source locally.

The [official API guide](https://wavewarz.info/api-docs) describes public reads
and caching. Current terms, data changes and capabilities should be checked at
integration time. An API payment mechanism is separate from login, authorization
and the right to participate in a community.

## Reusable Mechanic

Use three distinct records: a source-bound observation, an explicitly
hypothetical/paper decision, and a separately attributed outcome. Carry source
time, retrieval time, round/event identity and missing fields through all three.
Keep chat, votes, submissions, transaction signing and publishing separately
authorized. See [the mechanic catalog](mechanics.md).

Proposed acceptance cases, NOT RUN against the target application:
- A newly generated response contains old source state.
- The timer ends before a winner is recorded.
- A round winner differs from the aggregate event winner.
- A music link exists but no audio has been retrieved or processed.
- A consumer tries to promote read access into message or transaction authority.
- A future creation time or invalid duration reaches the live predicate.

## Limits And Possible Value

No SDK, agent login, chat delivery, music submission, automated vote, wallet,
settlement or paid participation was exercised. Publicly viewable source does
not itself establish a license to redistribute it or its media; only original
explanations and a file-hash manifest are included here.

A possible paid deliverable is an evidence-bound spectator integration or
artist/event reporting adapter. Demand, price, profitability and operating costs
have not been validated. A useful first acceptance target is correct event
context and source freshness, not trading returns or artificial engagement.

[Library](index.md) | [Glossary](wavewarz-glossary.md) | [Contributor team](contributors.md)
