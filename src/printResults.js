function printResults (arr) {

  console.log("symbol | date | trade | priorHits | recentHits | recentHitsOnLowerVolume:");

  for (let i = 0; i < arr.length; i++) {
    console.log(`${arr[i].symbol} | ${arr[i].date} | ${arr[i].trade} | ${arr[i].priorHitsCount} | ${arr[i].recentHitsCount} | ${arr[i].recentHitsOnLowerVolumeCount}`);
  }

}

module.exports = printResults;