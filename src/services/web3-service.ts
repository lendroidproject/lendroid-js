import * as t from 'web3/types'
import Web3 from 'web3'
import { Context, Logger } from './logger'

export class Web3Service {

    private web3: Web3

    constructor(provider: t.Provider | string) {
        if (!provider || (typeof provider === 'string' && !(provider.includes('localhost:') || provider.includes('127.0.0.1:')))) {
            Logger.info(Context.WEBPACK, `message=Invalid provider, provider=${provider}`)
            throw new Error('Invalid Web3 provider')
        } else {
            this.web3 = new Web3(provider)
            Logger.info(Context.WEBPACK, `message=Connected to ${provider}`)
        }
    }
}
