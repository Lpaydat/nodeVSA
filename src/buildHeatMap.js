let data = require("./stockData.js");


// data.quotes[ticker]
// data.quotes[ticker]["data"] // loop over and collect all [OHLC, V]
// data.quotes[ticker]["heatmap"] // store here

  // Experimental; collect all OHLC price points to generate a heatmap of support/resistance.
  // This is basically data for a volume-by-price chart.
function buildHeatMap (ticker) {
  let t = data.quotes[ticker];
  t["heatmap"] = t["heatmap"] || [];
  let h, l, c, v;
  for (let i = 0; i < t["data"].length; i++) {
    h = t["data"][i]["h"];
    l = t["data"][i]["l"];
    c = t["data"][i]["c"];
    v = t["data"][i]["v"];
    t["heatmap"].push([h, v]);
    t["heatmap"].push([l, v]);
    t["heatmap"].push([c, v]);
  }
  t["heatmap"].sort((entry, nextEntry) => {
    return entry[0] - nextEntry[0];
  })
  console.log(t["heatmap"]);
}

module.exports = buildHeatMap;