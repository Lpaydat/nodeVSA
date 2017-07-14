function formatSignal (signal) {
  return console.log(`${signal.symbol} | ${signal.date} | ${signal.trade} | ${signal.hitsCount} | ${signal.recentHitsCount}`);
}

module.exports = formatSignal;