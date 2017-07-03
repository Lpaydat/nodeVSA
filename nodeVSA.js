/*
  Goal: Create a a node.js script I can run at 12:30pm to find setups.
  
  The setup is basically what Volume Spread Analysis (VSA) calls a supply test.
  
  In English:
    1. Find a pivot low.
    2. Draw a line from the low to the left.
    3. The line should skip at least 1 day.
    4. If the line hits the range of a lower pivot low with higher volume, watch.
    5. When the price exits the current channel, buy.

  The data set below is perfect for an MVP, because it contains two setups.
    2017-06-13: short setup
    2017-06-21: long setup

  See http://imgur.com/SHCYUgV for a chart of these two setups.

  Data from alphavantage.co's API @ https://www.alphavantage.co/documentation/

  Example URLs with query:
    "https://www.alphavantage.co/query?function=HT_PHASOR&symbol=MSFT&interval=weekly&series_type=close&apikey=demo"
    "https://www.alphavantage.co/query?&symbol=MSFT&interval=weekly&apikey=demo"

  Alpha Vantage requests a call frequency limit of < 200/minute.
  A batch of ~400 calls results in 503 Service Unavailable responses.
*/

let rp = require("request-promise");
let stockData = {};
let myTickerList = require("./stockList.js");
let CONFIG = require("./config.js")

let getStockData = (ticker) => {

  console.log("Getting data for: ", "\x1b[34m", ticker, "\x1b[0m");

  rp({
    uri: "https://www.alphavantage.co/query",
    json: true,
    qs: {
      apikey: CONFIG.API_KEY,
      function: "TIME_SERIES_DAILY",
      symbol: ticker
    },
    transform: transformData
  })
    .then((data) => {
      // Initialize a new container for this stock...
      stockData[ticker] = {};
      // Format our data and add to the container...
      // stockData[ticker]["data"] = transformData(data);
      stockData[ticker]["data"] = data;

    })
    .then(() => {
      // Mark our pivot highs and lows...
      markPivots(stockData[ticker]["data"], ticker);
    })
    .then(() => {
      // Scan for supply tests...
      findSupplyTests(stockData[ticker]["pivotLows"], ticker)
      // Scan for demand tests...
      findDemandTests(stockData[ticker]["pivotHighs"], ticker)
      // Notify the user we're done for this ticker.
      dataHasLoaded(ticker);
    })
    .catch((err) => {
      console.error("## Ticker:", ticker, "\n## Error:", err);
    })
};


// Takes array of stock symbols as strings and fetches data for each.
// Adds rate-limiting per data source's request.
// ~200 requests per minute; let's call it 195.
// (60,000 ms/minute)/195 requests = 307ms per request.
function fetchAndTransformDataForAllStocks(arrayOfStockTickers) {
  for (let i = 0; i < arrayOfStockTickers.length; i++) {
    setTimeout(getStockData.bind(null, arrayOfStockTickers[i]), i*307);
  }
};


// Takes a parsed JSON object, and transforms it.
// (Passed as the 'transform' option to request-promise.)
function transformData (stock) {
  let transformed = [];
  let timeSeries = stock["Time Series (Daily)"];
  for (let date in timeSeries) {
    let dayOfData = {};
    dayOfData.date = date;
    dayOfData.h = parseFloat(timeSeries[date]["2. high"]);
    dayOfData.l = parseFloat(timeSeries[date]["3. low"]);
    dayOfData.c = parseFloat(timeSeries[date]["4. close"]);
    dayOfData.v = parseFloat(timeSeries[date]["5. volume"]);
    dayOfData.pivotHigh = false;
    dayOfData.pivotLow = false;
    transformed.push(dayOfData); }
  // Reverse array, so most recent day is at last index.
  return transformed.reverse();
}


function markPivots (daysArray, ticker) {
  // Init pivotHighs and pivotLows arrays if undefined.
  stockData[ticker]["pivotHighs"] = stockData[ticker]["pivotHighs"] || [];
  stockData[ticker]["pivotLows"] = stockData[ticker]["pivotLows"] || [];

  // Mark pivot Highs
  for (let i = 1; i < daysArray.length; i++) {
    if (daysArray[i+1] === undefined) { // handle most recent day
      if (daysArray[i].h > daysArray[i-1].h) {
        daysArray[i].pivotHigh = true;
        stockData[ticker]["pivotHighs"].push(daysArray[i]);
      }
    } else {
      if (
        // If this day's high is greater than the prior day's high
        daysArray[i].h > daysArray[i-1].h &&
        // this day's high is also greater than the next day's high,
        daysArray[i].h > daysArray[i+1].h
      ) {
        // Then today is a pivot high.
        daysArray[i].pivotHigh = true;
        stockData[ticker]["pivotHighs"].push(daysArray[i]);
      }
    }
  }
  // Mark pivot Lows
  for (let i = 1; i < daysArray.length; i++) {
    if (daysArray[i+1] === undefined) { // handle most recent day
      if (daysArray[i].l < daysArray[i-1].l) {
        daysArray[i].pivotLow = true;
        stockData[ticker]["pivotLows"].push(daysArray[i]);
      }
    } else {
      if (
        // If this day's high is less than the prior day's high
        daysArray[i].l < daysArray[i-1].l &&
        // this day's high is also less than the next day's high,
        daysArray[i].l < daysArray[i+1].l
      ) { // Then today is a pivot low.
        daysArray[i].pivotLow = true;
        stockData[ticker]["pivotLows"].push(daysArray[i]);
      }
    }
  }
}


function findSupplyTests (pivots, ticker) {
  // Init supplyTests arrays if undefined.
  stockData[ticker]["supplyTests"] = stockData[ticker]["supplyTests"] || [];

  // Find supply tests.
  for (let i = 1; i < pivots.length; i++) {
    // if previous pivot's volume is greater than current pivot's volume, and 
    // the previous pivot's low is less than current pivot's low
    if (
        pivots[i-1].v > pivots[i].v &&
        pivots[i-1].l < pivots[i].l &&
        // current pivot's low is less than previous pivot's high
        pivots[i].l < pivots[i-1].h
       ) {
      stockData[ticker]["supplyTests"].push(pivots[i]);
    }
  }
}


function findDemandTests (pivots, ticker) {
  // Init demandTests arrays if undefined.
  stockData[ticker]["demandTests"] = stockData[ticker]["demandTests"] || [];

  // Find supply tests.
  for (let i = 1; i < pivots.length; i++) {
    // if previous pivot's volume is greater than current pivot's volume, and 
    // the previous pivot's high is greater than current pivot's high
    if (
        pivots[i-1].v > pivots[i].v &&
        pivots[i-1].h > pivots[i].h &&
        // current pivot's high is greater than previous pivot's low
        pivots[i].h > pivots[i-1].l
       ) {
      stockData[ticker]["demandTests"].push(pivots[i]);
    }
  }
}


// Notifies user when one stock's data has finished loading into memory.
function dataHasLoaded (ticker) {
  let st = stockData[ticker]["supplyTests"];
  // Show most recent supply test
  console.log("long", ticker, st[st.length-1].date);
  
  let dt = stockData[ticker]["demandTests"];
  // Show most recent supply test
  console.log("short", ticker, dt[dt.length-1].date);
};

fetchAndTransformDataForAllStocks(myTickerList);
// getStockData("A");

/*

  TODO:
  
  Promisify helper functions, so we can:
    - do interesting things once all of the stock data has fully loaded.
    - sort the date in different ways instead of by stock.
  
  Find a better way to detect if pivot is within the range of any prior pivot. 
    Add percentage multiplier limit?
  
  Search all prior pivots for a stock to grab any within X percent of current pivot price.

  Store supply/demand test signals in a single object for sorting; stockData.signals
*/
