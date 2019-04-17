import axios from 'axios'

export const getTokenExchangeRate = (token, callback) => {
  // let tick = token.toLowerCase()
  // if (token === 'USDC') { tick = 'usd-coin' }
  // const url = `https://api.coinmarketcap.com/v1/ticker/${tick}//?convert=ETH`
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=ETH`
  axios.get(url)
    .then(res => {
      const result = res.data.ETH
      callback(1 / result)
      // setTimeout(getTokenExchangeRate, 12 * 1000, token, callback)
    })
    .catch(err => {
      callback(1)
      // setTimeout(getTokenExchangeRate, 12 * 1000, token, callback)
    })
}
