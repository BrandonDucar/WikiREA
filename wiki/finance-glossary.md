# Finance Investigation Glossary

| Term | Meaning And Boundary |
| --- | --- |
| Polygon.io / Massive | Market-data provider; distinct from Polygon blockchain. Its client code does not expose the data vendor's server implementation. |
| Polygon blockchain / Bor | Blockchain client and consensus ecosystem; not the financial data vendor. |
| Lightweight Charts | TradingView's public charting library, not the full hosted TradingView product or its paid feature set. |
| Historical correction | A change to an older data point, distinct from appending the newest observation. |
| Conflation | Combining data for efficient representation; the inspected chart rejects explicit historical updates when this mode is enabled. |
| Event Time | Time associated with the market event; units and semantics depend on the event type. |
| Received Time | Time a provider or consumer received an event; not interchangeable with event time. |
| Backfill | Loading missing history after a gap. A connected websocket alone does not prove a complete history. |
| Cursor / next_url | A reference to a further page. Traversal needs request, row and time bounds. |
| Receipt | A record bound to a specific action or block. Existence alone does not prove finality, profit or customer delivery. |
| Reorg | Replacement of a blockchain's canonical history over some range. A receipt needs block identity and a separate finality policy. |
| Read-only Scope | Authorization to obtain data, not authorization to place orders or change an account. |
| Paper Execution | A simulated order/fill process; must remain labeled paper through persistence, charts and replay. |
| Data Entitlement | Permission under the provider's plan to access/use data; an open-source SDK license is not this permission. |
| Replay Clock | The clock used to inspect retained events. It must not silently become the live trading clock. |

Sources and exact inspected versions: [finance first pass](finance-first-pass.md).
