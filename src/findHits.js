let stockData = require("./stockData.js");

// A 'hit' is a pivot within price range of the current pivot.
// Finds all prior hits and stores them in an array on signal object.
// Used in findTests.
// Pass in the ticker, trade direction (sup/res) as string, and signal object in progress.
function findHits (ticker, direction, pivotsArr) {
  if (direction === "long") {
    var pivot = "l";
  } else if (direction === "short") {
    var pivot = "h"; 
  } else {
    return console.error("Must specify 'long' or 'short'.");
  }

  // For each day of pivot data i in stockData.quotes[ticker][pivotArr]
  for (let i = 0; i < pivotsArr.length; i++) {
    
    pivotsArr[i].priorHits = [];
    pivotsArr[i].priorHitsCount = 0;
    pivotsArr[i].recentHits = [];
    pivotsArr[i].recentHitsCount = 0;
    pivotsArr[i].recentHitsOnDecreasingVolume = [];
    pivotsArr[i].recentHitsOnDecreasingVolumeCount = 0;
    pivotsArr[i].absorptionVolume = false;

    let threshold = 0.003;
    let p = pivotsArr[i][pivot];
    let range = [
      p - (p * threshold),
      p + (p * threshold),
    ];
    
    // Calculates lookback period to find each pivot's recent prior hits.
    // Because the date calculation below is base 10, and needs to account for a month turnover, this lookback is one month (100), which is "20170701" - "20170601".
    let dayRange = 100; 

    // For each pivot j until this pivot i
    for (let j = 0; j < i; j++) {
      // If pivot on day j is within range of pivot on day i...
      if (
        (pivotsArr[j][pivot] >= range[0]) &&
        (pivotsArr[j][pivot] <= range[1])
      ) {
        // Store array with pivot.
        pivotsArr[i].priorHits.push(pivotsArr[j]);
        pivotsArr[i].priorHitsCount = pivotsArr[i].priorHits.length;

        // Capture more recent hits.
        // Removes dash from dates, then compares difference to see if most recent pivot is within day range.
        if (( pivotsArr[i]["date"].replace(/-/g, '') - pivotsArr[j]["date"].replace(/-/g, '') ) < dayRange) {
          pivotsArr[i].recentHits.push(pivotsArr[j]);
          pivotsArr[i].recentHitsCount = pivotsArr[i].recentHits.length;

          // If the volume is Decreasing on any of the prior recent pivots, add a recentHitOnDecreasingVolume.
          if (pivotsArr[j]["v"] > pivotsArr[i]["v"]) {
            pivotsArr[i].recentHitsOnDecreasingVolume.push(pivotsArr[j]);
            pivotsArr[i].recentHitsOnDecreasingVolumeCount = pivotsArr[i].recentHitsOnDecreasingVolume.length;
          }
        }
      }
    }

    // # DEBUG:
    // console.log("\n\n\n## current pivot day: " + pivotsArr[i].date);
    // console.log("\n## range from: " + range[0] + " to " + range[1] + ".");
    // console.log("\n## pivotsArr[i].hits", pivotsArr[i].hits);

  }
}

module.exports = findHits;