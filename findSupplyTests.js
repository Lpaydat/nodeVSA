let stockData = require("./stockData.js");

// Call this with the pivotLows array for a particular ticker to generate long signals.
function findSupplyTests (pivots, ticker) {
  // Init signals array if undefined.
  stockData.allSignals = stockData.allSignals || [];

  // Find supply tests (long).
  for (let i = 1; i < pivots.length; i++) { // Start @ 1 because else comparison gets undef.
    if (

    // # Original scan: greater volume than previous pivot.
    // // If previous pivot's v is greater than current pivot's v, and 
    //     pivots[i-1].v > pivots[i].v &&
    // // the previous pivot's l is less than current pivot's l, and
    //     pivots[i-1].l < pivots[i].l &&
    // // current pivot's low is less than previous pivot's high...
    //     pivots[i].l < pivots[i-1].h
        pivots[i].hitsCount > 2
    ) {
      // Build a new signal object...
        let currentSignal = {
          date: pivots[i].date.split(' ')[0], // Removes the random timestamp.
          symbol: ticker,
          trade: "long",
          hits: pivots[i].hits,
          hitsCount: pivots[i].hitsCount
        };
        // ...and add signal object to our signals array.
        stockData.allSignals.push(currentSignal);
      }
  }
}

module.exports = findSupplyTests;
