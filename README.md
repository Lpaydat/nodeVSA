# nodeVSA

None of my stock trading software does exactly what I want it to, so I figured I'd just build a tool.

Retrieves stock data for a list of your tickers, cleans and transforms data, and scans for supply and demand tests.


## Installation:

Run `git clone https://github.com/wnmurphy/nodeVSA.git`

Run `npm install` to install dependencies.

Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key) and get an API key.

Create a `config.js` file with `module.exports = { API_KEY : YOUR_API_KEY};`

Add your own stock tickers to `stockList.js`.

Run `node nodeVSA`.

## Filtering Results

You can add search criteria via command line argument:

  `node nodeVSA {search criteria as a string}`

The available search critera are:

- `signal.date`: `'YYYY-MM-YY'`
- `signal.trade`: `'long' | 'short'`
- `signal.symbol`: `'TSLA'`

For example, to show only results for long trades for Apple (AAPL):

  `node nodeVSA "signal.trade === 'long' && signal.symbol === 'AAPL'"`