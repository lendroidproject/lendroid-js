"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_ENDPOINT = 'http://localhost:19080';
exports.API_LOAN_REQUESTS = 'http://127.0.0.1:5000';
exports.DEFAULT_WRANGLERS = [
    {
        label: 'Default Simple Wrangler',
        address: '0x0f02a30cA336EC791Ac8Cb40816e4Fc5aeB57E38',
        apiLoanRequests: 'https://lendroidwrangler.com'
    }
];
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