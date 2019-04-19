"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_ENDPOINT = 'https://winged-yeti-201009.appspot.com';
exports.API_LOAN_REQUESTS = 'https://lendroidwrangler.com';
exports.DEFAULT_CONTRACTS = {
    contracts: {},
    balances: {},
    allowances: {},
    positions: {
        lent: [],
        borrowed: [],
    },
};
exports.DEFAULT_LOADINGS = {
    orders: true,
    positions: true,
    wrapping: false,
    allowance: false,
};
exports.DEFAULT_ORDERS = {
    myOrders: {
        lend: [],
        borrow: [],
    },
    orders: [],
};
exports.DEFAULT_EXCHANGES = {
    currentWETHExchangeRate: 1,
};
exports.LOAN_STATUS_OPEN = 1;
exports.LOAN_STATUS_CLOSED = 2;
exports.LOAN_STATUS_LIQUIDATED = 3;
//# sourceMappingURL=defaults.js.map