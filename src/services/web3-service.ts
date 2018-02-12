import * as t from 'web3/types'
import Web3 = require("web3")
import { Context, Logger } from './logger'
import { Contract } from 'web3/types'
import { ILoanOffer } from '../types/loan-offer'
import { DeployedConstants } from '../constants/deployed-constants'

/**
 * Provides functionality that requires access to Web3. Also exposes the Web3 object for running built-in functions
 */
export class Web3Service {

    private _web3
    private _walletContract: Contract
    private _userAccount: string
    private deployedConstants: DeployedConstants

    constructor(provider: t.Provider | string, deployedContants: DeployedConstants) {
        if (!provider || (typeof provider === 'string' && !(provider.includes('localhost:') || provider.includes('127.0.0.1:')))) {
            Logger.info(Context.WEB3, `message=Invalid Web3 provider, provider=${provider}`)
            throw new Error('Invalid Web3 provider')
        } else {
            // @ts-ignore
            this._web3 = new Web3(provider)
            Logger.info(Context.WEB3, `message=Successfully connected`)
        }
        this.deployedConstants = deployedContants
    }

    get Web3() {
        if (!this._web3) {
            Logger.error(Context.WEB3, 'message=Web3 not defined')
        }
        return this._web3
    }

    public async userAccount(): Promise<string> {
        if (!this._userAccount) {
            try {
                this._userAccount = (await this._web3.eth.getAccounts())[0]
            } catch (error) {
                Logger.error(Context.WEB3, `message=Error retrieving user account, error=${error}`)
                throw Error(error)
            }
        }
        return this._userAccount
    }


    /**
     * Initializes the wallet contract if undefined and returns it
     */
    public async walletContract(): Promise<Contract> {
        if (!this._walletContract) {
            try {
                this._walletContract = new this._web3.eth.Contract(await this.deployedConstants.getWalletAbi(), this.deployedConstants.getWalletAddress())
            } catch (error) {
                Logger.error(Context.WEB3, `message=Error creating wallet object, error=${error}`)
                throw Error(error)
            }
        }
        return this._walletContract
    }

    /**
     * Returns a PositionManager Contract object
     */
    public async positionManagerContract(): Promise<Contract> {
        try {
            return new this._web3.eth.Contract(await this.deployedConstants.getPositionManagerAbi(), this.deployedConstants.getWalletAddress())
        } catch (error) {
            Logger.error(Context.WEB3, `message=Error creating wallet object, error=${error}`)
            throw Error(error)
        }
    }

    /**
     * Signs a loan offer and generates a signature with @param loanOffer
     */
    public async signLoanOffer(loanOffer: ILoanOffer): Promise<string> {
        return this._web3.eth.personal.sign(JSON.stringify(loanOffer), this._userAccount)
            .catch(error => {
                Logger.error(Context.SIGN_LOAN_OFFER, `message=An error occurred, error=${error}`)
                throw Error(error)
            })
    }
}
