# TradingView, Robinhood And Both Polygons: First Pass

October 18, 2026. Bounded source and documentation inspection, not a product clone.
No user account, exchange endpoint, blockchain node or trade was accessed.

## TradingView

Pinned public repository: [Lightweight Charts at 9db7ce7](https://github.com/tradingview/lightweight-charts/tree/9db7ce733e95303ae1eeb79e664ee9be4ee5e696).
Seven files retained; three TypeScript files submitted to REA 6.4.0. Three parsed,
zero parse failures, 79,563 bytes, 164 analyzer findings. Findings are not bugs.

Source observations:

- [DataLayer.updateSeriesData](https://github.com/tradingview/lightweight-charts/blob/9db7ce733e95303ae1eeb79e664ee9be4ee5e696/src/model/data-layer.ts#L247) separates ordinary updates from historical corrections. An ordinary older-time update is rejected. A historical correction needs an existing time point and cannot use conflation mode.
- [ChartApi](https://github.com/tradingview/lightweight-charts/blob/9db7ce733e95303ae1eeb79e664ee9be4ee5e696/src/api/chart-api.ts#L257) exposes crosshair events and position control. This is a building block for synchronized panels, not proof that we wired them.
- [TimeScale](https://github.com/tradingview/lightweight-charts/blob/9db7ce733e95303ae1eeb79e664ee9be4ee5e696/src/model/time-scale.ts#L878) controls visible ranges. A displayed range is not an event's source timestamp or an execution permission.

DreamNet application, proposed: one synchronized view of chart, evidence, agent
decision and paper order. Preserve source event identity; display historical
corrections distinctly. Test duplicate, delayed and out-of-order bars first.

This is Apache-2.0 code with upstream NOTICE/attribution requirements. It is not
the complete TradingView website, Advanced Charts source, Pine engine, private
indicators or a license for market data. Official [library comparison](https://www.tradingview.com/free-charting-libraries/) distinguishes the products.

## Polygon.io / Massive Market Data

The [official client README](https://github.com/massive-com/client-js) states that
Polygon.io rebranded as Massive.com on October 30, 2025. The old repository link
redirects. Pinned inspection: [e268c09](https://github.com/massive-com/client-js/tree/e268c090f0879720887d172ed0ebff17e9a3f3df).
Ten files retained, seven TypeScript files parsed by REA, zero parse failures,
16,150 bytes, 85 analyzer findings. No client request was executed.

- [main.ts](https://github.com/massive-com/client-js/blob/e268c090f0879720887d172ed0ebff17e9a3f3df/src/main.ts) creates a dedicated Axios instance and optionally follows next_url in a response interceptor. Host validation, request bounds, merge order and cycle handling need focused fixtures before reuse; this pass does not establish them.
- [Websocket transport](https://github.com/massive-com/client-js/blob/e268c090f0879720887d172ed0ebff17e9a3f3df/src/websockets/transport/index.ts) sends authentication on socket-open. That short file contains no reconnect, deduplication or history backfill implementation; dependency and application behavior remain untested.
- [Crypto types](https://github.com/massive-com/client-js/blob/e268c090f0879720887d172ed0ebff17e9a3f3df/src/websockets/crypto/index.ts) describe trade/quote time in milliseconds and FMV time in nanoseconds. These are source type comments, not independently verified feed observations.

DreamNet application, proposed: Market Compiler normalizes event-specific units,
keeps event/receive times separate, detects gaps, enforces pagination/compute
budgets, and redacts credentials from URLs and logs. Keep API access behind a
server-side credential boundary. The generated REST implementation and full
OpenAPI file were outside the one-MiB source-file admission bound.

Client license is MIT. Service plans, exchange entitlements and redistribution
permission are separate and have not been evaluated for our account.

## Polygon Blockchain

Pinned Bor repository: [1cdf43c](https://github.com/0xPolygon/bor/tree/1cdf43c99d97cb9e18860776d8f69a416b49adf4).
Five files retained, including COPYING and COPYING.LESSER. Two Go files manually
read; no REA Go analyzer, node, build or upstream tests were run.

- [Bor receipt code](https://github.com/0xPolygon/bor/blob/1cdf43c99d97cb9e18860776d8f69a416b49adf4/core/types/bor_receipt.go) constructs receipt identity from block number and block hash and fills block/transaction/log fields.
- [Finality wrapper](https://github.com/0xPolygon/bor/blob/1cdf43c99d97cb9e18860776d8f69a416b49adf4/eth/downloader/whitelist/finality.go) tracks checkpoint/milestone number and hash and persists them. Detailed chain validation is delegated outside this selected file, so full reorg/finality correctness is not established.

DreamNet application, proposed: distinguish observed, included, confirmed,
finalized and invalidated chain evidence. Preserve block hash and allow
requalification if canonical history changes. This does not enable a wallet.

The separate [CDK repository](https://github.com/0xPolygon/cdk) was marked archived
in the GitHub API snapshot. Do not treat it as the current active implementation
without following its successor guidance. Bor has component-specific LGPL/GPL
notices; reusing its code needs a precise file-level review.

## Robinhood

Only [official Crypto API documentation](https://robinhood.com/us/en/support/articles/crypto-api/)
was reviewed. It describes permission-scoped market/account reads and crypto
orders. This is not a decompilation of Robinhood, a complete architecture map,
or evidence of an official equities/options automation API.

First useful investigation: public quote/watchlist/order-state behavior and how
permissions distinguish observation from execution. Build any learning demo
with synthetic positions, explicit simulated fills and our own presentation.
Authenticated behavior needs separately scoped account access; no credentials
were requested or read for this pass.

## Combined Design Hypothesis

Market Compiler -> timestamped evidence -> Jaggy paper decision -> existing paper
receipt -> Trade Invader synchronized chart/replay. Blockchain receipts are an
additional evidence stream, not the market-data provider. Fish/MiroDream branches
can compare scenarios against held-out data, not treat scenarios as observations.

These are integration candidates, not new production wiring. Acceptance requires
synthetic transport fixtures, chart browser tests, paper receipt replay,
entitlement checks and explicit human authority boundaries.

The market-source receipts are indexed in [library.json](../library.json).
The Go collection remains separate because its inspection stage is different.
See [glossary](finance-glossary.md) and [target shortlist](../TARGETS.md).
