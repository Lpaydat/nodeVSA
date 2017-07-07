# nodeVSA

None of my stock trading software does exactly what I want it to, so I figured I'd just build a tool.

Retrieves stock data for a list of your tickers, cleans and transforms data, and scans for supply and demand tests.


## How to:

Run `git clone https://github.com/wnmurphy/nodeVSA.git`

Run `npm install` to install dependencies.

Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key) and get an API key.

Create a `config.js` file with `module.exports = { API_KEY : YOUR_API_KEY};`

Add your own stock tickers to `stockList.js`.

Run `node nodeVSA`.