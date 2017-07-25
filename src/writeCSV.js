const FS = require("fs");

function writeCSV (signalsArray) {
  // Create new file, overwrite existing old results.
  FS.writeFileSync("results.csv", "", "utf8");
  FS.appendFileSync("results.csv", "symbol,date,trade,priorHits,recentHits,recentHitsOnDecreasingVolume,absorptionVolume\n", "utf8");
  for (let i = 0; i < signalsArray.length; i++) {
    let line = [ 
      signalsArray[i]["symbol"],
      signalsArray[i]["date"],
      signalsArray[i]["trade"],
      signalsArray[i]["priorHitsCount"],
      signalsArray[i]["recentHitsCount"],
      signalsArray[i]["recentHitsOnDecreasingVolumeCount"],
      signalsArray[i]["absorptionVolume"]
    ].join(",")
    FS.appendFile("results.csv", line + "\n", "utf8", (err) => {
      if (err) throw err;
    });
  }
  console.log("\n\nCSV results written to disk."); 
}

module.exports = writeCSV;
