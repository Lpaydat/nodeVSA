const daysBetween = require('./daysBetween.js');
let data = require('./stockData.js');

// A 'hit' is a pivot near the same price range as the current pivot.
// Finds and stores all prior hits, recent hits, and recent hits on decreasing volume.
// Scans an array of pivots for a single ticker.
function findHits(ticker, direction, pivots) {
  let pivot;
  if(direction === 'long') {
    pivot = 'l';
  } else if(direction === 'short') {
    pivot = 'h'; 
  } else {
    return console.error('Must specify "long" or "short".');
  }


  // Calculate average volume over last 14 days.
  // Used to detect absorption volume.
  let avgVolume = data.quotes[ticker].data.map(day => day.v).reduce((a,b)=>{ return a + b;})/data.quotes[ticker].data.length;

  // For each day of pivot data i in data.quotes[ticker][pivotArr]
  for(let i = 0; i < pivots.length; i++) {

    // Init values.
    pivots[i].priorHits = [];
    pivots[i].priorHitsCount = 0;
    pivots[i].recentHits = [];
    pivots[i].recentHitsCount = 0;
    pivots[i].recentHitsOnGreaterVolume = [];
    pivots[i].recentHitsOnGreaterVolumeCount = 0;
    pivots[i].absorptionVolume = false;
    pivots[i].allRecentHitsDecreasing = null;
    pivots[i].belowAvgVol = false;
    pivots[i].outerPivotOnLowerVolume = false;
    pivots[i].date = pivots[i].date.split(' ')[0]; // Removes the random timestamp.

    // Calculate hit threshold.
    let threshold = 0.003;
    let p = pivots[i][pivot];
    let range = [
      p - (p * threshold),
      p + (p * threshold),
    ];


    // Lookback period to find each pivot's recent prior hits.
    let dayRange = 100; 


    // Get prior pivots j within range of current pivot i.
    for(let j = 0; j < i; j++) {
      if(
        (pivots[j][pivot] >= range[0]) &&
        (pivots[j][pivot] <= range[1])
      ) {
        // Store array with pivot.
        pivots[i].priorHits.push(pivots[j]);
        pivots[i].priorHitsCount = pivots[i].priorHits.length;
      }
    }

    // Get prior pivots k within day range of current pivot i.
    for(let k = 0; k < pivots[i].priorHits.length; k++) {
      // Capture more recent hits.
      // Removes dash from dates, then compares difference to check if within range.
      if( daysBetween(pivots[i].priorHits[k]['date'], pivots[i]['date']) < dayRange) {
        pivots[i].recentHits.push(pivots[i].priorHits[k]);
        pivots[i].recentHitsCount = pivots[i].recentHits.length;
      }
    }

    // Get all recent hits that have more volume than current pivot.
    for(let l = 0; l < pivots[i].recentHits.length; l++) {
      // If the volume is Decreasing on any of the prior recent pivots, add to recentHitsOnGreaterVolume.
      if(pivots[i].recentHits[l]['v'] > pivots[i]['v']) {
        pivots[i].recentHitsOnGreaterVolume.push(pivots[i].recentHits[l]);
        pivots[i].recentHitsOnGreaterVolumeCount = pivots[i].recentHitsOnGreaterVolume.length;
      }
    }

    // Determine if any recent hit shows absorption volume.
    for(let m = 0; m < pivots[i].recentHitsOnGreaterVolume.length; m++) {
      // If any of the recent hits have volume greater than X times the average, mark true.
      if(pivots[i].recentHitsOnGreaterVolume[m]['v'] > pivots[i]['averageVol'] * 1.2) {
        pivots[i].absorptionVolume = true;
      }
    }

    
    // Determine if all recent hits are decreasing in volume.
      // Handle when there's more than one recent hit.
    if(pivots[i].recentHitsOnGreaterVolume.length > 1) {
      let allDecreasingSoFar = true;
      // Set flag if all recentHitsOnGreaterVolume are decreasing.
      for(let n = 1; n < pivots[i].recentHitsOnGreaterVolume.length; n++) {
        if(!(pivots[i].recentHitsOnGreaterVolume[n]['v'] <= pivots[i].recentHitsOnGreaterVolume[n-1]['v'] &&
            pivots[i].recentHitsOnGreaterVolume[n]['v'] > pivots[i]['v'])
          ) {
          allDecreasingSoFar = false;
        }
      }
      pivots[i].allRecentHitsDecreasing = allDecreasingSoFar;
      // Handle when there's exactly one recent hit.
    } else if(pivots[i].recentHitsOnGreaterVolume.length === 1) {
      let allDecreasingSoFar = true;
      if(!(pivots[i].recentHitsOnGreaterVolume[0]['v'] > pivots[i]['v'])) {
        allDecreasingSoFar = false;
      }
      pivots[i].allRecentHitsDecreasing = allDecreasingSoFar;
    }


    // Determine if this current pivot has below average volume.
    if(pivots[i]['v'] < pivots[i]['averageVol']) {
      pivots[i].belowAvgVol = true;
    }

    // Determine if current pivot is an outer pivot on lower volume.
    let len = pivots[i].recentHits.length;
    if(len) {
      // console.log('current pivot:', pivots[i]);
      // console.log('prior pivot:', pivots[i].recentHits[len-1]);
      if(direction === 'long') {
        if( (pivots[i]['l'] < pivots[i].recentHits[len-1]['l']) && 
             (pivots[i]['v'] < pivots[i].recentHits[len-1]['v'])
          ) {
          // console.log('this pivot:', pivots[i]['date']);
          // console.log('current low:', pivots[i]['l']);
          // console.log('current volume:', pivots[i]['v']);
          // console.log('most recent pivot:', pivots[i].recentHits[len-1]['date']);
          // console.log('most recent pivot's volume:', pivots[i].recentHits[len-1]['v']);
          // console.log('most recent pivot's low:', pivots[i].recentHits[len-1]['l']);
          pivots[i].outerPivotOnLowerVolume = true;
          pivots[i].outerPivotOnLowerVolumeDate = pivots[i].recentHits[len-1]['date'];
        }
      } else if(direction === 'short') {
        if( (pivots[i]['h'] > pivots[i].recentHits[len-1]['h']) && 
             (pivots[i]['v'] < pivots[i].recentHits[len-1]['v'])
          ) {
          // console.log('this pivot:', pivots[i]['date']);
          // console.log('current high:', pivots[i]['h']);
          // console.log('current volume:', pivots[i]['v']);
          // console.log('most recent pivot:', pivots[i].recentHits[len-1]['date']);
          // console.log('most recent pivot's volume:', pivots[i].recentHits[len-1]['v']);
          // console.log('most recent pivot's high:', pivots[i].recentHits[len-1]['h']);
          pivots[i].outerPivotOnLowerVolume = true;
          pivots[i].outerPivotOnLowerVolumeDate = pivots[i].recentHits[len-1]['date'];
        }
      }
    }

    // console.log(pivots[i]);
  }
}

module.exports = findHits;
