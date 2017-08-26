/*
  Illustrates the structure of the data.

  stockData.signals
    Array of signal objects for filtering results.
  stockData.quotes[ticker].data
    Array of trading day data.
  stockData.quotes[ticker].data[i].date
    Date
  stockData.quotes[ticker].data[i].h
    Daily High
  stockData.quotes[ticker].data[i].l
    Daily Low
  stockData.quotes[ticker].data[i].c
    Closing price
  stockData.quotes[ticker].data[i].v
    Volume
  stockData.quotes[ticker].data[i].pivotHigh
    Boolean
  stockData.quotes[ticker].data[i].pivotLow
    Boolean
  stockData.quotes[ticker].data[i].hits
    Array of prior trading days where the pivot low/high is within range of this day's pivot.
  stockData.quotes[ticker].data[i].hitsCount
    Strength of support/resistance at this day's pivot range.
*/



let data = {
  signals: [
    {
      date: "06-27-17",
      symbol: "GPRO",
      hitsCount: 3,
      hits: [{}, {}, {}],
      recentHitsCount: 3,
      recentHits: [{}, {}, {}],
      recentHitsOnGreaterVolumeCount: 3,
      recentHitsOnGreaterVolume: [{}, {}, {}],
      direction: "long",
      absorptionVolume: true,
      data: {} // ohlcv for the day of this signal
    },
    {
      date: "06-25-17",
      symbol: "AAPL",
      hitsCount: 2,
      hits: [{}, {}],
      recentHitsCount: 1,
      recentHits: [{}],
      recentHitsOnGreaterVolumeCount: 1,
      recentHitsOnGreaterVolume: [{}],
      direction: "short",
      absorptionVolume: true
    }
  ],
  // We also store the complete data per each stock.
  quotes: {
    GPRO : {
      data : [
       {
          date : "2017-03-09",
          h : 9.59,
          l : 9.27,
          c : 9.46,
          v : 2931317,
          pivotHigh : true,
          pivotLow : false,
          hits: [],
          hitsCount: 0
        },
        {
          date : "2017-03-08",
          h : 9.33,
          l : 9.12,
          c : 9.25,
          v : 1877478,
          pivotHigh : true,
          pivotLow : false,
          hits: [{}, {}, {}],
          hitsCount: 3
        }
      ],
      pivotHighs : [
        {
          date : "2017-03-08",
          h : 9.33,
          l : 9.12,
          c : 9.25,
          v : 1877478,
          pivotHigh : true,
          pivotLow : false,
          hits: [{}],
          hitsCount: 1
        }
      ],
      pivotLows : []
    },
    AAPL : {
      data : [
       {
          date : "2017-03-09",
          h : 9.59,
          l : 9.27,
          c : 9.46,
          v : 2931317,
          pivotHigh : true,
          pivotLow : false,
          hits: [{}],
          hitsCount: 1
        },
        {
          date : "2017-03-08",
          h : 9.33,
          l : 9.12,
          c : 9.25,
          v : 1877478,
          pivotHigh : true,
          pivotLow : false,
          hits: [{}, {}],
          hitsCount: 2
        }
      ],
      pivotHighs : [],
      pivotLows : []
    }
  }
};


// This is the format of the JSON object Alpha Vantage sends.
let responseBodySample = { 
  'Meta Data': {
    '1. Information': 'Daily Prices (open, high, low, close) and Volumes',
    '2. Symbol': 'GPRO',
    '3. Last Refreshed': '2017-06-30',
    '4. Output Size': 'Compact',
    '5. Time Zone': 'US/Eastern' 
  },
  'Time Series (Daily)': { 
    '2017-06-30': { 
      '1. open': '8.2600',
      '2. high': '8.3100',
      '3. low': '8.0900',
      '4. close': '8.1300',
      '5. volume': '1788848' 
    },
    '2017-06-29': { 
      '1. open': '8.2300',
      '2. high': '8.3300',
      '3. low': '8.1500',
      '4. close': '8.2800',
      '5. volume': '1316299' 
    }
  }
};

