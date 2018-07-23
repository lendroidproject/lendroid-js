import {
  apiGet,
  apiPost,
  apiDelete,
} from '../constants'

export const fetchOrders = (base, callback) => {
  apiGet(base, '/offers', callback)
}

export const createOrder = (base, data, callback) => {
  apiPost(base, '/offers', data, callback)
}

export const deleteOrder = (base, id, callback) => {
  apiDelete(base, `/offers/${id}`, callback)
}
