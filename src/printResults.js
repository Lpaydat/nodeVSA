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

  for (let i = 0; i < arr.length; i++) {
    LOG(
      `${arr[i].symbol} | ` +
      `${arr[i].date} | ` +
      `${arr[i].trade} | ` +
      `${arr[i].priorHitsCount} | ` +
      `${arr[i].recentHitsCount} | ` +
      `${arr[i].recentHitsOnGreaterVolumeCount} | ` +
      `${arr[i].absorptionVolume} | ` +
      `${arr[i].allRecentHitsDecreasing} | ` +
      `${arr[i].belowAvgVol} | ` 
    );
  }

}

module.exports = printResults;
