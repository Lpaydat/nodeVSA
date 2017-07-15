function printResults (arr) {

  console.log("symbol | date | trade | hitsCount | recentHitsCount:");

  for (let i = 0; i < arr.length; i++) {
    console.log(`${arr[i].symbol} | ${arr[i].date} | ${arr[i].trade} | ${arr[i].hitsCount} | ${arr[i].recentHitsCount}`);
  }

}

module.exports = printResults;