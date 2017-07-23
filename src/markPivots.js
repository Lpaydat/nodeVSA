const findHits = require("./findHits.js");
let stockData = require("./stockData.js");

function markPivots (daysArray, ticker) {
  // Init pivotHighs and pivotLows arrays if undefined.
  stockData.quotes[ticker]["pivotHighs"] = stockData.quotes[ticker]["pivotHighs"] || [];
  stockData.quotes[ticker]["pivotLows"] = stockData.quotes[ticker]["pivotLows"] || [];

  // Mark pivot Highs
  for (let i = 1; i < daysArray.length; i++) {
    if (daysArray[i+1] === undefined) { // handle most recent day
      if (daysArray[i].h > daysArray[i-1].h) {
        daysArray[i].pivotHigh = true;
        stockData.quotes[ticker]["pivotHighs"].push(daysArray[i]);
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
        stockData.quotes[ticker]["pivotHighs"].push(daysArray[i]);
      }
    }
  }
  // Mark pivot Lows
  for (let i = 1; i < daysArray.length; i++) {
    if (daysArray[i+1] === undefined) { // handle most recent day
      if (daysArray[i].l < daysArray[i-1].l) {
        daysArray[i].pivotLow = true;
        stockData.quotes[ticker]["pivotLows"].push(daysArray[i]);
      }
    } else {
      if (
        // If this day's high is less than the prior day's high
        daysArray[i].l < daysArray[i-1].l &&
        // this day's high is also less than the next day's high,
        daysArray[i].l < daysArray[i+1].l
      ) { // Then today is a pivot low.
        daysArray[i].pivotLow = true;
        stockData.quotes[ticker]["pivotLows"].push(daysArray[i]);
      }
    }
  }

  // Adds hits and hitCount to each ticker day
  findHits(ticker, "long", stockData.quotes[ticker]["pivotLows"]);
  findHits(ticker, "short", stockData.quotes[ticker]["pivotHighs"]);
}

module.exports = markPivots;