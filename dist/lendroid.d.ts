import { Web3Utils } from './services';
export declare class Lendroid {
    private web3;
    private apiEndpoint;
    private exchangeRates;
    private contracts;
    private orders;
    private lastFetchTime;
    private loading;
    private stateCallback;
    private debounceUpdate;
    metamask: any;
    relayer: any;
    wranglers: any;
    web3Utils: Web3Utils;
    contractAddresses: any;
    contractTokens: any;
    balanceTokens: any;
    constructor(initParams?: any);
    getTokenByAddress(address: any): string;
    onCreateOrder(postData: any, callback: any): Promise<void>;
    onFillOrderServer({id, fillerAddress, value, txHash}: {
        id: any;
        fillerAddress: any;
        value: any;
        txHash: any;
    }, callback: any): void;
    onDeleteOrder({id, txHash}: {
        id: any;
        txHash: any;
    }, callback: any): void;
    onWrapETH(amount: any, isWrap: any, callback: any): void;
    onAllowance(token: any, callback: any): void;
    onPostLoans(data: any, callback: any): void;
    onFillLoan(approval: any, callback: any): void;
    onClosePosition(data: any, callback: any): Promise<void>;
    onTopUpPosition(data: any, topUpCollateralAmount: any, callback: any): void;
    onLiquidatePosition(data: any, callback: any): Promise<void>;
    onCancelOrder(data: any, callback: any): void;
    private init();
    private reset(metamask);
    private fetchOrders();
    private fetchPositions(specificAddress?);
    private fetchTokenExchange(token);
    private fetchContracts();
    private fetchContractByToken(token, callback);
    private fetchETHBallance();
    private fetchBallanceByToken(token, callback?, once?);
    private fetchAllowanceByToken(token, callback?, once?);
    private fetchAllowanceByAddress(address, token);
    private debounce(func, wait, immediate);
    private fillZero(len?);
}
