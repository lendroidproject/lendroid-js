import * as t from 'web3/types'
import Web3 = require("web3")
import { Context, Logger } from './logger'

export class Web3Service {

    // @ts-ignore
    private web3

    constructor(provider: t.Provider | string) {
        if (!provider || (typeof provider === 'string' && !(provider.includes('localhost:') || provider.includes('127.0.0.1:')))) {
            Logger.info(Context.WEBPACK, `message=Invalid provider, provider=${provider}`)
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
}
