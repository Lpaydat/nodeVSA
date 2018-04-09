const config = require('../config.js')
const rp = require('request-promise');
const transformData = require('./transformData.js');
const markPivots = require('./markPivots.js');
const buildHeatmap = require('./buildHeatMap');
const findHits = require('./findHits.js');
const buildSignals = require('./buildSignals.js');
const log = console.log;
let data = require('./stockData.js');

// Requests data for one stock ticker with a promise.
let fetchDataForOneStock = (ticker) => new Promise((resolve, reject) => {
  
  log('Getting: ', '\x1b[34m', ticker, '\x1b[0m');

  rp({ // Request data for this stock.
    uri: 'https://www.alphavantage.co/query',
    json: true,
    qs: {
      apikey: config.API_KEY,
      function: 'TIME_SERIES_DAILY',
      symbol: ticker
    },
    transform: transformData // Clean up the raw data.
  })
  .then((transformedData) => {

    // Store clean data for this stock for processing.
    data.quotes[ticker] = {};
    data.quotes[ticker]['data'] = transformedData;

    // Mark pivot highs and lows.
    markPivots(data.quotes[ticker]['data'], ticker);
    buildHeatmap(ticker);

    // Scan each pivot for prior pivots in range, decreasing volume, absorption volume, etc.
    findHits(ticker, 'long', data.quotes[ticker]['pivotLows']);
    findHits(ticker, 'short', data.quotes[ticker]['pivotHighs']);
  
    // Build our buy/sell signal objects.
    buildSignals('long', data.quotes[ticker]['pivotLows'], ticker);
    buildSignals('short', data.quotes[ticker]['pivotHighs'], ticker);
    
    log('Got: ', '\x1b[34m', ticker, '\x1b[0m');

    resolve();
  })
  .catch((err) => { 
    // Tell user if something went wrong.
    log('\n' + '\x1b[31m' + 'Ticker: ' + ticker + '\n' + 'Error: ' + '\x1b[0m' + '\n' + err);
    // Add ticker to retry list.
    data.retries.push(ticker);
    reject(err);
  })
}); 

module.exports = fetchDataForOneStock;
