const CONFIG = require("../config.js")
const RP = require("request-promise");
const TRANSFORM_DATA = require("./transformData.js");
const MARK_PIVOTS = require("./markPivots.js");
const FIND_HITS = require("./findHits.js");
const BUILD_SIGNALS = require("./buildSignals.js");
const LOG = console.log;
let data = require("./stockData.js");

// Requests data for one stock ticker with a promise.
let fetchDataForOneStock = (ticker) => new Promise((resolve, reject) => {
  
  LOG("Getting: ", "\x1b[34m", ticker, "\x1b[0m");

  RP({ // Request data for this stock.
    uri: "https://www.alphavantage.co/query",
    json: true,
    qs: {
      apikey: CONFIG.API_KEY,
      function: "TIME_SERIES_DAILY",
      symbol: ticker
    },
    transform: TRANSFORM_DATA // Clean raw data.
  })
  .then((transformedData) => { // Store clean data for this stock.
    data.quotes[ticker] = {};
    data.quotes[ticker]["data"] = transformedData;
  })
  .then(() => { // Mark pivot highs and lows.
    MARK_PIVOTS(data.quotes[ticker]["data"], ticker);
  })
  .then(() => { // Scan each pivot for prior pivots in range, decreasing volume, absorption volume, etc.
    FIND_HITS(ticker, "long", data.quotes[ticker]["pivotLows"]);
    FIND_HITS(ticker, "short", data.quotes[ticker]["pivotHighs"]);
  })
  .then(() => { // Build our buy/sell signal objects.
    BUILD_SIGNALS("long", data.quotes[ticker]["pivotLows"], ticker);
    BUILD_SIGNALS("short", data.quotes[ticker]["pivotHighs"], ticker);
    LOG("Got: ", "\x1b[34m", ticker, "\x1b[0m");
    resolve();
  })
  .catch((err) => { // Tell user if something went wrong.
    LOG("\n" + "\x1b[31m" + "Ticker: " + ticker + "\n" + "Error: " + "\x1b[0m" + "\n" + err);
    // Add ticker to retry list.
    data.retryTickers.push(ticker);
    reject(err);
  })
}); 

module.exports = fetchDataForOneStock;
