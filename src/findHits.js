const daysBetween = require("./daysBetween.js");
let data = require("./stockData.js");

// A 'hit' is a pivot near the same price range as the current pivot.
// Finds and stores all prior hits, recent hits, and recent hits on decreasing volume.
// Pass the ticker, trade direction as string, and array of pivots to work on.
function findHits (ticker, direction, pivotsArr) {
  let pivot;
  if (direction === "long") {
    pivot = "l";
  } else if (direction === "short") {
    pivot = "h"; 
  } else {
    return console.error("Must specify 'long' or 'short'.");
  }


  // Calculate average volume over last 14 days.
  // Used to detect absorption volume.
  let avgVolume = data.quotes[ticker].data.map(day => day.v).reduce((a,b)=>{ return a + b;})/data.quotes[ticker].data.length;

  // For each day of pivot data i in data.quotes[ticker][pivotArr]
  for (let i = 0; i < pivotsArr.length; i++) {

    // Init values.
    pivotsArr[i].priorHits = [];
    pivotsArr[i].priorHitsCount = 0;
    pivotsArr[i].recentHits = [];
    pivotsArr[i].recentHitsCount = 0;
    pivotsArr[i].recentHitsOnGreaterVolume = [];
    pivotsArr[i].recentHitsOnGreaterVolumeCount = 0;
    pivotsArr[i].absorptionVolume = false;
    pivotsArr[i].allRecentHitsDecreasing = null;
    pivotsArr[i].belowAvgVol = false;
    pivotsArr[i].outerPivotOnLowerVolume = false;
    pivotsArr[i].date = pivotsArr[i].date.split(' ')[0]; // Removes the random timestamp.

    // Calculate hit threshold.
    let threshold = 0.003;
    let p = pivotsArr[i][pivot];
    let range = [
      p - (p * threshold),
      p + (p * threshold),
    ];


    // Lookback period to find each pivot's recent prior hits.
    let dayRange = 100; 


    // Get prior pivots j within range of current pivot i.
    for (let j = 0; j < i; j++) {
      if (
        (pivotsArr[j][pivot] >= range[0]) &&
        (pivotsArr[j][pivot] <= range[1])
      ) {
        // Store array with pivot.
        pivotsArr[i].priorHits.push(pivotsArr[j]);
        pivotsArr[i].priorHitsCount = pivotsArr[i].priorHits.length;
      }
    }

    // Get prior pivots k within day range of current pivot i.
    for (let k = 0; k < pivotsArr[i].priorHits.length; k++) {
      // Capture more recent hits.
      // Removes dash from dates, then compares difference to check if within range.
      if ( daysBetween(pivotsArr[i].priorHits[k]["date"], pivotsArr[i]["date"]) < dayRange) {
        pivotsArr[i].recentHits.push(pivotsArr[i].priorHits[k]);
        pivotsArr[i].recentHitsCount = pivotsArr[i].recentHits.length;
      }
    }

    // Get all recent hits that have more volume than current pivot.
    for (let l = 0; l < pivotsArr[i].recentHits.length; l++) {
      // If the volume is Decreasing on any of the prior recent pivots, add to recentHitsOnGreaterVolume.
      if (pivotsArr[i].recentHits[l]["v"] > pivotsArr[i]["v"]) {
        pivotsArr[i].recentHitsOnGreaterVolume.push(pivotsArr[i].recentHits[l]);
        pivotsArr[i].recentHitsOnGreaterVolumeCount = pivotsArr[i].recentHitsOnGreaterVolume.length;
      }
    }

    // Determine if any recent hit shows absorption volume.
    for (let m = 0; m < pivotsArr[i].recentHitsOnGreaterVolume.length; m++) {
      // If any of the recent hits have volume greater than X times the average, mark true.
      if (pivotsArr[i].recentHitsOnGreaterVolume[m]["v"] > pivotsArr[i]["averageVol"] * 1.2) {
        pivotsArr[i].absorptionVolume = true;
      }
    }

    
    // Determine if all recent hits are decreasing in volume.
      // Handle when there's more than one recent hit.
    if (pivotsArr[i].recentHitsOnGreaterVolume.length > 1) {
      let allDecreasingSoFar = true;
      // Set flag if all recentHitsOnGreaterVolume are decreasing.
      for (let n = 1; n < pivotsArr[i].recentHitsOnGreaterVolume.length; n++) {
        if (!(pivotsArr[i].recentHitsOnGreaterVolume[n]["v"] <= pivotsArr[i].recentHitsOnGreaterVolume[n-1]["v"] &&
            pivotsArr[i].recentHitsOnGreaterVolume[n]["v"] > pivotsArr[i]["v"])
          ) {
          allDecreasingSoFar = false;
        }
      }
      pivotsArr[i].allRecentHitsDecreasing = allDecreasingSoFar;
      // Handle when there's exactly one recent hit.
    } else if (pivotsArr[i].recentHitsOnGreaterVolume.length === 1) {
      let allDecreasingSoFar = true;
      if (!(pivotsArr[i].recentHitsOnGreaterVolume[0]["v"] > pivotsArr[i]["v"])) {
        allDecreasingSoFar = false;
      }
      pivotsArr[i].allRecentHitsDecreasing = allDecreasingSoFar;
    }


    // Determine if this current pivot has below average volume.
    if (pivotsArr[i]["v"] < pivotsArr[i]["averageVol"]) {
      pivotsArr[i].belowAvgVol = true;
    }

    // Determine if current pivot is an outer pivot on lower volume.
    let len = pivotsArr[i].recentHits.length;
    if (len) {
      // console.log("current pivot:", pivotsArr[i]);
      // console.log("prior pivot:", pivotsArr[i].recentHits[len-1]);
      if (direction === "long") {
        if ( (pivotsArr[i]["l"] < pivotsArr[i].recentHits[len-1]["l"]) && 
             (pivotsArr[i]["v"] < pivotsArr[i].recentHits[len-1]["v"])
          ) {
          // console.log("this pivot:", pivotsArr[i]["date"]);
          // console.log("current low:", pivotsArr[i]["l"]);
          // console.log("current volume:", pivotsArr[i]["v"]);
          // console.log("most recent pivot:", pivotsArr[i].recentHits[len-1]["date"]);
          // console.log("most recent pivot's volume:", pivotsArr[i].recentHits[len-1]["v"]);
          // console.log("most recent pivot's low:", pivotsArr[i].recentHits[len-1]["l"]);
          pivotsArr[i].outerPivotOnLowerVolume = true;
          pivotsArr[i].outerPivotOnLowerVolumeDate = pivotsArr[i].recentHits[len-1]["date"];
        }
      } else if (direction === "short") {
        if ( (pivotsArr[i]["h"] > pivotsArr[i].recentHits[len-1]["h"]) && 
             (pivotsArr[i]["v"] < pivotsArr[i].recentHits[len-1]["v"])
          ) {
          // console.log("this pivot:", pivotsArr[i]["date"]);
          // console.log("current high:", pivotsArr[i]["h"]);
          // console.log("current volume:", pivotsArr[i]["v"]);
          // console.log("most recent pivot:", pivotsArr[i].recentHits[len-1]["date"]);
          // console.log("most recent pivot's volume:", pivotsArr[i].recentHits[len-1]["v"]);
          // console.log("most recent pivot's high:", pivotsArr[i].recentHits[len-1]["h"]);
          pivotsArr[i].outerPivotOnLowerVolume = true;
          pivotsArr[i].outerPivotOnLowerVolumeDate = pivotsArr[i].recentHits[len-1]["date"];
        }
      }
    }

    // console.log(pivotsArr[i]);
  }
}

module.exports = findHits;
