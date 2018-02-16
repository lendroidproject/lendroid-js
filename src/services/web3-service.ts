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
    private _deployedConstants: DeployedConstants

    constructor(provider: t.Provider | string, deployedContants: DeployedConstants) {
        if (!provider || (typeof provider === 'string' && !(provider.includes('localhost:') || provider.includes('127.0.0.1:')))) {
            Logger.info(Context.WEB3, `message=Invalid Web3 provider, provider=${provider}`)
            throw new Error('Invalid Web3 provider')
        } else {
            // @ts-ignore
            this._web3 = new Web3(provider)
            Logger.info(Context.WEB3, `message=Successfully connected`)
        }
        this._deployedConstants = deployedContants
    }

    // TODO: Deprecate
    get deployedConstants(): DeployedConstants {
        return this._deployedConstants;
    }

    get Web3(): Web3.default {
        if (!this._web3) {
            Logger.error(Context.WEB3, 'message=Web3 not defined')
        }
        return this._web3
    }

    public async userAccount(): Promise<string> {
        if (!this._userAccount) {
            try {
                this._userAccount = (await this._web3.eth.getAccounts())[0].toLowerCase()
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
                return this._walletContract
            } catch (error) {
                Logger.error(Context.WEB3, `message=Error creating wallet contract instance, error=${error}`)
                throw Error(error)
            }
        }
        return this._walletContract
    }

    /**
     * Returns an ERC20 Contract instance
     */
    public async ERC20Contract(tokenAddress: string): Promise<Contract> {
        try {
            return new this._web3.eth.Contract(await this.deployedConstants.getERC20Abi(), tokenAddress)
        } catch (error) {
            Logger.error(Context.WEB3, `message=Error creating ERC20 contract instance, error=${error}, tokenAddress=${tokenAddress}`)
            throw Error(error)
        }
    }

    /**
     * Signs a loan offer and generates a signature with @param loanOffer
     */
    public async signLoanOffer(loanOffer: any): Promise<string> {
        return this._web3.eth.personal.sign(JSON.stringify(loanOffer), this._userAccount)
            .catch(error => {
                Logger.error(Context.SIGN_LOAN_OFFER, `message=An error occurred, error=${error}`)
                throw Error(error)
            })
    }

    /**
     * Gets a user's balance in the ERC20 token at @param tokenAddress
     */
    public async getUserBalance(tokenAddress: string): Promise<number> {
        const contract = await this.ERC20Contract(tokenAddress)
        return contract.methods.balanceOf(await this.userAccount()).call({
            from: await this.userAccount()
        })
    }

    // TODO: Document and refactor
    public async addBalanceToERC20Token(tokenAddress: string): Promise<void> {
        const contract = await this.ERC20Contract(tokenAddress)
        const account = await this.userAccount()

        return contract.methods.deposit().send({
            from: account,
            value: 50000
        })
    }

    // TODO: Document and refactor
    public async transferToERC20Token(tokenAddress: string, amount: number): Promise<void> {
        const contract = await this.ERC20Contract(tokenAddress)

    }

    // TODO: Document and refactor
    public async getERC20Balance(tokenAddress: string): Promise<number> {
        const contract = await this.ERC20Contract(tokenAddress)
        const account = await this.userAccount()

        return this.Web3.eth.getBalance(tokenAddress)
    }
}
