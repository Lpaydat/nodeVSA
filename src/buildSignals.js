let stockData = require("./stockData.js");

// Builds our signals objects, so we can search through them and write them to screen/disk.
// Call this with the pivotLows array for a particular ticker to generate long signals.
function buildSignals (direction, pivots, ticker) {
  // Init signals array if undefined.
  stockData.allSignals = stockData.allSignals || [];

  // Find supply tests (long).
  for (let i = 1; i < pivots.length; i++) { // Start @ 1 because else comparison gets undef.
    if (
        // pivots[i].recentHitsCount > 0
        pivots[i].priorHitsCount > 0
    ) {
      // Build a new signal object...
        let currentSignal = {
          date: pivots[i].date.split(' ')[0], // Removes the random timestamp.
          symbol: ticker,
          trade: direction,
          priorHits: pivots[i].priorHits,
          priorHitsCount: pivots[i].priorHitsCount,
          recentHits: pivots[i].recentHits,
          recentHitsCount: pivots[i].recentHitsCount,
          recentHitsOnLowerVolumeCount: pivots[i].recentHitsOnLowerVolumeCount,
          data: pivots[i]
        };
        // ...and add signal object to our signals array.
        stockData.allSignals.push(currentSignal);
      }
  }
}

module.exports = buildSignals;
