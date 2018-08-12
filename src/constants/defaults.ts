export const API_ENDPOINT = 'http://localhost:8080'
export const API_LOAN_REQUESTS = 'http://127.0.0.1:5000'
export const DEFAULT_CONTRACTS = {
  contracts: {},
  balances: {},
  allowances: {},
  positions: {
    lent: [],
    borrowed: [],
  },
}
export const DEFAULT_LOADINGS = {
  orders: true,
  positions: true,
  wrapping: false,
  allowance: false,
}
export const DEFAULT_ORDERS = {
  myOrders: {
    lend: [],
    borrow: [],
  },
  orders: [],
}
export const DEFAULT_EXCHANGES = {
  currentWETHExchangeRate: 0,
  currentDAIExchangeRate: 0,
}

export const LOAN_STATUS_ACTIVE = 0
export const LOAN_STATUS_CLOSED = 1
export const LOAN_STATUS_LIQUIDATING = 2
export const LOAN_STATUS_LIQUIDATED = 3
export const LOAN_STATUS_DEACTIVATED = 4
