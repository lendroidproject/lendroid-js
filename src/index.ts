import { Lendroid } from './lendroid'
import { IZeroExOrder } from './types/0x-order'
import { ILoanOfferWithSignature } from './types/loan-offer'
import { TokenAddress } from './constants/tokens'


const lendroid = new Lendroid({
    deployedConstants: { walletAddress: '0x04Ad601827AabD2259a6F5Ed67978401aEDF3cBE' }
})

const offer: ILoanOfferWithSignature = {
    ecSignature: "0x923781e8caa4946f81527504ecc54853ca8ac0a8d0160689058ef7f39187160602f131a9a0121e0af61401609827ca4f5c7492a0cb03db76bc371b89ea9915711c",
    lenderAddress: "0x00a329c0648769a73afac7f9381e08fb43dbea72",
    loanCostTokenAddress: "0xcfa55B9B5C1c05e81A7f306a841AE6F3b489d057",
    loanCostTokenAmount: "0.5",
    loanCostTokenSymbol: "OMG",
    loanInterestTokenAddress: "0xcfa55B9B5C1c05e81A7f306a841AE6F3b489d057",
    loanInterestTokenAmount: "0.1",
    loanInterestTokenSymbol: "OMG",
    loanTokenAddress: "0x731a10897d267e19b34503ad902d0a29173ba4b1",
    loanTokenAmount: "1",
    loanTokenSymbol: "WETH",
    market: "WETH/OMG",
    wranglerAddress: "0x00a329c0648769a73afac7f9381e08fb43dbea72"
}

const order = {
    "maker": "0x00a329c0648769a73afac7f9381e08fb43dbea72",
    "taker": "0x0000000000000000000000000000000000000000",
    "feeRecipient": "0x0000000000000000000000000000000000000000",
    "makerTokenAddress": "0x731a10897d267e19b34503ad902d0a29173ba4b1",
    "takerTokenAddress": "0xcfa55b9b5c1c05e81a7f306a841ae6f3b489d057",
    "exchangeContractAddress": "0x6ec4905ff2bfbb1ee8f4c11006ef528df4d30b80",
    "salt": "88260982204005",
    "makerFee": "0",
    "takerFee": "0",
    "makerTokenAmount": "1",
    "takerTokenAmount": "0.5",
    "expirationUnixTimestampSec": "1550311419841",
    "ecSignature": "0x923781e8caa4946f81527504ecc54853ca8ac0a8d0160689058ef7f39187160602f131a9a0121e0af61401609827ca4f5c7492a0cb03db76bc371b89ea9915711c"
}

lendroid.openMarginTradingPosition(offer, order, 0)
// lendroid.createOrder(TokenAddress.WETH, TokenAddress.OMG, 1, 0.5)
//lendroid.createLoanOffer('WETH', 100, 10, 'OMG', 0.01, '0x731a10897d267e19B34503aD902d0A29173Ba4B1')

// lendroid.approveWalletForTransfer(100, TokenAddress.WETH)
// lendroid.depositFunds(3, TokenSymbol.WETH)
//lendroid.getWithdrawableBalance(TokenAddress.WETH).then(console.log)
// lendroid.getCashBalance(TokenAddress.WETH).then(console.log)
// lendroid.depositFunds(1, TokenSymbol.WETH)
// lendroid.commitFunds(0.5, TokenSymbol.WETH)
//     .then(() => lendroid.getCashBalance(TokenAddress.WETH))
//     .then(console.log)

//     .then(() => lendroid.depositFunds(90, TokenSymbol.WETH))
//     .then(() => lendroid.getWithdrawableBalance(TokenAddress.WETH))
//     .then(() => )
//

