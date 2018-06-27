import { BigNumber } from '@0xproject/utils'
import * as axios from 'axios'
import 'isomorphic-fetch'
import * as moment from 'moment'
import { Contract } from 'web3/types'
import * as t from 'web3/types'
import { ZeroEx, Order } from '0x.js'
import { ITransactionResponse } from './types/transaction-response'
import { ILoanOffer, ILoanOfferWithSignature } from './types/loan-offer'
import { IZeroExOrder } from './types/0x-order'

import * as Constants from './constants'
import * as Services from './services'
// tslint:disable
const Web3 = require('web3')
// tslint:enable
const {
  Context, Logger, // Logger
  extractR, extractS, extractV, toBigNumber, // Utils
} = Services
console.log(Constants, Services)
console.log(new Web3())

export interface ILendroidInitParams {
  // Endpoint of local or remote backend server for order related calls
  apiEndpoint?: string
  // Web3 provider or local http link to node
  provider?: t.Provider | string
  // Parameters to initialize deployed contract details
  // deployedConstants?: IDeployConstantInitParams
}

// Reflects the status of a position balance stored in Wallet.positionBalance
export enum PositionStatus {
  Positive = 'POSITIVE',
  Negative = 'NEGATIVE'
}

/**
 * Entry-point for external calls. All function calls should go through this class
 * Exposes internal Web3 module for direct method calls
 * TODO: Break up into sub-domains
 */
export class Lendroid {

  // private DECIMALS = 18
  // private API_ENDPOINT: string
  // private _web3Service: Web3Service
  // private _deployedConstants: DeployedConstants
  // public zeroEx: ZeroEx

  constructor(params: ILendroidInitParams) {
  //   this._deployedConstants = new DeployedConstants(params.deployedConstants || {})
  //   this.API_ENDPOINT = params.apiEndpoint || 'http://localhost:8080'

  //   if (params.provider) {
  //     // User-provided Web3 provider
  //     this._web3Service = new Web3Service(params.provider, this._deployedConstants)
  //   } else {
  //     // Attempting to load Metamask
  //     try {
  //       this._web3Service = new Web3Service((window as any).web3.currentProvider, this._deployedConstants)
  //       this.zeroEx = new ZeroEx((window as any).web3.currentProvider, { networkId: 100 })
  //     } catch (e) {
  //       alert('Please ensure that you are logged in to Metamask')
  //     }
  //   }

  //   this.setWalletNetworkParameters(params.deployedConstants ? params.deployedConstants.networkParamsAddress : undefined)
  }

  // public async createOrder(makerTokenAddress: string, takerTokenAddress: string, makerTokenAmount: number, takerTokenAmount: number) {
  //   const order: Order = {
  //     maker: await this._web3Service.userAccount(),
  //     taker: ZeroEx.NULL_ADDRESS,
  //     feeRecipient: ZeroEx.NULL_ADDRESS,
  //     makerTokenAddress: makerTokenAddress.toLowerCase(),
  //     takerTokenAddress: takerTokenAddress.toLowerCase(),
  //     exchangeContractAddress: this._deployedConstants.getExchangeAddress(),
  //     salt: ZeroEx.generatePseudoRandomSalt(),
  //     makerFee: new BigNumber(0),
  //     takerFee: new BigNumber(0),
  //     makerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(makerTokenAmount), this.DECIMALS),
  //     takerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(takerTokenAmount), this.DECIMALS),
  //     expirationUnixTimestampSec: new BigNumber(Date.now() + (3600000 * 24 * 365))
  //   }

  //   const orderHash = ZeroEx.getOrderHashHex(order)
  //   const ecSignature = await this._web3Service.signLoanOffer(orderHash)

  //   const signedOrder = { ...order, ecSignature }

  //   console.log(JSON.stringify(signedOrder))
  //   // @ts-ignore
  //   return axios.post(`${this.API_ENDPOINT}/orders`, signedOrder)
  //     .then(response => Logger.info(Context.CREATE_ORDER, `message=Successfully created order, response=${JSON.stringify(response)}`))
  //     .catch(error => Logger.error(Context.CREATE_ORDER, `message=An error occurred while creating order, error=${JSON.stringify(error)}`))
  // }

  // public async setWalletNetworkParameters(address: string | undefined): Promise<string> {
  //   if (address) {
  //     const contract: Contract = await this._web3Service.walletContract()
  //     const account = await this._web3Service.userAccount()
  //     return this.transactionResponseHandler(
  //       contract.methods.setLendroidNetworkParameters(address).send({
  //         from: account,
  //         gas: 64393,
  //         gasPrice: '1238888888',
  //       }), Context.DEPOSIT_FUNDS)
  //   }
  //   return Promise.resolve('')
  // }

  // /**
  //  *
  //  */
  // public async createLoanOffer(
  //   loanTokenSymbol: string,
  //   loanTokenAmount: number,
  //   loanCostTokenAmount: number,
  //   loanCostTokenSymbol: string,
  //   loanInterestTokenAmount: number,
  //   wranglerAddress: string
  // ): Promise<void> {
  //   if (!loanTokenSymbol || !loanCostTokenSymbol) {
  //     Logger.error(Context.CREATE_LOAN_OFFER, `message=Undefined token(s), loanToken=${loanTokenSymbol}, quoteToken=${loanCostTokenSymbol}`)
  //     return Promise.reject('')
  //   }

  //   loanTokenSymbol = loanTokenSymbol.toUpperCase()
  //   loanCostTokenSymbol = loanCostTokenSymbol.toUpperCase()

  //   // Validating params
  //   if (!TokenSymbol[loanTokenSymbol] || !TokenSymbol[loanCostTokenSymbol]) {
  //     Logger.error(Context.CREATE_LOAN_OFFER, `message=Invalid token(s), loanToken=${loanTokenSymbol}, quoteToken=${loanCostTokenSymbol}`)
  //     return Promise.reject('')
  //   } else if (!loanTokenAmount) {
  //     Logger.error(Context.CREATE_LOAN_OFFER, `message=Invalid loan amount, amount=${loanTokenAmount}`)
  //     return Promise.reject('')
  //   } else if (loanCostTokenAmount === undefined) {
  //     Logger.error(Context.CREATE_LOAN_OFFER, `message=Undefined loan cost`)
  //     return Promise.reject('')
  //   }

  //   // Building loan offer to generate signature
  //   const loanOfferToSign: ILoanOffer = {
  //     lenderAddress: await this._web3Service.userAccount(),
  //     market: `${loanTokenSymbol}/${loanCostTokenSymbol}`,
  //     loanTokenAddress: TokenAddress[loanTokenSymbol],
  //     loanTokenAmount: toBigNumber(loanTokenAmount),
  //     loanTokenSymbol,
  //     loanCostTokenAddress: TokenAddress[loanCostTokenSymbol],
  //     loanCostTokenAmount: toBigNumber(loanCostTokenAmount),
  //     loanCostTokenSymbol,
  //     loanInterestTokenAddress: TokenAddress[loanCostTokenSymbol],
  //     loanInterestTokenAmount: toBigNumber(loanInterestTokenAmount),
  //     loanInterestTokenSymbol: loanCostTokenSymbol,
  //     wranglerAddress
  //   }

  //   // Generating signature
  //   const ecSignature: string = await this._web3Service.signLoanOffer(loanOfferToSign)
  //   // Building loan offer to POST
  //   const loanOfferToSend: ILoanOfferWithSignature = { ...loanOfferToSign, ecSignature }

  //   // TODO: Address CORS
  //   // @ts-ignore
  //   return axios.post(`${this.API_ENDPOINT}/offers`, loanOfferToSend)
  //     .then(response => Logger.info(Context.CREATE_LOAN_OFFER, `message=Successfully created loan offer, response=${JSON.stringify(response)}`))
  //     .catch(error => Logger.error(Context.CREATE_LOAN_OFFER, `message=An error occurred while creating loan offer, error=${JSON.stringify(error)}`))
  // }

  // /**
  //  * Fetches available loan offers from server
  //  */
  // public getLoanOffers(): Promise<ILoanOfferWithSignature[]> {
  //   return fetch(this.API_ENDPOINT)
  //     .then(response => response.json())
  //     .catch(error => {
  //       Logger.error(Context.GET_LOAN_OFFERS, `message=An error occurred, error=${error}`)
  //       return []
  //     })
  // }

  // /**
  //  * Deposits @param amount of @param tokenSymbol from the user's account to the
  //  * Wallet Smart Contract
  //  * @returns Transaction hash
  //  */
  // public async depositFunds(amount: number, tokenSymbol: string): Promise<string> {
  //   Logger.log(Context.DEPOSIT_FUNDS, `message=Depositing ${amount} for ${tokenSymbol}`)
  //   if (amount <= 0 || !tokenSymbol) {
  //     Logger.error(Context.DEPOSIT_FUNDS, `message=Invalid params, amount=${amount}, token=${tokenSymbol}`)
  //     return Promise.reject('Invalid params')
  //   }

  //   tokenSymbol = tokenSymbol.toUpperCase()

  //   if (!TokenAddress[tokenSymbol]) {
  //     Logger.error(Context.DEPOSIT_FUNDS, `message=Invalid token, token=${tokenSymbol}`)
  //     return Promise.reject('Invalid tokenSymbol')
  //   }

  //   const contract: Contract = await this._web3Service.walletContract()
  //   const account = await this._web3Service.userAccount()
  //   return this.transactionResponseHandler(
  //     contract.methods.depositFunds(TokenAddress[tokenSymbol], toBigNumber(amount)).send({
  //       from: account,
  //       gas: 64393,
  //       gasPrice: '1238888888',
  //     }), Context.DEPOSIT_FUNDS)
  // }

  // /**
  //  * Commits @param amount of funds of @param token from the user's deposited balance (will error out if amount > deposited funds)
  //  * TODO: Test amount > deposited funds
  //  * @returns Transaction hash
  //  */
  // public async commitFunds(amount: number, tokenSymbol: string): Promise<string> {
  //   Logger.log(Context.COMMIT_FUNDS, `message=Committing ${amount} for ${tokenSymbol}`)

  //   if (amount <= 0 || !tokenSymbol) {
  //     Logger.error(Context.COMMIT_FUNDS, `message=Invalid params, amount=${amount}, token=${tokenSymbol}`)
  //     return Promise.reject('Invalid amount')
  //   }

  //   tokenSymbol = tokenSymbol.toUpperCase()

  //   if (!TokenSymbol[tokenSymbol]) {
  //     Logger.error(Context.COMMIT_FUNDS, `message=Invalid token, token= ${tokenSymbol}`)
  //     return Promise.reject('Invalid token')
  //   }

  //   const contract: Contract = await this._web3Service.walletContract()
  //   return this.transactionResponseHandler(
  //     contract.methods.commitFunds(TokenAddress[tokenSymbol], toBigNumber(amount)).send({
  //       from: await this._web3Service.userAccount(),
  //       gas: 64393,
  //       gasPrice: '1238888888'
  //     }), Context.COMMIT_FUNDS)
  // }

  // public async approveWalletForTransfer(amount = 1000, tokenAddress: string): Promise<string> {
  //   if (!tokenAddress || !this.Web3.utils.isHex(tokenAddress)) {
  //     Logger.error(Context.GET_APPROVAL, `message=Invalid token address, tokenAddress= ${tokenAddress}`)
  //     return Promise.reject('Invalid token address')
  //   }

  //   const contract = await this._web3Service.ERC20Contract(tokenAddress)
  //   return this.transactionResponseHandler(
  //     contract.methods.approve(this._deployedConstants.getWalletAddress(), toBigNumber(amount))
  //       .send({
  //         from: await this._web3Service.userAccount(),
  //         gas: 64393,
  //         gasPrice: '1238888888'
  //       }),
  //     Context.GET_APPROVAL)
  // }

  // /**
  //  * Polls the network for 20 seconds at half second intervals
  //  * Runs @param successFunction (if defined) on transaction receipt success
  //  * Runs @param failureFunction (if defined) on no transaction success after 20 seconds
  //  * @return Resolved Promise on transaction receipt success, rejected Promise on failure
  //  */
  // public ensureTransactionSuccess(
  //   transactionHash: string,
  //   loggerContext: Context,
  //   successFunction?: () => void,
  //   failureFunction?: () => void
  // ): Promise<void> {
  //   let numTries = 0
  //   const timeoutMilliseconds = 500
  //   const transactionTimeMilliseconds = 20000
  //   const maxTries = transactionTimeMilliseconds / timeoutMilliseconds

  //   return new Promise(resolve => {
  //     const timer = setInterval(() => {
  //       this._web3Service.Web3.eth.getTransactionReceipt(transactionHash)
  //         .then(receipt => {
  //           if (receipt.status === '1') {
  //             if (successFunction) {
  //               successFunction()
  //             }
  //             resolve()
  //             clearInterval(timer)
  //           } else if (++numTries === maxTries) {
  //             if (failureFunction) {
  //               failureFunction()
  //             }
  //             clearInterval(timer)
  //           }
  //         })
  //     }, timeoutMilliseconds)
  //   })
  // }

  // /**
  //  * orderAddresses index order: 0:lender, 1:trader, 2:lenderToken, 3:traderToken, 4:wranglerAddress
  //  * offerAddresses index order: 0:lender, 1:trader, 2:lenderToken, 3:traderToken
  //  * orderValues index order: 0:makerTokenAmount, 1:takerTokenAmount, 2:lenderFee, 3:traderFee, 4:expirationTimeStampInSec, 5:salt
  //  * offerValues index order: 0: loanCost - interest, 1:loanCostTokenAmount
  //  * loanBytes: 0: _market, 1: _expiration, 2: _loanHash
  //  * @returns Transaction hash
  //  */
  // public async openMarginTradingPosition(offer: ILoanOfferWithSignature, order: IZeroExOrder, fillTakerTokenAmount: number): Promise<string> {
  //   const orderAddresses: string[] = []
  //   const offerAddresses: string[] = []
  //   const orderValues: number[] = []
  //   const offerValues: number[] = []
  //   const loanBytes: string[] = []

  //   const v = extractV(order.ecSignature)
  //   const r = extractR(order.ecSignature)
  //   const s = `0x${extractS(order.ecSignature)}`

  //   orderAddresses[0] = offer.lenderAddress
  //   orderAddresses[1] = order.takerTokenAddress
  //   orderAddresses[2] = offer.loanTokenAddress
  //   orderAddresses[3] = offer.loanCostTokenAddress
  //   orderAddresses[4] = '0x731a10897d267e19B34503aD902d0A29173Ba4B1'

  //   orderValues[0] = parseInt(order.makerTokenAmount, 10)
  //   orderValues[1] = parseInt(order.takerTokenAmount, 10)
  //   orderValues[2] = parseInt(order.takerFee, 10)
  //   orderValues[3] = parseInt(order.makerFee, 10)
  //   orderValues[4] = parseInt(order.expirationUnixTimestampSec, 10)
  //   orderValues[5] = parseInt(order.salt, 10)

  //   offerAddresses[0] = offer.lenderAddress.toLowerCase()
  //   offerAddresses[1] = order.takerTokenAddress.toLowerCase()
  //   offerAddresses[2] = offer.loanTokenAddress.toLowerCase()
  //   offerAddresses[3] = offer.loanCostTokenAddress.toLowerCase()

  //   offerValues[0] = (parseInt(offer.loanTokenAmount, 10) - parseInt(offer.loanInterestTokenAmount, 10))
  //   offerValues[1] = parseInt(offer.loanCostTokenAmount, 10)

  //   const expiryDate = moment.utc().add(1, 'day').format('DD-MMM-YYYY')

  //   loanBytes[0] = this.Web3.utils.asciiToHex(offer.market)
  //   loanBytes[1] = this.Web3.utils.asciiToHex(expiryDate)
  //   // @ts-ignore
  //   loanBytes[2] = ZeroEx.getOrderHashHex(order)

  //   const contract: Contract = await this._web3Service.walletContract()
  //   return this.transactionResponseHandler
  //     (contract.methods.openPosition(orderAddresses, orderValues, offerAddresses, offerValues, v,
  //       [r, s], loanBytes, fillTakerTokenAmount, offer.wranglerAddress)
  //       .send({
  //         from: await this._web3Service.userAccount(),
  //         gas: 64393,
  //         gasPrice: '1238888888'
  //       }), Context.WEB3)
  // }

  // /**
  //  * Retrieves the user's total balance committed for trading or lending
  //  */
  // public async getCashBalance(token: TokenAddress): Promise<number> {
  //   const contract: Contract = await this._web3Service.walletContract()
  //   return this.balanceResponseHandler(contract.methods.cashBalance(await this._web3Service.userAccount(), token)
  //     .call({ from: await this._web3Service.userAccount() }), Context.GET_CASH_BALANCE)
  // }

  // /**
  //  * Retrieves a trader's locked balance on a position or a lender's locked balance in a loan
  //  */
  // public async getLockedBalance(tokenAddress: TokenAddress): Promise<number> {
  //   const contract: Contract = await this._web3Service.walletContract()
  //   return this.balanceResponseHandler(contract.methods.lockedBalance(await this._web3Service.userAccount(), tokenAddress)
  //     .call({ from: await this._web3Service.userAccount() }), Context.GET_LOCKED_BALANCE)
  // }

  // /**
  //  * Retrieves a trader's position balance
  //  * TODO: Update to reflect auto-generated getter
  //  */
  // public async getPositionBalance(tokenAddress: TokenAddress, position: string): Promise<number> {
  //   const contract: Contract = await this._web3Service.walletContract()
  //   return this.balanceResponseHandler(
  //     contract.methods
  //       .positionBalance(tokenAddress)
  //       .call({ from: await this._web3Service.userAccount() }),
  //     Context.GET_POSITION_BALANCE
  //   )
  // }

  // /**
  //  * Retrieves the user's total withdrawable balance that has not been committed for lending/trading or is not locked in a loan/trade
  //  */
  // public async getWithdrawableBalance(tokenAddress: TokenAddress): Promise<number> {
  //   const contract: Contract = await this._web3Service.walletContract()
  //   return this.balanceResponseHandler(contract.methods.withdrawableBalance(await this._web3Service.userAccount(), tokenAddress)
  //     .call({ from: await this._web3Service.userAccount() }), Context.GET_WITHDRAWABLE_BALANCE)
  // }

  // /**
  //  * Returns all tokens supported by the platform
  //  */
  // public getTokenNames(): string[] {
  //   const names: string[] = []
  //   for (const token in TokenSymbol) {
  //     if (TokenSymbol.hasOwnProperty(token)) {
  //       names.push(token)
  //     }
  //   }
  //   return names
  // }

  // /**
  //  * Returns address associated with @param token
  //  */
  // public getTokenAddress(token: string): string {
  //   return token ? TokenAddress[token.toUpperCase()] : ''
  // }

  // /**
  //  * Helper method to handle a transaction response
  //  * @returns Transaction hash
  //  */
  // private transactionResponseHandler(promise: Promise<ITransactionResponse>, loggerContext: Context): Promise<string> {
  //   return promise.then(async response => {
  //     if (!response || !response.transactionHash) {
  //       Logger.error(loggerContext, 'message=Unknown error occurred during transaction')
  //       return Promise.reject('An error occurred')
  //     }

  //     Logger.info(loggerContext, `message=Transaction processed, transactionHash=${response.transactionHash}`)
  //     this.printTransactionSuccess(response.transactionHash, loggerContext)
  //     return Promise.resolve(response.transactionHash)
  //   }).catch(error => {
  //     Logger.error(loggerContext, `message= An error occurred, error=${error}`)
  //     return Promise.reject(error)
  //   })
  // }

  // /**
  //  * Checks the network for 20 seconds at half second intervals for a successful receipt of a transaction
  //  * (The average transaction time on Mainnet is ~20 seconds)
  //  * Stops checking on first successful transaction receipt
  //  */
  // private printTransactionSuccess(transactionHash: string, loggerContext: Context): void {
  //   const onSuccess = () => Logger.info(
  //     loggerContext,
  //     `message=Transaction successful, transactionHash=${transactionHash}`
  //   )
  //   const onFailure = () => Logger.error(
  //     loggerContext,
  //     `message=Transaction success could not be detected, most likely still mining, transactionHash=${transactionHash}`
  //   )

  //   this.ensureTransactionSuccess(transactionHash, loggerContext, onSuccess)
  // }

  // /**
  //  * Helper method to handle a balance query response
  //  */
  // private balanceResponseHandler(promise: Promise<number>, loggerContext: Context): Promise<number> {
  //   return promise.catch(error => {
  //     Logger.error(loggerContext, `message = An error occurred while fetching balance, error = ${JSON.stringify(error)}`)
  //     return Promise.reject(error)
  //   })
  // }

  // // TODO: Deprecate
  // get web3Service() {
  //   return this._web3Service
  // }

  // /**
  //  * Exposes the internal Web3 module
  //  */
  // get Web3(): Web3 {
  //   return this._web3Service.Web3
  // }

  // /**
  //  * Exposes the service that handles constants such as Wallet address
  //  */
  // get deployedConstants(): DeployedConstants {
  //   return this._deployedConstants
  // }
}
