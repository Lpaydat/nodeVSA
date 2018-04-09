const log = console.log;

function printResults (arr) {

  function pad (toPad, len) {
    let input = String(toPad);
    while (input.length < len) {
      input += ' ';
    }
    return input;
  }
  
  log(
    'symbol | ' + 
    'date | ' + 
    'trade | ' + 
    'aph | ' + 
    'rh | ' + 
    'rhogv | ' + 
    'av | ' +
    'rhad | ' +
    'bav | ' +
    'oplv | ' + 
    'oplvDate: '
  );


  let long = 0, short = 0, weightedLong = 0, weightedShort = 0;

  for (let i = 0; i < arr.length; i++) {
    log(
      `${pad(arr[i].symbol, 6)} | ` +
      `${arr[i].date} | ` +
      `${pad(arr[i].trade, 6)} | ` +
      `${arr[i].priorHitsCount} | ` +
      `${arr[i].recentHitsCount} | ` +
      `${arr[i].recentHitsOnGreaterVolumeCount} | ` +
      `${arr[i].absorptionVolume} | ` +
      `${arr[i].allRecentHitsDecreasing} | ` +
      `${arr[i].belowAvgVol} | ` +
      `${arr[i].outerPivotOnLowerVolume} | ` + 
      `${arr[i].outerPivotOnLowerVolumeDate}`
    );
    
    if (arr[i].trade === 'long') {
      weightedLong += arr[i].recentHitsOnGreaterVolumeCount;
      long++;
    }

    if (arr[i].trade === 'short'){ 
      weightedShort += arr[i].recentHitsOnGreaterVolumeCount;
      short++; 
    }
  }
  log('Long/Short Ratio:', long/short);
  log('Weighted ratio:', weightedLong/weightedShort);
  log('Weighted long:', weightedLong);
  log('Weighted short:', weightedShort);
  log('Long:', long);
  log('Short:', short);
}

module.exports = printResults;
