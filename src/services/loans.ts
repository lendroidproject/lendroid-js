import {
  apiPost,
} from '../constants'

export const postLoans = (base, data, callback) => {
  apiPost(base, '/loan_requests', data, callback)
}
