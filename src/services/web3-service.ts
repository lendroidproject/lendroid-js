import * as t from 'web3/types'
import Web3 = require("web3")
import { Context, Logger } from './logger'
import { Contract } from 'web3/types'
import { getWalletAbi, walletAddress } from '../constants/deployed-constants'

export class Web3Service {

    private web3
    // @ts-ignore
    private walletContract: Contract

    constructor(provider: t.Provider | string) {
        if (!provider || (typeof provider === 'string' && !(provider.includes('localhost:') || provider.includes('127.0.0.1:')))) {
            Logger.info(Context.WEBPACK, `message=Invalid Web3 provider, provider=${provider}`)
            throw new Error('Invalid Web3 provider')
        } else {
            // @ts-ignore
            this.web3 = new Web3(provider)
            Logger.info(Context.WEBPACK, `message=Successfully connected`)
        }
    }

    get Web3() {
        if (!this.web3) {
            Logger.error(Context.WEB3, 'message=Web3 not defined')
        }
        return this.web3
    }

    /**
     * Obtains the user's account address
     */
    public async userAccount(): Promise<string> {
        try {
            return (await this.web3.eth.getAccounts())[0]
        } catch (error) {
            Logger.error(Context.WEB3, `message=Error retrieving user account, error=${error}`)
            throw Error(error)
        }
    }

    /**
     * Initializes the wallet contract if undefined and returns it
     */
    public async getWalletContract(): Promise<Contract> {
        if (!this.walletContract) {
            try {
                this.walletContract = new this.web3.eth.Contract(await getWalletAbi(), walletAddress)
            } catch (error) {
                Logger.error(Context.WEB3, `message=Error retrieving user account, error=${error}`)
                throw Error(error)
            }
        }
       return this.walletContract
    }
}
