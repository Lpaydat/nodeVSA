const LOG = console.log;

function printResults (arr) {

  LOG(
    "symbol | " + 
    "date | " + 
    "trade | " + 
    "priorHits | " + 
    "recentHits | " + 
    "recentHitsOnGreaterVolume | " + 
    "absorptionVolume | " +
    "allRecentHitsDecreasing | " +
    "belowAvgVol:"
  );

  function pad (toPad, len) {
    let input = String(toPad);
    while (input.length < len) {
      input += " ";
    }
    return input;
  }

  let long = 0, short = 0;

  for (let i = 0; i < arr.length; i++) {
    LOG(
      `${pad(arr[i].symbol, 6)} | ` +
      `${arr[i].date} | ` +
      `${pad(arr[i].trade, 6)} | ` +
      `${arr[i].priorHitsCount} | ` +
      `${arr[i].recentHitsCount} | ` +
      `${arr[i].recentHitsOnGreaterVolumeCount} | ` +
      `${arr[i].absorptionVolume} | ` +
      `${arr[i].allRecentHitsDecreasing} | ` +
      `${arr[i].belowAvgVol}` 
    );
    
    if (arr[i].trade === "long") long++;
    if (arr[i].trade === "short") short++; 
  }
  LOG("Long:", long);
  LOG("Short:", short);
  LOG("Long/Short Ratio:", long/short);
}

module.exports = printResults;
