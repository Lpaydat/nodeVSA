let exampleResponseBodyFromAlphaVantage = { 
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
      '5. volume': '1316299' }
    }
  }
};

let exampleTransformedDataFormat = {
  GPRO : {
    data : [
     {
        date : "2017-03-09",
        h : 9.59,
        l : 9.27,
        c : 9.46,
        v : 2931317,
        pivotHigh : true,
        pivotLow : false 
      },
      {
        date : "2017-03-08",
        h : 9.33,
        l : 9.12,
        c : 9.25,
        v : 1877478,
        pivotHigh : true,
        pivotLow : false 
      }
    ],
    pivotHighs : [],
    pivotLows : [],
    supplyTests : [],
    demandTests : []
  }
};

