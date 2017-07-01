/*
  Goal: Create a a node.js script I can run at 12:30pm to find setups.
  
  The setup is basically what Volume Spread Analysis (VSA) calls a supply test.
  
  In English:
    1. Find a pivot low.
    2. Draw a line from the low to the left.
    3. The line should skip at least 1 day.
    4. If the line hits the range of a lower pivot low with higher volume, watch.
    5. When the price exits the current channel, buy.

  The data set below is perfect for an MVP, because it contains two setups.
    2017-06-13: short setup
    2017-06-21: long setup

  See http://imgur.com/SHCYUgV for a chart of these two setups.

  Data from alphavantage.co's API @ https://www.alphavantage.co/documentation/

  Example URLs with query:
    "https://www.alphavantage.co/query?function=HT_PHASOR&symbol=MSFT&interval=weekly&series_type=close&apikey=demo"
    "https://www.alphavantage.co/query?&symbol=MSFT&interval=weekly&apikey=demo"
*/

let https = require("https");
let stockData = {};
let myTickerList = ["GPRO", "TSLA", "AMZN"];

let getStockData = (ticker) => {
  const CONFIG = {
    URL : "www.alphavantage.co",
    API_KEY : "PUT_YOUR_API_KEY_HERE"
  }

  let options = {
    host: CONFIG.URL,
    path: "/query" + "?apikey=" + CONFIG.API_KEY + "&symbol=" + ticker + "&function=TIME_SERIES_DAILY",
    json: true
  };
  
  console.log("Getting data for: ", "\x1b[34m", ticker, "\x1b[0m");
  
  https.request(options, function(res){
    let data = "";

    res.on("data", (chunk) => {
      console.log("Data chunk received for " + ticker + ".");
      return data += chunk;
    });
    
    res.on("end", () => {
      console.log("Data transmission complete for " + ticker + ".");
      let fullData = JSON.parse(data);
      let strippedData = fullData["Time Series (Daily)"];
      stockData[ticker] = strippedData;
      dataHasLoaded(ticker);
    });
    
    res.on("error", (err) => {
      console.error("\x1b[31m%s\x1b[0m", err, "\x1b", "\n");
    });
  }).end();
};

// Takes array of stock symbols as strings and fetches data for each.
function fetchDataForAllStocks(arrayOfStockTickers) {
  for (let i = 0; i < arrayOfStockTickers.length; i++) {
    getStockData(arrayOfStockTickers[i]);
  }
};

// Notifies user when one stock's data has finished loading into memory.
function dataHasLoaded (ticker) {
  console.log("Storing data locally for " + ticker + ".", "\n");
  console.log(stockData);
};

fetchDataForAllStocks(myTickerList);
