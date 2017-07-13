let stockData = require("./stockData.js");

// Used in findDemandTests and findSupplyTests.
// Pass in the ticker, trade direction (sup/res) as string, and signal object in progress.
// Counts priot pivot highs/lows within range, and stores them in an array on signal object.
function calculateSupportOrResistance (ticker, supportOrResistance, pivotsArr) {
  if (supportOrResistance === "support") {
    var pivot = "l";
  } else if (supportOrResistance === "resistance") {
    var pivot = "h"; 
  } else {
    return console.error("Must specify 'support' or 'resistance'.");
  }

  // For each day of pivot data i in stockData.quotes[ticker][pivotArr]
  for (let i = 0; i < pivotsArr.length; i++) {
    
    pivotsArr[i].hits = [];
    pivotsArr[i].recentHits = [];

    let threshold = 0.003;
    let p = pivotsArr[i][pivot];
    let range = [
      p - (p * threshold),
      p + (p * threshold),
    ];
    let dayRange = 5;

    // For each pivot j until this pivot i
    for (let j = 0; j < i; j++) {
      // If pivot on day j is within range of pivot on day i...
      if (
        (pivotsArr[j][pivot] >= range[0]) &&
        (pivotsArr[j][pivot] <= range[1])
      ) {
        // Store array with pivot.
        pivotsArr[i].hits.push(pivotsArr[j]);
        pivotsArr[i].hitsCount = pivotsArr[i].hits.length;
        // Capture more recent hits.
        if (i-j < dayRange) {
          pivotsArr[i].recentHits.push(pivotsArr[j]);
          pivotsArr[i].recentHitsCount = pivotsArr[i].recentHits.length;
        }
      }
    }

    // # Debugging    
    // console.log("\n\n\n## current pivot day: " + pivotsArr[i].date);
    // console.log("\n## range from: " + range[0] + " to " + range[1] + ".");
    // console.log("\n## pivotsArr[i].hits", pivotsArr[i].hits);

  }
}

module.exports = calculateSupportOrResistance;