// Searches through all loaded signals by ticker, date, or trade direction.
  // Should be run once we've finished retrieiving all data from server.
  // Example search filters:
  // "signal.date === '2017-07-07'"
  // "signal.symbol === 'AAPL' && signal.trade === 'long'"

let stockData = require("./stockData.js");

function searchAllSignals (filter) {

  let searchResults;

  if (filter !== undefined) { 
    // filter = "eval(" + filter + ")";

    searchResults = stockData.allSignals.filter(function(signal){
      // console.log(typeof eval(filter)); // string
      // console.log(eval(filter)); // "signal.date === 2017-07-07"
      // console.log(typeof eval(eval(filter))); // boolean
      // console.log(eval(eval(filter))); // false

      // return eval("eval(" + filter + ")");
      return eval(eval(filter));

    });
  }

  if (searchResults.length === stockData.allSignals.length) {
    console.log("\n" + "\x1b[31m" + "## No search results found." + "\x1b[0m" + "\n");  
  } else {
    console.log("\n" + "\x1b[31m" + "## Search Results:" + "\x1b[0m" + "\n", searchResults);
  }

};

module.exports = searchAllSignals;


// 'signal.date === ' + (new Date()).toISOString().slice(0,10)
// signal.date === "2017-07-07"