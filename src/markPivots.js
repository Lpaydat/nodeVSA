let data = require('./stockData.js');

// Take an array, days, and the ticker symbol as a string.
function markPivots(days, ticker) {

  // Init storage arrays for pivots if undefined.
  data.quotes[ticker]['pivotHighs'] = data.quotes[ticker]['pivotHighs'] || [];
  data.quotes[ticker]['pivotLows'] = data.quotes[ticker]['pivotLows'] || [];

  // Calculate a 14-day volume average for each day.
  for(let i = 14; i < days.length; i++) {
    let last14Days = days.slice(i-14, i);
    let avgVol = last14Days.map(day => day.v).reduce((a,b)=>{ return a + b; })/14;
    // console.log(avgVol);
    days[i].averageVol = parseInt(avgVol);
  }

  // Mark pivot highs.
  for(let i = 1; i < days.length; i++) {
    // Mark most recent day as pivot high.
    if(days[i+1] === undefined) {
      if(days[i].h > days[i-1].h) {
        days[i].pivotHigh = true;
        // Extract next day close for analytics:
        days[i].tomorrowClose = 'N/A';
        data.quotes[ticker]['pivotHighs'].push(days[i]);
      }
    } 
    else { 
      // Mark all days with a pivot high and add to storage array.
      if(days[i].h > days[i-1].h && days[i].h > days[i+1].h) {
        days[i].pivotHigh = true;
        // Extract next day close for analytics:
        days[i].tomorrowClose = days[i+1].c;
        data.quotes[ticker]['pivotHighs'].push(days[i]);
      }
    }
  }

  // Mark pivot lows.
  for(let i = 1; i < days.length; i++) {
    // Mark most recent day as pivot low.
    if(days[i+1] === undefined) { 
      if(days[i].l < days[i-1].l) {
        days[i].pivotLow = true;
        // Extract next day close for analytics:
        days[i].tomorrowClose = 'N/A';
        data.quotes[ticker]['pivotLows'].push(days[i]);
      }
    } 
    else {
      // Mark all days with a pivot high and add to storage array.
      if(days[i].l < days[i-1].l && days[i].l < days[i+1].l) { 
        days[i].pivotLow = true;
        // Extract next day close for analytics:
        days[i].tomorrowClose = days[i+1].c;
        data.quotes[ticker]['pivotLows'].push(days[i]);
      }
    }
  }
}

module.exports = markPivots;
