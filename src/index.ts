import { Lendroid } from './lendroid'
import { TokenName } from './constants/tokens'


const lendroid = new Lendroid({})
lendroid.depositFunds(55, TokenName.ETH)
    .catch()