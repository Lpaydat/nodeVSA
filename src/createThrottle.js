// Promise throttler (courtesy Pasha Rumkin)
// https://stackoverflow.com/questions/38048829/node-js-api-request-limit-with-request-promise
function createThrottle(series, timeout) {
  let seriesCounter = 0;
  let delay = 0;

  return () => {
    return new Promise((resolve) => {
      if (--seriesCounter <= 0) {
        delay += timeout;
        seriesCounter = series;
      }

      setTimeout(resolve, delay);
    });
  };
}

module.exports = createThrottle;