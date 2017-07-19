let fs = require("fs");

function writeCSV (signalsArray) {
  // Create new file, overwrite existing old results.
  fs.writeFile("results.csv", "", (err) => {
    if (err) throw err;
  });
  fs.appendFileSync("results.csv", "symbol,date,trade,hits,recentHits,recentHitsOnLowerVolume\n", "utf8");
  for (let i = 0; i < signalsArray.length; i++) {
    let line = [ 
      signalsArray[i]["symbol"],
      signalsArray[i]["date"],
      signalsArray[i]["trade"],
      signalsArray[i]["hitsCount"],
      signalsArray[i]["recentHitsCount"],
      signalsArray[i]["recentHitsOnLowerVolumeCount"],
    ].join(",")
    fs.appendFile("results.csv", line + "\n", "utf8", (err) => {
      if (err) throw err;
    });
  }
  console.log("\n\nCSV results written to disk."); 
}

module.exports = writeCSV;