let data = require("./stockData.js");

function markPivots (daysArray, ticker) {
  // Init storage arrays for pivots if undefined.
  data.quotes[ticker]["pivotHighs"] = data.quotes[ticker]["pivotHighs"] || [];
  data.quotes[ticker]["pivotLows"] = data.quotes[ticker]["pivotLows"] || [];

  // Mark pivot highs.
  for (let i = 1; i < daysArray.length; i++) {
    if (daysArray[i+1] === undefined) { // Mark most recent day as pivot high.
      if (daysArray[i].h > daysArray[i-1].h) {
        daysArray[i].pivotHigh = true;
        data.quotes[ticker]["pivotHighs"].push(daysArray[i]);
      }
    } else { // Mark all days with a pivot high and add to storage array.
      if (daysArray[i].h > daysArray[i-1].h && daysArray[i].h > daysArray[i+1].h) {
        daysArray[i].pivotHigh = true;
        data.quotes[ticker]["pivotHighs"].push(daysArray[i]);
      }
    }
  }

  // Mark pivot lows.
  for (let i = 1; i < daysArray.length; i++) {
    if (daysArray[i+1] === undefined) { // Mark most recent day as pivot low.
      if (daysArray[i].l < daysArray[i-1].l) {
        daysArray[i].pivotLow = true;
        data.quotes[ticker]["pivotLows"].push(daysArray[i]);
      }
    } else { // Mark all days with a pivot high and add to storage array.
      if (daysArray[i].l < daysArray[i-1].l && daysArray[i].l < daysArray[i+1].l) { 
        daysArray[i].pivotLow = true;
        data.quotes[ticker]["pivotLows"].push(daysArray[i]);
      }
    }
  }
}

module.exports = markPivots;
