const CONFIG = require("../config.js")
const RP = require("request-promise");
const transformData = require("./transformData.js");
const markPivots = require("./markPivots.js");
const buildSignals = require("./buildSignals.js");
let stockData = require("./stockData.js");

// Requests data for one stock ticker with a promise.
let fetchDataForOneStock = (ticker) => new Promise((resolve, reject) => {

  console.log("Getting data for: ", "\x1b[34m", ticker, "\x1b[0m");
  RP({
    uri: "https://www.alphavantage.co/query",
    json: true,
    qs: {
      apikey: CONFIG.API_KEY,
      function: "TIME_SERIES_DAILY",
      symbol: ticker
    },
    transform: transformData
  })
  // Add our transformed data to a container in storage.
  .then((data) => {
    // Initialize a new container for this stock.
    stockData.quotes[ticker] = {};
    stockData.quotes[ticker]["data"] = data;
  })
  // Mark pivots.
  .then(() => {
    markPivots(stockData.quotes[ticker]["data"], ticker);
  })
  .then(() => {
    // Scan for tests.
    buildSignals("long", stockData.quotes[ticker]["pivotLows"], ticker);
    buildSignals("short", stockData.quotes[ticker]["pivotHighs"], ticker);
    console.log("Got data for: ", "\x1b[34m", ticker, "\x1b[0m");
    resolve();
  })
  .catch((err) => {
    console.error("\n" + "\x1b[31m" + "Ticker: " + ticker + "\n" + "Error: " + "\x1b[0m" + "\n" + err);
    reject(err);
  })
}); 

module.exports = fetchDataForOneStock;
