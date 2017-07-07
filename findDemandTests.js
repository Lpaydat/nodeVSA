let stockData = require("./stockData.js");

function findDemandTests (pivots, ticker) {
  // Init signals array if undefined.
  stockData.allSignals = stockData.allSignals || [];

  // Find demand tests (short).
  for (let i = 1; i < pivots.length; i++) {
    if (
    // If previous pivot's v is greater than current pivot's v, and 
        pivots[i-1].v > pivots[i].v &&
    // the previous pivot's h is greater than current pivot's h, and
        pivots[i-1].h > pivots[i].h &&
    // current pivot's high is greater than previous pivot's low...
        pivots[i].h > pivots[i-1].l
    ) {
    // Build a new signal object...
      let currentSignal = {
        date: pivots[i].date.split(' ')[0], // Removes the random timestamp.
        symbol: ticker,
        trade: "short"
      };
    // ...and add it to our signals array.
      stockData.allSignals.push(currentSignal);
    }
  }
}


module.exports = findDemandTests;
