export declare const API_ENDPOINT = "http://localhost:19080";
export declare const API_LOAN_REQUESTS = "http://127.0.0.1:5000";
export declare const DEFAULT_WRANGLERS: {
    label: string;
    address: string;
    apiLoanRequests: string;
}[];
export declare const DEFAULT_CONTRACTS: {
    contracts: {};
    balances: {};
    allowances: {};
    positions: {
        lent: never[];
        borrowed: never[];
    };
};
export declare const DEFAULT_LOADINGS: {
    orders: boolean;
    positions: boolean;
    wrapping: boolean;
    allowance: boolean;
};
export declare const DEFAULT_ORDERS: {
    myOrders: {
        lend: never[];
        borrow: never[];
    };
    orders: never[];
};
export declare const DEFAULT_EXCHANGES: {
    currentWETHExchangeRate: number;
};
export declare const LOAN_STATUS_OPEN = 1;
export declare const LOAN_STATUS_CLOSED = 2;
export declare const LOAN_STATUS_LIQUIDATED = 3;
