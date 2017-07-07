let stockData = require("./stockData.js");

function findSupplyTests (pivots, ticker) {
  // Init signals array if undefined.
  stockData.allSignals = stockData.allSignals || [];

  // Find supply tests (long).
  for (let i = 1; i < pivots.length; i++) {
    // if previous pivot's volume is greater than current pivot's volume, and 
    // the previous pivot's low is less than current pivot's low
    if (
    // If previous pivot's v is greater than current pivot's v, and 
        pivots[i-1].v > pivots[i].v &&
    // the previous pivot's l is less than current pivot's l, and
        pivots[i-1].l < pivots[i].l &&
    // current pivot's low is less than previous pivot's high...
        pivots[i].l < pivots[i-1].h
    ) {
      // Build a new signal object...
        let currentSignal = {
          date: pivots[i].date.split(' ')[0], // Removes the random timestamp.
          symbol: ticker,
          trade: "long"
        };
      // ...and add it to our signals array.
        stockData.allSignals.push(currentSignal);
      }
  }
}

module.exports = findSupplyTests;
