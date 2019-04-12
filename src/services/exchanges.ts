import axios from 'axios'

export const getTokenExchangeRate = (token, callback) => {
  let tick = token.toLowerCase()
  if (token === 'USDC') { tick = 'usd-coin' }
  const url = `https://api.coinmarketcap.com/v1/ticker/${tick}//?convert=ETH`
  axios.get(url)
    .then(res => {
      const result = res.data[0]
      callback(1 / result.price_eth)
      // setTimeout(getTokenExchangeRate, 12 * 1000, token, callback)
    })
    .catch(err => {
      callback(1)
      // setTimeout(getTokenExchangeRate, 12 * 1000, token, callback)
    })
}
