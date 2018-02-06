import Web3 = require("web3")
import * as t from 'web3/types'
import { Token } from './constants/tokens'
import { Context, Logger } from './services/logger'
import { Contract } from 'web3/types'
import { getWalletAbi, walletAddress } from './constants/deployed-constants'

/**
 * Initializes the Web3 provider
 */
export const startApp = () => {
    // @ts-ignore
    this.web3 = new Web3(web3.currentProvider)
    this.web3.eth.getAccounts().then(console.log)
}

/**
 * TODO
 */
export class Lendroid {

    private web3

    constructor(provider?: t.Provider | string) {
        if (typeof provider === 'string' && !(provider.includes('localhost:') || provider.includes('127.0.0.1:'))) {
            throw new Error('Invalid provider')
        } else if (provider) {
            // @ts-ignore
            this.web3 = new Web3(provider)
        }
    }

    public deposit(amount: number, token: Token = Token.OMG): boolean {
        if (amount <= 0) {
            Logger.error(Context.DEPOSIT_FUNDS, `message=Invalid amount, amount=${amount}`)
            return false
        }

        const contract: Contract = this.web3.eth.Contract(getWalletAbi, walletAddress)
        contract.methods.deposit().send({})
        return true
    }
}

export const lendroid = new Lendroid()
