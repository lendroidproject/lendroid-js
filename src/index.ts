import { Lendroid } from './lendroid'
import { TokenSymbol } from './constants/tokens'


const lendroid = new Lendroid({ deployedConstants: { walletAddress: '', wethAddress: ''}})
lendroid.depositFunds(55, TokenSymbol.ETH)
    .catch()