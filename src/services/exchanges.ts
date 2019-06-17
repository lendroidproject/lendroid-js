import axios from 'axios'

export const getTokenExchangeRate = (token, callback) => {
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=ETH`
  axios.get(url)
    .then(res => {
      const result = res.data.ETH
      callback(1 / result)
    })
    .catch(err => {
      callback(1)
    })
}
