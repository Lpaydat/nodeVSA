let fs = require('fs');

function writeCSV (signalsArray) {
  let csvArray = [];
  for (let i = 0; i < signalsArray.length; i++) {
    let line = [ 
      signalsArray[i]["symbol"],
      signalsArray[i]["date"],
      signalsArray[i]["trade"],
      signalsArray[i]["hitsCount"],
      signalsArray[i]["recentHitsCount"],
    ].join(',')
    csvArray.push(line);  
  }
  csvArray.join('\n');
  fs.writeFile('results.csv', csvArray, "utf8", (err) => {
    if (err) throw err;
    console.log("CSV results written to disk."); 
  });
}

module.exports = writeCSV;