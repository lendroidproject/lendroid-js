import { Lendroid } from './lendroid'
import { TokenAddress, TokenSymbol } from './constants/tokens'
import has = Reflect.has


const lendroid = new Lendroid({
    apiEndpoint: 'https://requestb.in/167t2u11',
    deployedConstants: { walletAddress: '0xaecf50f01a8002ab8d34bbd83a5da60ca2e0203d' }
})

// lendroid.getWithdrawableBalance(TokenAddress.OMG).then(console.log)

lendroid.depositFunds(500, TokenSymbol.OMG).then(() => {
    lendroid.commitFunds(500, TokenSymbol.OMG).then(() => {
        lendroid.getCashBalance(TokenAddress.OMG).then(console.log)
    })
})


// lendroid.getWithdrawableBalance(TokenAddress.OMG).then(console.log)
//
// lendroid.depositFunds(55, TokenSymbol.OMG).then(() => {
//     lendroid.getWithdrawableBalance(TokenAddress.OMG).then(console.log)
// })

// lendroid.getApproval(TokenAddress.ETH).then(hash => console.log('TRANSACTION', hash))
//     .then(() => {
//         setTimeout(() => {
//             lendroid.depositFunds(123, TokenSymbol.ETH)
//                 .then(console.log)
//         }, 5000)
//     })
