import { TokenAddress, TokenName } from './constants/tokens'
import { Context, Logger } from './services/logger'
import { Web3Service } from './services/web3-service'
import { Contract } from 'web3/types'
import { wethAddress } from './constants/deployed-constants'
import * as t from 'web3/types'
import { ITransactionResponse } from './types/transaction-response'
import 'isomorphic-fetch'
import { ILoanOffer, ILoanOfferWithSignature } from './types/loan-offer'

/**
 * Initializes the Web3 provider
 */
export const startApp = () => {
    const lendroid = new Lendroid()
    // lendroid.depositFunds(55)
    lendroid.createLoanOffer(TokenName.ETH, 500, 0.12, TokenName.ETH)
}

/**
 * TODO
 */
export class Lendroid {

    private API_ENDPOINT = 'https://requestb.in/106fqgl1'
    // @ts-ignore
    private web3Service = new Web3Service((window as any).web3.currentProvider)

    constructor(apiEndpoint?, provider?: t.Provider | string) {
        if (provider) {
            this.web3Service = new Web3Service(provider)
        }

        if (apiEndpoint) {
            this.API_ENDPOINT = apiEndpoint
        }
    }

    /**
     * TODO: Docs
     */
    public async createLoanOffer(loanToken: string, loanQuantity: number, costAmount: number, costToken: string): Promise<void> {

        // Validating params
        if (!TokenName[loanToken] || !TokenName[costToken]) {
            Logger.error(Context.CREATE_LOAN_OFFER, `message=Invalid token(s), makerToken=${loanToken}, takerToken=${costToken}`)
            return Promise.reject('')
        } else if (!loanQuantity) {
            Logger.error(Context.CREATE_LOAN_OFFER, `message=Invalid loan amount, amount=${loanQuantity}`)
            return Promise.reject('')
        } else if (costAmount === undefined) {
            Logger.error(Context.CREATE_LOAN_OFFER, `message=Undefined loan cost`)
            return Promise.reject('')
        }

        // Building loan offer to generate signature
        const loanOfferToSign: ILoanOffer = {
            lenderAddress: await this.web3Service.userAccount(),
            tokenPair: `${loanToken}/${costToken}`,
            loanQuantity,
            loanToken,
            costAmount,
            costToken,
        }

        // Generating signature
        const ecSignature = await this.web3Service.signLoanOffer(loanOfferToSign)
        // Building loan offer to POST
        const loanOfferToSend: ILoanOfferWithSignature = { ...loanOfferToSign, ecSignature }

        // TODO: Address CORS
        return fetch(this.API_ENDPOINT,
            {
                method: 'POST',
                body: JSON.stringify(loanOfferToSend),
                headers: new Headers({ 'Content-Type': 'application/json' }),
                mode: 'no-cors'
            })
            .then(response => response.json())
            .then(response => Logger.info(Context.CREATE_LOAN_OFFER, `message=Successfully created loan offer, response=${response}`))
            .catch(error => Logger.error(Context.CREATE_LOAN_OFFER, `message=An error occurred while creating loan offer, error=${error}`))
    }

    /**
     * Fetches available loan offers from server
     */
    public getLoanOffers(): Promise<ILoanOffer> {
        return fetch(this.API_ENDPOINT)
            .then(response => response.json())
    }

    /**
     * Deposits @param amount of @param token from the user's account to the
     * Wallet Smart Contract
     */
    public async depositFunds(amount: number, token: string = TokenName.OMG): Promise<void> {
        Logger.log(Context.DEPOSIT_FUNDS, `
    message = Depositing
    ${amount}
    for
    ${token}
`)

        if (amount <= 0) {
            Logger.error(Context.DEPOSIT_FUNDS, `
    message = Invalid
    amount
,
    amount = ${amount}`)
            return Promise.reject('Invalid amount')
        } else if (!TokenName[token]) {
            Logger.error(Context.DEPOSIT_FUNDS, `
    message = Invalid
    token
,
    token = ${token}`)
            return Promise.reject('Invalid token')
        }

        const contract: Contract = await this.web3Service.walletContract()

        return this.transactionResponseHandler(
            contract.methods.deposit().send({
                from: await this.web3Service.userAccount(),
                gas: 4712388,
                gasPrice: '12388',
                value: 500
            }), Context.DEPOSIT_FUNDS)
    }

    /**
     * Commits @param amount of funds of @param token from the user's deposited balance (will error out if amount > deposited funds)
     * TODO: Test amount > deposited funds
     */
    public async commitFunds(amount: number, token: string = TokenName.OMG): Promise<void> {
        Logger.log(Context.COMMIT_FUNDS, `
    message = Committing
    ${amount}
    for
    ${token}
`)

        if (amount <= 0) {
            Logger.error(Context.COMMIT_FUNDS, `
    message = Invalid
    amount
,
    amount = ${amount}`)
            return Promise.reject('Invalid amount')
        } else if (!TokenName[token]) {
            Logger.error(Context.COMMIT_FUNDS, `
    message = Invalid
    token
,
    token = ${token}`)
            return Promise.reject('Invalid token')
        }

        const contract: Contract = await this.web3Service.walletContract()

        return this.transactionResponseHandler(
            contract.methods.commitFunds(wethAddress, amount).send({
                from: await this.web3Service.userAccount(),
                gas: 4712388,
                gasPrice: '12388',
                value: 50
            }), Context.COMMIT_FUNDS)
    }

    /**
     * Helper method to handle a transaction response
     */
    private transactionResponseHandler(promise: Promise<ITransactionResponse>, loggerContext: Context): Promise<void> {
        return promise.then(response => {
            if (!response || !response.transactionHash) {
                Logger.error(loggerContext, 'message=Unknown error occurred during transaction')
                return Promise.reject('An error occurred')
            }

            Logger.info(loggerContext, 'message=Transaction succeeded')
            return Promise.resolve()
        }).catch(error => {
            Logger.error(loggerContext, `
    message = An
    error
    occurred
,
    error = ${JSON.stringify(error)}`)
            return Promise.reject(error)
        })
    }

    /**
     * Helper method to handle a balance query response
     */
    private balanceResponseHandler(promise: Promise<number>, loggerContext: Context): Promise<number> {
        return promise
            .catch(error => {
                Logger.error(loggerContext, `
    message = An
    error
    occurred
    while
    fetching
    balance
,
    error = ${JSON.stringify(error)}`)
                return Promise.reject(error)
            })
    }

    // TODO: Stub
    // orderAddresses index order: lender, trader, lenderToken, traderToken, wranglerAddress
    // orderValues index order: lenderTokenAmount, traderTokenAmount, lenderFee, traderFee, expirationTimeStampInSec, salt
    public async openPosition(orderValues: string [], orderAddresses: string [], offerValues: string [], orderV: string,
                              orderRS: string [], offerAddresses: string[]): Promise<void> {
        return Promise.resolve()
    }


    /**
     * Retrieves the user's total balance committed for trading or lending
     */
    public async getCashBalance(token: TokenAddress = TokenAddress.OMG): Promise<number> {
        const contract: Contract = await this.web3Service.walletContract()
        return this.balanceResponseHandler(contract.methods.getCashBalance(token).call({ from: await this.web3Service.userAccount() }), Context.GET_CASH_BALANCE)
    }

    /**
     * Retrieves a trader's locked balance on a position or a lender's locked balance in a loan
     */
    public async getLockedBalance(token: TokenAddress = TokenAddress.OMG): Promise<number> {
        const contract: Contract = await this.web3Service.walletContract()
        return this.balanceResponseHandler(contract.methods.getLockedBalance(token).call({ from: await this.web3Service.userAccount() }), Context.GET_LOCKED_BALANCE)
    }

    /**
     * Retrieves a trader's position balance
     */
    public async getPositionBalance(token: TokenAddress = TokenAddress.OMG): Promise<number> {
        const contract: Contract = await this.web3Service.walletContract()
        return this.balanceResponseHandler(contract.methods.getPositionBalance(token).call({ from: await this.web3Service.userAccount() }), Context.GET_POSITION_BALANCE)
    }

    /**
     * Retrieves the user's total withdrawable balance that has not been committed for lending/trading or is not locked in a loan/trade
     */
    public async getWithdrawableBalance(token: TokenAddress = TokenAddress.OMG) {
        const contract: Contract = await this.web3Service.walletContract()
        return this.balanceResponseHandler(contract.methods.getBalance(token).call({ from: await this.web3Service.userAccount() }), Context.GET_WITHDRAWABLE_BALANCE)
    }
}

export const lendroid = new Lendroid()
