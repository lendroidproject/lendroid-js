export declare class Web3Utils {
    private web3;
    eth: any;
    constructor(web3: any);
    toWei(value: any): any;
    fromWei(value: any): any;
    toBN(value: any): any;
    toDecimal(value: any): any;
    substract(value1: any, value2: any): number;
    substractBN(value1: any, value2: any): number;
    createContract(abi: any, address: any): any;
    sendSignedTransaction(signedTransactionData: any): any;
}
