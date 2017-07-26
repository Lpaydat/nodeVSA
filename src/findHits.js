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
    pivotsArr[i].allRecentHitsDecreasing = false;
    pivotsArr[i].belowAvgVol = false;

    // Calculate hit threshold.
    let threshold = 0.003;
    let p = pivotsArr[i][pivot];
    let range = [
      p - (p * threshold),
      p + (p * threshold),
    ];


    // Calculate lookback period to find each pivot's recent prior hits.
    // Date calculation below is base 10, lookback is one month (100), which is "20170701" - "20170601".
    // TODO: this is going to break every January, until February.
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


          // If the volume is Decreasing on any of the prior recent pivots, add to recentHitsOnGreaterVolume.
          if (pivotsArr[j]["v"] > pivotsArr[i]["v"]) {
            pivotsArr[i].recentHitsOnGreaterVolume.push(pivotsArr[j]);
            pivotsArr[i].recentHitsOnGreaterVolumeCount = pivotsArr[i].recentHitsOnGreaterVolume.length;
          }
        }
      }
    }

    // # DEBUG:
    // console.log("\n\n\n## current pivot day: " + pivotsArr[i].date);
    // console.log("\n## range from: " + range[0] + " to " + range[1] + ".");
    // console.log("\n## pivotsArr[i].hits", pivotsArr[i].hits);



    // Determine if any recent hit shows absorption volume.
    for (let k = 0; k < pivotsArr[i].recentHits.length; k++) {
      // If any of the recent hits have volume greater than X times the average, mark true.
      if (pivotsArr[i].recentHits[k]["v"] > avgVolume * 1.2) {
        pivotsArr[i].absorptionVolume = true;
      }
    }

    
    // Determine if all recent hits are decreasing in volume.
    if (pivotsArr[i].recentHitsOnGreaterVolume.length > 1) {
      let allDecreasingSoFar = false;
      // Set flag if all recentHitsOnGreaterVolume are decreasing.
      for (let l = 1; l < pivotsArr[i].recentHitsOnGreaterVolume.length; l++) {
        if (pivotsArr[i].recentHitsOnGreaterVolume[l]["v"] <= pivotsArr[i].recentHitsOnGreaterVolume[l-1]["v"]) {
          allDecreasingSoFar = true;
        } else {
          allDecreasingSoFar = false;
        }
      }
      pivotsArr[i].allRecentHitsDecreasing = allDecreasingSoFar;
    }


    // Determine if this pivot has below average volume
    if (pivotsArr[i]["v"] < pivotsArr[i]["averageVol"]) {
      pivotsArr[i].belowAvgVol = true;
    }

    console.log(pivotsArr[i]);

  }
}

module.exports = findHits;
