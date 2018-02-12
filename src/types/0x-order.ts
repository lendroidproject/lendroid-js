export interface IZeroExOrder {
    exchangeContractAddress: string
    maker: string
    taker: string
    makerTokenAddress: string
    takerTokenAddress: string
    feeRecipient: string
    makerTokenAmount: string
    takerTokenAmount: string
    makerFee: string
    takerFee: string
    expirationUnixTimestampSec: string
    salt: string
    ecSignature: IEcSignature
}

export interface IEcSignature {
    v: number
    r: string
    s: string
}
