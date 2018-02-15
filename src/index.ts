import { Lendroid } from './lendroid'
import { TokenAddress, TokenSymbol } from './constants/tokens'
import has = Reflect.has


const lendroid = new Lendroid({
    deployedConstants: { walletAddress: '0x04Ad601827AabD2259a6F5Ed67978401aEDF3cBE' }
})

// lendroid.approveWalletForTransfer(100, TokenAddress.WETH)
// lendroid.depositFunds(3, TokenSymbol.WETH)
//lendroid.getWithdrawableBalance(TokenAddress.WETH).then(console.log)
// lendroid.getCashBalance(TokenAddress.WETH).then(console.log)
lendroid.commitFunds(0.5, TokenSymbol.WETH)
    .then(() => lendroid.getCashBalance(TokenAddress.WETH))
    .then(console.log)

//     .then(() => lendroid.depositFunds(90, TokenSymbol.WETH))
//     .then(() => lendroid.getWithdrawableBalance(TokenAddress.WETH))
//     .then(() => )
//

