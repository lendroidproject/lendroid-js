import axios from 'axios'

export const apiGet = (base, endPoint, cb) => {
  const url = base + endPoint

  axios
    .get(url)
    .then(res => {
      cb(null, res.data)
    })
    .catch(err => {
      cb(err)
    })
}

export const apiPost = (base, endPoint, data, cb) => {
  const url = base + endPoint

  axios
    .post(url, data)
    .then(res => {
      cb(null, res.data)
    })
    .catch(err => {
      cb(err)
    })
}

export const apiDelete = (base, endPoint, cb) => {
  const url = base + endPoint

  axios
    .delete(url)
    .then(res => {
      cb(null, res)
    })
    .catch(err => {
      cb(err)
    })
}
