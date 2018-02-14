import { TokenAddress, TokenSymbol } from './constants/tokens'
import { Context, Logger } from './services/logger'
import { Web3Service } from './services/web3-service'
import { Contract } from 'web3/types'
import { DeployedConstants, IDeployConstantInitParams } from './constants/deployed-constants'
import * as t from 'web3/types'
import { ITransactionResponse } from './types/transaction-response'
import 'isomorphic-fetch'
import { ILoanOffer, ILoanOfferWithSignature } from './types/loan-offer'
import * as moment from 'moment'
import { extractR, extractS, extractV, toBigNumber } from './services/utils'
import { IZeroExOrder } from './types/0x-order'
import * as axios from 'axios'

export interface ILendroidInitParams {
    // Endpoint of local or remote backend server for order related calls
    apiEndpoint?: string
    // Web3 provider or local http link to node
    provider?: t.Provider | string
    // Parameters to initialize deployed contract details
    deployedConstants?: IDeployConstantInitParams
}

/**
 * Entry-point for external calls. All function calls should go through this class
 * Exposes internal Web3 module for direct method calls
 * TODO: Break up into sub-domains
 */
export class Lendroid {

    private API_ENDPOINT: string
    private web3Service: Web3Service
    private _deployedConstants: DeployedConstants

    constructor(params: ILendroidInitParams) {
        this._deployedConstants = new DeployedConstants(params.deployedConstants || {})
        this.API_ENDPOINT = params.apiEndpoint || 'http://localhost:8080/offers'

        if (params.provider) {
            // User-provided Web3 provider
            this.web3Service = new Web3Service(params.provider, this._deployedConstants)
        } else {
            // Attempting to load Metamask
            this.web3Service = new Web3Service((window as any).web3.currentProvider, this._deployedConstants)
        }
    }

    /**
     *
     */
    public async createLoanOffer(loanTokenSymbol: string, loanTokenAmount: number, loanCostTokenAmount: number, loanCostTokenSymbol: string,
                                 loanInterestTokenAmount: number, wranglerAddress: string): Promise<void> {
        if (!loanTokenSymbol || !loanCostTokenSymbol) {
            Logger.error(Context.CREATE_LOAN_OFFER, `message=Undefined token(s), loanToken=${loanTokenSymbol}, quoteToken=${loanCostTokenSymbol}`)
            return Promise.reject('')
        }

        loanTokenSymbol = loanTokenSymbol.toUpperCase()
        loanCostTokenSymbol = loanCostTokenSymbol.toUpperCase()

        // Validating params
        if (!TokenSymbol[loanTokenSymbol] || !TokenSymbol[loanCostTokenSymbol]) {
            Logger.error(Context.CREATE_LOAN_OFFER, `message=Invalid token(s), loanToken=${loanTokenSymbol}, quoteToken=${loanCostTokenSymbol}`)
            return Promise.reject('')
        } else if (!loanTokenAmount) {
            Logger.error(Context.CREATE_LOAN_OFFER, `message=Invalid loan amount, amount=${loanTokenAmount}`)
            return Promise.reject('')
        } else if (loanCostTokenAmount === undefined) {
            Logger.error(Context.CREATE_LOAN_OFFER, `message=Undefined loan cost`)
            return Promise.reject('')
        }

        // Building loan offer to generate signature
        const loanOfferToSign: ILoanOffer = {
            lenderAddress: await this.web3Service.userAccount(),
            market: `${loanTokenSymbol}/${loanCostTokenSymbol}`,
            loanTokenAddress: TokenAddress[loanTokenSymbol],
            loanTokenAmount: toBigNumber(loanTokenAmount),
            loanTokenSymbol,
            loanCostTokenAddress: TokenAddress[loanCostTokenSymbol],
            loanCostTokenAmount: toBigNumber(loanCostTokenAmount),
            loanCostTokenSymbol,
            loanInterestTokenAddress: TokenAddress[loanCostTokenSymbol],
            loanInterestTokenAmount: toBigNumber(loanInterestTokenAmount),
            loanInterestTokenSymbol: loanCostTokenSymbol,
            wranglerAddress
        }

        // Generating signature
        const ecSignature: string = await this.web3Service.signLoanOffer(loanOfferToSign)
        // Building loan offer to POST
        const loanOfferToSend: ILoanOfferWithSignature = { ...loanOfferToSign, ecSignature }

        // TODO: Address CORS
        // @ts-ignore
        return axios.post(this.API_ENDPOINT, loanOfferToSend)
        // .then(response => response.json())
            .then(response => Logger.info(Context.CREATE_LOAN_OFFER, `message=Successfully created loan offer, response=${response}`))
            .catch(error => Logger.error(Context.CREATE_LOAN_OFFER, `message=An error occurred while creating loan offer, error=${error}`))
    }

    /**
     * Fetches available loan offers from server
     */
    public getLoanOffers(): Promise<ILoanOfferWithSignature []> {
        return fetch(this.API_ENDPOINT)
            .then(response => response.json())
            .catch(error => {
                Logger.error(Context.GET_LOAN_OFFERS, `message=An error occurred, error=${error}`)
                return []
            })
    }

    /**
     * Deposits @param amount of @param token from the user's account to the
     * Wallet Smart Contract
     * @returns Transaction hash
     */
    public async depositFunds(amount: number, token: string): Promise<string> {
        Logger.log(Context.DEPOSIT_FUNDS, `message=Depositing ${amount} for ${token}`)
        if (amount <= 0 || !token) {
            Logger.error(Context.DEPOSIT_FUNDS, `message=Invalid params, amount=${amount}, token=${token}`)
            return Promise.reject('Invalid params')
        }

        token = token.toUpperCase()

        if (!TokenAddress[token]) {
            Logger.error(Context.DEPOSIT_FUNDS, `message=Invalid token, token=${token}`)
            return Promise.reject('Invalid token')
        } else if (!TokenSymbol[token]) {
            Logger.error(Context.DEPOSIT_FUNDS, `message=Invalid token, token=${token}`)
            return Promise.reject('Invalid token')
        }

        const contract: Contract = await this.web3Service.walletContract()
        return this.transactionResponseHandler(
            contract.methods.deposit(TokenAddress[token], amount).send({
                from: await this.web3Service.userAccount(),
                gas: 47188,
                gasPrice: '1238888888'
            }), Context.DEPOSIT_FUNDS)
    }

    /**
     * Commits @param amount of funds of @param token from the user's deposited balance (will error out if amount > deposited funds)
     * TODO: Test amount > deposited funds
     * @returns Transaction hash
     */
    public async commitFunds(amount: number, token: string): Promise<string> {
        Logger.log(Context.COMMIT_FUNDS, `message=Committing ${amount} for ${token}`)

        if (amount <= 0 || !token) {
            Logger.error(Context.COMMIT_FUNDS, `message=Invalid params, amount=${amount}, token=${token}`)
            return Promise.reject('Invalid amount')
        } else if (!TokenSymbol[token]) {
            Logger.error(Context.COMMIT_FUNDS, `message=Invalid token, token= ${token}`)
            return Promise.reject('Invalid token')
        }

        const contract: Contract = await this.web3Service.walletContract()
        return this.transactionResponseHandler(
            contract.methods.commitFunds(this._deployedConstants.getWethAddress(), amount).send({
                from: await this.web3Service.userAccount(),
                gas: 4712388,
                gasPrice: '12388',
                value: 50
            }), Context.COMMIT_FUNDS)
    }

    public async getApproval(tokenAddress: string): Promise<string> {
        if (!tokenAddress || !this.Web3.utils.isHex(tokenAddress)) {
            Logger.error(Context.GET_APPROVAL, `message=Invalid token address, tokenAddress= ${tokenAddress}`)
            return Promise.reject('Invalid token address')
        }

        const contract = await this.web3Service.ERC20Contract(tokenAddress)
        return this.transactionResponseHandler(
            contract.methods.approve(this._deployedConstants.getWalletAddress(), await this.web3Service.getUserBalance(tokenAddress))
                .send({
                    from: await this.web3Service.userAccount(),
                    gas: 4712388,
                    gasPrice: '12388'
                }),
            Context.GET_APPROVAL)
    }

    /**
     * Helper method to handle a transaction response
     * @returns Transaction hash
     */
    private transactionResponseHandler(promise: Promise<ITransactionResponse>, loggerContext: Context): Promise<string> {
        return promise.then(async response => {
            if (!response || !response.transactionHash) {
                Logger.error(loggerContext, 'message=Unknown error occurred during transaction')
                return Promise.reject('An error occurred')
            }

            Logger.info(loggerContext, `message=Transaction processed, transactionHash=${response.transactionHash}`)
            this.printTransactionSuccess(response.transactionHash, loggerContext)
            return Promise.resolve(response.transactionHash)
        }).catch(error => {
            Logger.error(loggerContext, `message= An error occurred, error=${error}`)
            return Promise.reject(error)
        })
    }

    /**
     * Checks the network for 20 seconds at half second intervals for a successful receipt of a transaction
     * (The average transaction time on Mainnet is ~20 seconds)
     * Stops checking on first successful transaction receipt
     */
    private printTransactionSuccess(transactionHash: string, loggerContext: Context): void {
        const onSuccess = () => Logger.info(loggerContext, `message=Transaction successful, transactionHash=${transactionHash}`)
        const onFailure = () => Logger.error(loggerContext, `message=Transaction success could not be detected, most likely still mining, transactionHash=${transactionHash}`)

        this.ensureTransactionSuccess(transactionHash, loggerContext, onSuccess)
    }

    /**
     * Polls the network for 20 seconds at half second intervals
     * Runs @param successFunction (if defined) on transaction receipt success
     * Runs @param failureFunction (if defined) on no transaction success after 20 seconds
     * @return Resolved Promise on transaction receipt success, rejected Promise on failure
     */
    public ensureTransactionSuccess(transactionHash: string, loggerContext: Context, successFunction?: () => void, failureFunction?: () => void): Promise<void> {
        let numTries = 0
        const timeoutMilliseconds = 500
        const transactionTimeMilliseconds = 20000
        const maxTries = transactionTimeMilliseconds / timeoutMilliseconds

        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                this.web3Service.Web3.eth.getTransactionReceipt(transactionHash)
                    .then(receipt => {
                        if (receipt.status === 1) {
                            if (successFunction) {
                                successFunction()
                            }
                            resolve()
                            clearInterval(timer)
                        } else if (++numTries === maxTries) {
                            if (failureFunction) {
                                failureFunction()
                            }
                            reject('')
                            clearInterval(timer)
                        }
                    })
            }, timeoutMilliseconds)
        })
    }


    /**
     * Helper method to handle a balance query response
     */
    private balanceResponseHandler(promise: Promise<number>, loggerContext: Context): Promise<number> {
        return promise.catch(error => {
            Logger.error(loggerContext, `message = An error occurred while fetching balance, error = ${JSON.stringify(error)}`)
            return Promise.reject(error)
        })
    }

    /**
     * orderAddresses index order: 0:lender, 1:trader, 2:lenderToken, 3:traderToken, 4:wranglerAddress
     * orderValues index order: 0:makerTokenAmount, 1:takerTokenAmount, 2:lenderFee, 3:traderFee, 4:expirationTimeStampInSec, 5:salt
     * offerValues index order: 0: loanQuantity, 1:loanCostTokenAmount,
     * @returns Transaction hash
     */
    public async openMarginTradingPosition(offer: ILoanOfferWithSignature, order: IZeroExOrder, fillTakerTokenAmount: number, traderToken: string = TokenSymbol.ETH, wranglerAddress: string = ''): Promise<string> {
        const orderAddresses: string [] = []
        const orderValues: string [] = []
        const offerValues: string [] = []
        const secondsInDay = 86400
        const expiryDate = moment.utc().add(1, 'day').format('DD-MMM-YYYY')
        const v = extractV(offer.ecSignature)
        const r = extractR(offer.ecSignature)
        const s = extractS(offer.ecSignature)

        orderAddresses[0] = offer.lenderAddress
        orderAddresses[1] = await this.web3Service.userAccount()
        orderAddresses[2] = TokenAddress[offer.loanTokenSymbol]
        orderAddresses[3] = traderToken
        orderAddresses[4] = wranglerAddress

        orderValues[0] = order.makerTokenAmount
        orderValues[1] = order.takerTokenAmount
        orderValues[2] = order.makerFee
        orderValues[3] = order.takerFee
        orderValues[4] = order.expirationUnixTimestampSec
        orderValues[5] = order.salt


        // orderValues[0] = offer.loanQuantity
        // orderValues[1] = offer.loanCostTokenAmount
        // orderValues[2] = 100
        // // TODO: Where does the trader fee come from?
        // orderValues[3] = 0
        // orderValues[4] = secondsInDay
        // // TODO: Generate secure salt
        // orderValues[5] = 2134087123412

        const contract: Contract = await this.web3Service.positionManagerContract()
        return this.transactionResponseHandler
        (contract.methods.openPosition(orderAddresses, orderValues, v, r, s, expiryDate, offer.market, offer.ecSignature, fillTakerTokenAmount)
            .send({
                from: await this.web3Service.userAccount(),
                gas: 4712388,
                gasPrice: '12388',
                value: 50
            }), Context.WEB3)
    }


    /**
     * Retrieves the user's total balance committed for trading or lending
     */
    public async getCashBalance(token: TokenAddress): Promise<number> {
        const contract: Contract = await this.web3Service.walletContract()
        return this.balanceResponseHandler(contract.methods.getCashBalance(token).call({ from: await this.web3Service.userAccount() }), Context.GET_CASH_BALANCE)
    }

    /**
     * Retrieves a trader's locked balance on a position or a lender's locked balance in a loan
     */
    public async getLockedBalance(token: TokenAddress): Promise<number> {
        const contract: Contract = await this.web3Service.walletContract()
        return this.balanceResponseHandler(contract.methods.getLockedBalance(token).call({ from: await this.web3Service.userAccount() }), Context.GET_LOCKED_BALANCE)
    }

    /**
     * Retrieves a trader's position balance
     */
    public async getPositionBalance(token: TokenAddress): Promise<number> {
        const contract: Contract = await this.web3Service.walletContract()
        return this.balanceResponseHandler(contract.methods.getPositionBalance(token).call({ from: await this.web3Service.userAccount() }), Context.GET_POSITION_BALANCE)
    }

    /**
     * Retrieves the user's total withdrawable balance that has not been committed for lending/trading or is not locked in a loan/trade
     */
    public async getWithdrawableBalance(token: TokenAddress): Promise<number> {
        const contract: Contract = await this.web3Service.walletContract()
        return this.balanceResponseHandler(contract.methods.getWithdrawableBalance(token).call({ from: await this.web3Service.userAccount() }), Context.GET_WITHDRAWABLE_BALANCE)
        // const contract = this._eth.contract(await this._deployedConstants.getWalletAbi()).at(this._deployedConstants.getWalletAddress())
        // return contract.getWithdrawableBalance(token)
    }


    /**
     * Exposes the internal Web3 module
     */
    get Web3() {
        return this.web3Service.Web3
    }

    /**
     * Exposes the service that handles constants such as Wallet address
     */
    get deployedConstants(): DeployedConstants {
        return this._deployedConstants
    }

    /**
     * Returns all tokens supported by the platform
     */
    public getTokenNames(): string [] {
        const names: string [] = []
        for (let token in TokenSymbol) {
            names.push(token)
        }
        return names
    }

    /**
     * Returns address associated with @param token
     */
    public getTokenAddress(token: string): string {
        return token ? TokenAddress[token.toUpperCase()] : ''
    }
}
