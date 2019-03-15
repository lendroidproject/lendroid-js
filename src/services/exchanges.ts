import axios from 'axios'

export const getTokenExchangeRate = (token, callback) => {
  const url = `https://api.coinmarketcap.com/v1/ticker/${token.toLowerCase()}//?convert=ETH`
  axios.get(url)
    .then(res => {
      const result = res.data[0]
      callback(1 / result.price_eth, token)
      setTimeout(getTokenExchangeRate, 12 * 1000, token === 'WETH' ? 'DAI' : 'WETH', callback)
    })
}
