//tslint:disable
const Web3 = require('web3')
//tslint:enable

import * as Constants from './constants'
import {
  fetchETHBallance,
  fetchContractByToken,
  fetchBallanceByToken,
  fetchAllowanceByToken,
  fetchLoanPositions,
  fillLoan,
  closePosition,
  cleanContract,
  topUpPosition,
  fetchOrders,
  createOrder,
  deleteOrder,
  postLoans,
  cancelOrder,
  wrapETH,
  allowance,
  getTokenExchangeRate,
  Logger,
  LOGGER_CONTEXT,
} from './services'

import {
  IMetaMask,
  IExchangeRates,
  IOrders,
  ILoadings,
  IContracts,
} from './interfaces'

export class Lendroid {
  private web3: any
  private apiEndpoint: string
  private apiLoanRequests: string
  private metamask: IMetaMask
  private exchangeRates: IExchangeRates
  private contracts: IContracts
  private orders: IOrders
  private loading: ILoadings
  private stateCallback: () => void

  constructor(initParams) {
    this.web3 = new Web3(initParams.provider || (window as any).web3.currentProvider)
    this.apiEndpoint = initParams.apiEndpoint || Constants.API_ENDPOINT
    this.apiLoanRequests = initParams.apiLoanRequests || Constants.API_LOAN_REQUESTS
    this.metamask = initParams.metamask
    this.exchangeRates = Constants.DEFAULT_EXCHANGES
    this.getETD()
    this.getETW()
    this.init()
    Logger.info(LOGGER_CONTEXT.INIT, { apiEndpoint: this.apiEndpoint, metamask: this.metamask })
    this.fetchOrders = this.fetchOrders.bind(this)
    this.fetchETHBallance = this.fetchETHBallance.bind(this)
    this.fetchBallanceByToken = this.fetchBallanceByToken.bind(this)
    this.fetchAllowanceByToken = this.fetchAllowanceByToken.bind(this)
    this.fetchLoanPositions = this.fetchLoanPositions.bind(this)
    this.onCreateOrder = this.onCreateOrder.bind(this)
    this.onDeleteOrder = this.onDeleteOrder.bind(this)
    this.onWrapETH = this.onWrapETH.bind(this)
    this.onAllowance = this.onAllowance.bind(this)
    this.onPostLoans = this.onPostLoans.bind(this)
    this.onFillLoan = this.onFillLoan.bind(this)
    this.onClosePosition = this.onClosePosition.bind(this)
    this.onCleanContract = this.onCleanContract.bind(this)
    this.onCancelOrder = this.onCancelOrder.bind(this)
  }

  public reset(metamask, stateCallback) {
    Logger.info(LOGGER_CONTEXT.RESET, metamask)
    this.metamask = metamask
    this.stateCallback = stateCallback
    if (metamask.network) {
      this.init()
      this.fetchETHBallance()
      this.fetchContracts()
      this.fetchOrders()
    }
  }

  public fetchOrders() {
    const { address } = this.metamask
    this.loading.orders = true
    this.stateCallback()

    fetchOrders(this.apiEndpoint, (err, orders) => {
      this.loading.orders = false
      if (err) { return Logger.error(LOGGER_CONTEXT.API_ERROR, err.message) }

      this.orders.myOrders.lend = orders.offers.filter(item => (item.lender === address))
      this.orders.myOrders.borrow = orders.offers.filter(item => (item.borrower === address))
      this.orders.orders = orders.offers.filter(item => (item.lender !== address && item.borrower !== address))
      setTimeout(() => this.stateCallback(), 1000)
    })
  }

  public fetchETHBallance() {
    const { web3, metamask } = this
    const { address } = metamask

    fetchETHBallance({ web3, address }, (err, res) => {
      if (err) { return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
      this.contracts.balances.ETH = res.data
      this.stateCallback()
    })
    setTimeout(this.fetchETHBallance, 5000)
  }

  public fetchBallanceByToken(token) {
    const { web3, metamask } = this
    const { address } = metamask
    if (!this.contracts.contracts[token]) { return }

    fetchBallanceByToken({ web3, contractInstance: this.contracts.contracts[token], address }, (err, res) => {
      if (err) { return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
      this.contracts.balances[token] = res.data
      this.stateCallback()
    })
    setTimeout(this.fetchBallanceByToken, 5000, token)
  }

  public fetchAllowanceByToken(token) {
    const { web3, metamask } = this
    const { address } = metamask
    if (!this.contracts.contracts[token]) { return }

    fetchAllowanceByToken({
      web3,
      address,
      contractInstance: this.contracts.contracts[token],
      tokenTransferProxyContract: this.contracts.contracts.TokenTransferProxy
    }, (err, res) => {
      if (err) { return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
      this.contracts.allowances[token] = res.data
      this.stateCallback()
    })
    setTimeout(this.fetchAllowanceByToken, 5000, token)
  }

  public fetchLoanPositions(specificAddress = null) {
    const { web3, metamask, contracts } = this
    const { address } = metamask
    const { Loan, LoanRegistry } = contracts.contracts
    this.loading.positions = true

    fetchLoanPositions({
      web3, address, Loan, LoanRegistry,
      specificAddress, oldPostions: this.contracts.positions
    }, (err, res) => {
      this.loading.positions = false
      if (err) { return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
      this.contracts.positions = res.positions
      this.stateCallback()
    })
  }

  public fetchContracts() {
    this.fetchContractByToken('TokenTransferProxy', () => {
      Constants.CONTRACT_TOKENS.forEach(token => {
        this.fetchContractByToken(token, null)
      })
    })
  }

  public async onCreateOrder(postData) {
    const { web3, contracts, metamask } = this
    const { address } = metamask

    // 1. an array of addresses[6] in this order: lender, borrower, relayer, wrangler, collateralToken, loanToken
    const addresses = [
      postData.lender = postData.lender.length ? postData.lender : this.fillZero(),
      postData.borrower = postData.borrower.length ? postData.borrower : this.fillZero(),
      postData.relayer = postData.relayer.length ? postData.relayer : this.fillZero(),
      postData.wrangler,
      postData.collateralToken,
      postData.loanToken
    ]

    // 2. an array of uints[9] in this order: loanAmountOffered, interestRatePerDay, loanDuration, offerExpiryTimestamp, relayerFeeLST, monitoringFeeLST, rolloverFeeLST, closureFeeLST, creatorSalt
    const values = [
      postData.loanAmountOffered = web3.utils.toWei(postData.loanAmountOffered, 'ether'),
      postData.interestRatePerDay = web3.utils.toWei(postData.interestRatePerDay, 'ether'),
      postData.loanDuration,
      postData.offerExpiry,
      postData.relayerFeeLST = web3.utils.toWei(postData.relayerFeeLST, 'ether'),
      postData.monitoringFeeLST = web3.utils.toWei(postData.monitoringFeeLST, 'ether'),
      postData.rolloverFeeLST = web3.utils.toWei(postData.rolloverFeeLST, 'ether'),
      postData.closureFeeLST = web3.utils.toWei(postData.closureFeeLST, 'ether'),
      postData.creatorSalt
    ]

    const loanOfferRegistryContractInstance = contracts.contracts ? contracts.contracts.LoanOfferRegistry : null

    const onSign = hash => {
      web3.eth.sign(hash, address)
        .then(result => {
          postData.ecSignatureCreator = result
          result = result.substr(2)

          postData.rCreator = `0x${result.slice(0, 64)}`
          postData.sCreator = `0x${result.slice(64, 128)}`
          postData.vCreator = web3.utils.toDecimal(`0x${result.slice(128, 130)}`)

          createOrder(this.apiEndpoint, postData, (err, res) => {
            if (err) { return Logger.error(LOGGER_CONTEXT.API_ERROR, err.message) }
            setTimeout(this.fetchOrders, 2000)
          })
        })
        .catch(err => {
          if (err) { return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
        })
    }

    const orderHash = await loanOfferRegistryContractInstance.methods.computeOfferHash(addresses, values).call()
    onSign(orderHash)
  }

  public onDeleteOrder(id, callback) {
    deleteOrder(this.apiEndpoint, id, callback)
  }

  public onWrapETH(amount, isWrap) {
    const { web3, contracts, metamask } = this
    const _WETHContractInstance = contracts.contracts.WETH
    if (!_WETHContractInstance) { return }

    wrapETH({ web3, amount, isWrap, _WETHContractInstance, metamask }, (err, hash) => {
      if (err) { return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
      this.loading.wrapping = true
      this.stateCallback()
      const wrapInterval = setInterval(() => {
        web3.eth.getTransactionReceipt(hash)
          .then(res => {
            if (res) {
              this.loading.wrapping = false
              setTimeout(() => this.stateCallback(), 6000)
              clearInterval(wrapInterval)
            }
          })
          .catch(error => Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, error.message))
      }, 3000)
    })
  }

  public onAllowance(token, newAllowance) {
    const { web3, contracts, metamask } = this
    const { address } = metamask
    const tokenContractInstance = contracts.contracts[token]
    const tokenTransferProxyContract = contracts.contracts.TokenTransferProxy
    const tokenAllowance = contracts.allowances[token]
    if (newAllowance === tokenAllowance) { return }

    allowance({
      address,
      web3,
      tokenContractInstance,
      tokenAllowance,
      newAllowance,
      tokenTransferProxyContract,
    }, (err, hash) => {
      if (err) { return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
      this.loading.allowance = true
      const allowanceInterval = setInterval(() => {
        web3.eth.getTransactionReceipt(hash)
          .then(res => {
            if (res) {
              this.loading.allowance = false
              setTimeout(() => this.stateCallback(), 6000)
              clearInterval(allowanceInterval)
            }
          })
          .catch(error => Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, error.message))
      }, 3000)
    })
  }

  public onPostLoans(data, callback) {
    postLoans(this.apiLoanRequests, data, callback)
  }

  public onFillLoan(approval, callback) {
    const { contracts, metamask } = this
    const loanOfferRegistryContractInstance = contracts.contracts.LoanOfferRegistry
    fillLoan({ approval, loanOfferRegistryContractInstance, metamask }, callback)
  }

  public onClosePosition(data, callback) {
    closePosition({ data }, (err, result) => {
      if (err) { Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
      callback(err, result)
    })
  }

  public onCleanContract(data, callback) {
    const { contracts, metamask } = this
    const wranglerLoanRegistry = contracts.contracts.WranglerLoanRegistry
    cleanContract({ metamask, data, wranglerLoanRegistry }, (err, result) => {
      if (err) { Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
      callback(err, result)
    })
  }

  public onTopUpPosition(data, topUpCollateralAmount, callback) {
    topUpPosition({ data, topUpCollateralAmount }, (err, result) => {
      if (err) { Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
      callback(err, result)
    })
  }

  public onCancelOrder(data, callback) {
    const { web3, contracts } = this
    const loanOfferRegistryContractInstance = contracts.contracts.LoanOfferRegistry
    const { currentWETHExchangeRate } = this.exchangeRates
    cancelOrder({ web3, data, currentWETHExchangeRate, loanOfferRegistryContractInstance }, (err, result) => {
      if (err) { Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
      callback(err, result)
    })
  }

  public getETW() {
    const _ = this
    getTokenExchangeRate('WETH', rate => {
      _.exchangeRates.currentWETHExchangeRate = rate
    })
  }

  public getETD() {
    const _ = this
    getTokenExchangeRate('DAI', rate => {
      _.exchangeRates.currentDAIExchangeRate = rate
    })
  }

  private init() {
    this.contracts = Constants.DEFAULT_CONTRACTS
    this.orders = Constants.DEFAULT_ORDERS
    this.loading = Constants.DEFAULT_LOADINGS
  }

  private fetchContractByToken(token, callback) {
    const { web3, metamask } = this
    const { network } = metamask

    fetchContractByToken(token, { web3, network }, (err, res) => {
      if (err) { return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message) }
      const oldContract = this.contracts.contracts[token]
      this.contracts.contracts[token] = res.data

      if (callback) {
        return callback()
      }

      if (Constants.BALLANCE_TOKENS.indexOf(token) !== -1 && !oldContract) {
        this.fetchBallanceByToken(token)
        this.fetchAllowanceByToken(token)
      }

      if (token === 'LoanRegistry' || token === 'Loan') {
        if (this.contracts.contracts.Loan && this.contracts.contracts.LoanRegistry) {
          this.fetchLoanPositions()
        }
      }
    })
  }

  private fillZero(len = 40) {
    return `0x${(new Array(len)).fill(0).join('')}`
  }
}
