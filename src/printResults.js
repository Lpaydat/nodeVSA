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
  }

}

module.exports = printResults;
