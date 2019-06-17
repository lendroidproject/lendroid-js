import {
  apiGet,
  apiPost,
} from '../constants'

export const fetchOrders = (base, callback) => {
  apiGet(base, '/offers', callback)
}

export const createOrder = (base, data, callback) => {
  apiPost(base, '/offers', data, callback)
}

export const fillOrderServer = (base, { id, fillerAddress, value, txHash }, callback) => {
  apiPost(base, '/offers/fill', { id, fillerAddress, value, txHash }, callback)
}

export const deleteOrder = (base, { id, txHash }, callback) => {
  apiPost(base, '/offers/delete', { id, txHash }, callback)
}
