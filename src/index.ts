import { Lendroid } from './lendroid'
import { TokenAddress, TokenSymbol } from './constants/tokens'


const lendroid = new Lendroid({
    apiEndpoint: 'http://localhost:8080/offers',
    deployedConstants: { walletAddress: '0xa427a5db55b92123b669ed65b4f7bd178142cef7' }
})

lendroid.getApproval(TokenAddress.ETH).then(hash => console.log('TRANSACTION', hash))
    .then(() => {
        setTimeout(() => {
            lendroid.depositFunds(123, TokenSymbol.ETH)
                .then(console.log)
        }, 5000)
    })
