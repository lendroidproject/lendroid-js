import {
  apiPost,
  apiGet
} from '../constants'

export const postLoans = (base, data, callback) => {
  apiPost(base, '/loan_requests', data, callback)
}

export const getLoanHealth = (base, id, callback) => {
  apiGet(base, `/loan_request/${id}`, callback)
}
