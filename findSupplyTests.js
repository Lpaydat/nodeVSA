let stockData = require("./stockData.js");

function findSupplyTests (pivots, ticker) {
  // Init signals array if undefined.
  stockData.allSignals = stockData.allSignals || [];

  // Find supply tests (long).
  for (let i = 1; i < pivots.length; i++) { // Start @ 1 because else comparison gets undef.
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


/* 

Here's the issue:

In this file, we're already iterating over the array of pivots.
We call calculateSupportOrResistance from within a conditional; it only fires if we have a pivot on less volume than the immediately prior pivot.

It's only building a new signal object when it finds a pivot with lower volume than the very last one. This is probably why it only finds 12 signals for GPRO.

I need to decide if I want to:
  - compare pivot to volume of prior pivot, or
  - collect a # of hits at the price range for each pivot.


Solution:
  When marking pivots, also calculateSupportOrResistance.
  Store pivots as days, with additional properties hits and hitCount.
  When we build a signal object above, we can simply assign hits and hitsCount from the pivot object.
  Then, we can keep the signals array, and add the additional information of signal strength.
*/