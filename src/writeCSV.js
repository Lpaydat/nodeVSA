const FS = require("fs");
const LOG = console.log;

function writeCSV (signalsArray) {
  // Create new file, overwrite existing old results.
  FS.writeFileSync("results.csv", "", "utf8");
  FS.appendFileSync("results.csv", "symbol,date,trade,priorHits,recentHits,recentHitsOnGreaterVolume,absorptionVolume,allRecentHitsDecreasing,belowAvgVol,opolv,close,nextClose\n", "utf8");
  for (let i = 0; i < signalsArray.length; i++) {
    let line = [ 
      signalsArray[i]["symbol"],
      signalsArray[i]["date"],
      signalsArray[i]["trade"],
      signalsArray[i]["priorHitsCount"],
      signalsArray[i]["recentHitsCount"],
      signalsArray[i]["recentHitsOnGreaterVolumeCount"],
      signalsArray[i]["absorptionVolume"],
      signalsArray[i]["allRecentHitsDecreasing"],
      signalsArray[i]["belowAvgVol"],
      signalsArray[i]["outerPivotOnLowerVolume"],
      signalsArray[i]["outerPivotOnLowerVolumeDate"],
      signalsArray[i]["data"]["c"],
      signalsArray[i]["data"]["tomorrowClose"]
    ].join(",")
    FS.appendFile("results.csv", line + "\n", "utf8", (err) => {
      if (err) throw err;
    });
  }
  LOG("\n\nCSV results written to disk."); 
}

module.exports = writeCSV;
