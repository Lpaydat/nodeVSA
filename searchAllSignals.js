// Searches through all loaded signals by ticker, date, or trade direction.
  // Should be run once we've finished retrieiving all data from server.
  // Example search filters:
  // "signal.date === '2017-07-07'"
  // "signal.symbol === 'AAPL' && signal.trade === 'long'"
function searchAllSignals (filter) {
  // Defaults the search results to a list of all signals.
  let searchResults;
  if (filter !== undefined) { 
    searchResults = stockData.allSignals.filter(function(signal){
      return eval(filter);
    });
  }
  console.log("\n" + "\x1b[31m" + "## Search Results:" + "\x1b[0m" + "\n", searchResults);
};

module.exports = searchAllSignals;
