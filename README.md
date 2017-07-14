# nodeVSA

None of my stock trading software does exactly what I want it to, so I figured I'd just build a tool.

nodeVSA retrieves stock data for a list of your tickers, cleans and transforms it, and scans for pivots that have prior pivots within range.

## Overview

In stock trading, "support" and "resistance" refer to price levels that represent invisible floors and ceilings.

The stock price tends to resist falling below a support level, or rising above a resistance level.

You can detect the strength of a support/resistance level by observing how many unsuccessful attempts are made to break through it. 

You can also detect when buying or selling pressure has been depleted based on what happens to the trading volume as the price revisits that level. If a stock price revisits an support/resistance level but on lower volume each time, this can signal that the stock is ready to change directions.

A pivot is a day that has an outlier high or low. nodeVSA detects pivot highs/lows, and then compares them to the stock's behavior every time it made a pivot at that level in the past.

## Installation:

Run `git clone https://github.com/wnmurphy/nodeVSA.git`

Run `npm install` to install dependencies.

Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key) and get an API key.

Create a `config.js` file with `module.exports = { API_KEY : YOUR_API_KEY};`

Add your own stock tickers to `stockList.js`.

Run `node nodeVSA`.

## Filtering Results

You can add search criteria via command line argument:

  `node nodeVSA {search criteria as a string}`

The available search critera are:

- `signal.date`: `'YYYY-MM-YY'`
- `signal.trade`: `'long' | 'short'`
- `signal.symbol`: `'TSLA'`, etc.
- `signal.hitsCount`: `> 0`, etc.
- `signal.recentHitsCount: `> 0`, etc.

For example, to show only results for long trades for Apple (AAPL), run:

  `node nodeVSA "signal.trade === 'long' && signal.symbol === 'AAPL'"`

`hitsCount` is the number of prior pivots in the data set within 0.3% (three-tenths of a percent) of a pivot.

`recentHitsCount` is the number of hits within the last 10 days, which are more relevant.

The signal object looks like:
```
{
  date: "06-25-17",
  symbol: "AAPL",
  hitsCount: 2,
  hits: [{}, {}],
  recentHitsCount: 1,
  recentHits: [{}],
  direction: "short"
}
```

The signal object also exposes data for the trading day these hits were generated: `signal.hits` and `signal.recentHits` are arrays of trading day objects.


A trading day object looks like:
```
{
   date : "2017-03-09",
   h : 9.59,
   l : 9.27,
   c : 9.46,
   v : 2931317,
   pivotHigh : true,
   pivotLow : false,
   hits: [{}],
   hitsCount: 1
 }
```