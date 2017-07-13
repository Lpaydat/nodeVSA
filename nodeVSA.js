/*
  Goal: Create a a node.js script I can run at 12:30pm to find stock trading setups.
  
  The setup I'm looking for is basically what Volume Spread Analysis (VSA) calls a supply (or demand) test.
  
  In English:
    1. Find a pivot low.
    2. Draw a line from the low to the left.
    3. The line should skip at least 1 day.
    4. If the line hits the range of a lower pivot low with higher volume, watch.
    5. When the price exits the current channel, buy.

  This stock data is perfect for guiding an MVP, because it contains both a long and short setup:
    2017-06-13: short setup
    2017-06-21: long setup

    See http://imgur.com/SHCYUgV for a chart of these two setups.

  Data source: 
    alphavantage.co's API @ https://www.alphavantage.co/documentation/

  Example URLs with query:
    "https://www.alphavantage.co/query?function=HT_PHASOR&symbol=MSFT&interval=weekly&series_type=close&apikey=demo"
    "https://www.alphavantage.co/query?&symbol=MSFT&interval=weekly&apikey=demo"
  
  Notes:
    Alpha Vantage requests a call frequency limit of < 200/minute.
    A batch of ~400 calls results in 503 Service Unavailable responses.
*/

const TICKER_LIST = require("./stockList.js");

let stockData = require("./stockData.js");
let fetchDataForOneStock = require("./fetchDataForOneStock.js");
let createThrottle = require("./createThrottle.js");
let searchAllSignals = require("./searchAllSignals.js");


function start () {

  // Adds rate-limiting per data source's request; ~200 requests per minute
  var throttle = createThrottle(3, 1e3); // 3 requests every 1 second
  
  // Create an array containing a promise for each ticker request.
  let promisifiedTickerArray = TICKER_LIST.map(
    (ticker) => throttle().then(() => (
      fetchDataForOneStock(ticker)
      )
    )
  );
  
  // Main logic.
  Promise.all(promisifiedTickerArray)
  .then(()=>{
    console.log("\n" + "\x1b[31m" + "## All ticker data retrieved." + "\x1b[0m" + "\n");
  })
  .then(()=>{
    // If user passes in a search string at command line, use it.
    if (process.argv[2]) {
      let searchFilter = process.argv[2];
      return searchAllSignals(searchFilter);
    } else {
    // Otherwise show all signals.
      console.log("\n" + "\x1b[31m" + "## No search filter provided." + "\x1b[0m" + "\n");
      console.log(stockData.allSignals);
    }
  })
  .catch((err)=>{
    console.error(err);
  });
}
start();
