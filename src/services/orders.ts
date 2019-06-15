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

export const fillOrderServer = (base, { id, value, txHash }, callback) => {
  apiPost(base, `/offers/fill/${id}/${value}`, { txHash }, callback)
}

export const deleteOrder = (base, { id, txHash }, callback) => {
  apiDelete(base, `/offers/${id}/${txHash}`, callback)
}
