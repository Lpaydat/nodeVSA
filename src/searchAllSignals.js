// Searches through all loaded signals by ticker, date, or trade direction.
  // Should be run once we've finished retrieiving all data from server.
  // Example search filters:
  // "signal.date === '2017-07-07'"
  // "signal.symbol === 'AAPL' && signal.trade === 'long'"

let stockData = require("./stockData.js");
let formatSignal = require("./formatSignal.js");


function searchAllSignals (filter) {

  let searchResults;

  // If a filter was passed as command line argument to nodeVSA
  if (filter) { 
    searchResults = stockData.allSignals.filter(function(signal){
      return eval(eval(filter));
    });
  }


  if (searchResults.length === stockData.allSignals.length) {
    console.log("\n" + "\x1b[31m" + "## No search results found." + "\x1b[0m" + "\n");  
  } else {
    console.log("\n" + "\x1b[31m" + "## Search Results:" + "\x1b[0m" + "\n");
    console.log("symbol | date} | trade | hitsCount | recentHitsCount:");
    let formattedResults = searchResults.sort((x, y)=>{
      return x.recentHitsCount - y.recentHitsCount;
    }).map(formatSignal);
  }

};

module.exports = searchAllSignals;
