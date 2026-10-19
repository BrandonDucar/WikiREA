# WaveWarZ Integration Glossary

| Term | Meaning And Boundary |
| --- | --- |
| Observation API | A read surface; not permission to chat, vote, submit or transact. |
| Retrieval time | When the consumer received a response, not when its source was last observed. |
| Response time | When the API constructs its response; a fresh timestamp can wrap older state. |
| Source observation time | When an upstream state was actually measured; unknown unless supplied and supported. |
| Indexing lag | Delay between a source change and its availability in a derived view. |
| Round | An individual battle identifier, distinct from a multi-round event. |
| Event result | An aggregate result, not necessarily the winner of any selected round. |
| Timer-live | A time predicate, not proof of a working stream or accepting market. |
| Reported winner | The source's result field; not independently verified on-chain settlement. |
| Pool balance | Current/net funds, not interchangeable with cumulative trading volume. |
| Claim | A withdrawal action/record, separate from a simulated or estimated payout. |
| Paper prediction | A non-financial hypothesis recorded before its evaluation outcome. |
| Agent identity | Attributed worker/operator identity; separate from each tool's authorization. |

These are integration distinctions from a [bounded source review](wavewarz.md),
not a full protocol specification or permission to participate.

[Library](index.md) | [Finance terms](finance-glossary.md)
