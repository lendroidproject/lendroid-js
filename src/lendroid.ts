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
  liquidatePosition,
  fetchOrders,
  createOrder,
  fillOrderServer,
  deleteOrder,
  postLoans,
  cancelOrder,
  wrapETH,
  allowance,
  getTokenExchangeRate,
  Logger,
  LOGGER_CONTEXT,
  Web3Utils
} from './services'

// import {
//   IMetaMask,
//   IExchangeRates,
//   IOrders,
//   ILoadings,
//   IContracts,
// } from './interfaces'

export class Lendroid {
  private web3: any
  private apiEndpoint: string
  private apiLoanRequests: string
  private exchangeRates: any
  private contracts: any
  private orders: any
  private loading: any
  private stateCallback: () => void
  private debounceUpdate: () => void
  public metamask: any
  public web3Utils: Web3Utils

  constructor(initParams: any = {}) {
    this.web3 = new Web3(
      initParams.provider || (window as any).web3.currentProvider
    )
    this.web3Utils = new Web3Utils(this.web3)
    this.apiEndpoint = initParams.apiEndpoint || Constants.API_ENDPOINT
    this.apiLoanRequests =
      initParams.apiLoanRequests || Constants.API_LOAN_REQUESTS
    this.stateCallback =
      initParams.stateCallback ||
      (() => console.log('State callback is not set'))
    this.metamask = { address: undefined, network: undefined }
    this.exchangeRates = Constants.DEFAULT_EXCHANGES
    this.getETD()
    this.getETW()
    this.init()
    Logger.info(LOGGER_CONTEXT.INIT, {
      apiEndpoint: this.apiEndpoint,
      metamask: this.metamask
    })
    this.fetchOrders = this.fetchOrders.bind(this)
    this.fetchETHBallance = this.fetchETHBallance.bind(this)
    this.fetchBallanceByToken = this.fetchBallanceByToken.bind(this)
    this.fetchAllowanceByToken = this.fetchAllowanceByToken.bind(this)
    this.fetchLoanPositions = this.fetchLoanPositions.bind(this)
    this.onCreateOrder = this.onCreateOrder.bind(this)
    this.onFillOrderServer = this.onFillOrderServer.bind(this)
    this.onDeleteOrder = this.onDeleteOrder.bind(this)
    this.onWrapETH = this.onWrapETH.bind(this)
    this.onAllowance = this.onAllowance.bind(this)
    this.onPostLoans = this.onPostLoans.bind(this)
    this.onFillLoan = this.onFillLoan.bind(this)
    this.onClosePosition = this.onClosePosition.bind(this)
    this.onTopUpPosition = this.onTopUpPosition.bind(this)
    this.onLiquidatePosition = this.onLiquidatePosition.bind(this)
    this.onCleanContract = this.onCleanContract.bind(this)
    this.onCancelOrder = this.onCancelOrder.bind(this)

    setInterval(async () => {
      const accounts = await this.web3.eth.getAccounts()
      const network = await this.web3.eth.net.getId()
      if (
        (accounts && accounts[0] !== this.metamask.address) ||
        network !== this.metamask.network
      ) {
        this.reset({ address: accounts[0], network })
      }
    }, 2000)

    this.debounceUpdate = this.debounce(this.stateCallback, 3500, null)
  }

  public reset(metamask) {
    Logger.info(LOGGER_CONTEXT.RESET, metamask)
    this.metamask = metamask
    this.debounceUpdate = this.debounce(this.stateCallback, 1000, null)
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
    this.debounceUpdate()

    fetchOrders(this.apiEndpoint, (err, orders) => {
      this.loading.orders = false
      if (err) {
        return Logger.error(LOGGER_CONTEXT.API_ERROR, err.message)
      }

      this.orders.myOrders.lend = orders.result.filter(
        item => item.lender === address
      )
      this.orders.myOrders.borrow = orders.result.filter(
        item => item.borrower === address
      )
      this.orders.orders = orders.result.filter(
        item => item.lender !== address && item.borrower !== address
      )
      setTimeout(() => this.debounceUpdate(), 1000)
    })
  }

  public fetchETHBallance() {
    const { web3Utils, metamask } = this
    const { address } = metamask

    fetchETHBallance({ web3Utils, address }, (err, res) => {
      if (err) {
        return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
      }
      this.contracts.balances.ETH = res.data
      this.debounceUpdate()
    })
    setTimeout(this.fetchETHBallance, 5000)
  }

  public fetchBallanceByToken(token) {
    const { web3Utils, metamask } = this
    const { address } = metamask
    if (!this.contracts.contracts[token]) {
      return
    }

    fetchBallanceByToken(
      { web3Utils, contractInstance: this.contracts.contracts[token], address },
      (err, res) => {
        if (err) {
          return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        }
        this.contracts.balances[token] = res.data
        this.debounceUpdate()
      }
    )
    setTimeout(this.fetchBallanceByToken, 5000, token)
  }

  public fetchAllowanceByToken(token) {
    const { web3Utils, metamask } = this
    const { address } = metamask
    if (!this.contracts.contracts[token]) {
      return
    }

    fetchAllowanceByToken(
      {
        web3Utils,
        address,
        contractInstance: this.contracts.contracts[token],
        protocolContract: this.contracts.contracts.Protocol
      },
      (err, res) => {
        if (err) {
          return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        }
        this.contracts.allowances[token] = res.data
        this.debounceUpdate()
      }
    )
    setTimeout(this.fetchAllowanceByToken, 5000, token)
  }

  public fetchLoanPositions(specificAddress = null) {
    const { web3Utils, metamask, contracts } = this
    const { address } = metamask
    const { Loan, LoanRegistry } = contracts.contracts
    this.loading.positions = true

    fetchLoanPositions(
      {
        web3Utils,
        address,
        Loan,
        LoanRegistry,
        specificAddress,
        oldPostions: this.contracts.positions
      },
      (err, res) => {
        this.loading.positions = false
        if (err) {
          return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        }
        this.contracts.positions = res.positions
        this.debounceUpdate()
      }
    )
  }

  public fetchContracts() {
    this.fetchContractByToken('TokenTransferProxy', () => {
      Constants.CONTRACT_TOKENS.forEach(token => {
        this.fetchContractByToken(token, null)
      })
    })
  }

  public async onCreateOrder(postData) {
    const { web3Utils, contracts, metamask } = this
    const { address } = metamask

    // 1. an array of addresses[6] in this order: lender, borrower, relayer, wrangler, collateralToken, loanToken
    const addresses = [
      (postData.lender = postData.lender.length
        ? postData.lender
        : this.fillZero()),
      (postData.borrower = postData.borrower.length
        ? postData.borrower
        : this.fillZero()),
      (postData.relayer = postData.relayer.length
        ? postData.relayer
        : this.fillZero()),
      postData.wrangler,
      postData.collateralToken,
      postData.loanToken
    ]

    // 2. an array of uints[9] in this order: loanAmountOffered, interestRatePerDay, loanDuration, offerExpiryTimestamp, relayerFeeLST, monitoringFeeLST, rolloverFeeLST, closureFeeLST, creatorSalt
    const values = [
      (postData.loanAmountOffered = web3Utils.toWei(
        postData.loanAmountOffered
      )),
      // (postData.interestRatePerDay = web3Utils.toWei(
      //   postData.interestRatePerDay
      // )),
      // postData.loanDuration,
      // postData.offerExpiry,
      (postData.relayerFeeLST = web3Utils.toWei(postData.relayerFeeLST)),
      (postData.monitoringFeeLST = web3Utils.toWei(postData.monitoringFeeLST)),
      (postData.rolloverFeeLST = web3Utils.toWei(postData.rolloverFeeLST)),
      (postData.closureFeeLST = web3Utils.toWei(postData.closureFeeLST))
      // postData.creatorSalt
    ]

    const protocolContractInstance = contracts.contracts
      ? contracts.contracts.Protocol
      : null

    const onSign = hash => {
      web3Utils.eth
        .sign(hash, address)
        .then(result => {
          postData.ecSignatureCreator = result
          result = result.substr(2)

          postData.rCreator = `0x${result.slice(0, 64)}`
          postData.sCreator = `0x${result.slice(64, 128)}`
          postData.vCreator = `${result.slice(128, 130)}` === '00' ? '27' : '28'

          createOrder(this.apiEndpoint, postData, (err, res) => {
            if (err) {
              return Logger.error(LOGGER_CONTEXT.API_ERROR, err.message)
            }
            setTimeout(this.fetchOrders, 2000)
          })
        })
        .catch(err => {
          return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        })
    }

    const orderHash = await protocolContractInstance.methods
      .kernel_hash(
        addresses,
        values,
        parseInt(postData.offerExpiry, 10),
        postData.creatorSalt,
        parseFloat(postData.interestRatePerDay),
        parseInt(postData.loanDuration, 10)
      )
      .call()
    onSign(orderHash)
  }

  public onFillOrderServer(id, value, callback) {
    fillOrderServer(this.apiEndpoint, id, value, callback)
  }

  public onDeleteOrder(id, callback) {
    deleteOrder(this.apiEndpoint, id, callback)
  }

  public onWrapETH(amount, isWrap) {
    const { web3Utils, contracts, metamask } = this
    const _WETHContractInstance = contracts.contracts.WETH
    if (!_WETHContractInstance) {
      return
    }

    wrapETH(
      { web3Utils, amount, isWrap, _WETHContractInstance, metamask },
      (err, hash) => {
        if (err) {
          return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        }
        this.loading.wrapping = true
        this.debounceUpdate()
        const wrapInterval = setInterval(() => {
          web3Utils.eth
            .getTransactionReceipt(hash)
            .then(res => {
              if (res) {
                this.loading.wrapping = false
                setTimeout(() => this.debounceUpdate(), 6000)
                clearInterval(wrapInterval)
              }
            })
            .catch(error =>
              Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, error.message)
            )
        }, 3000)
      }
    )
  }

  public onAllowance(token, newAllowance) {
    const { web3Utils, contracts, metamask } = this
    const { address } = metamask
    const tokenContractInstance = contracts.contracts[token]
    const protocolContract = contracts.contracts.Protocol
    const tokenAllowance = contracts.allowances[token]
    if (newAllowance === tokenAllowance) {
      return
    }

    allowance(
      {
        address,
        web3Utils,
        tokenContractInstance,
        tokenAllowance,
        newAllowance,
        protocolContract
      },
      (err, hash) => {
        if (err) {
          return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        }
        this.loading.allowance = true
        const allowanceInterval = setInterval(() => {
          web3Utils.eth
            .getTransactionReceipt(hash)
            .then(res => {
              if (res) {
                this.loading.allowance = false
                setTimeout(() => this.debounceUpdate(), 6000)
                clearInterval(allowanceInterval)
              }
            })
            .catch(error =>
              Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, error.message)
            )
        }, 3000)
      }
    )
  }

  public onPostLoans(data, callback) {
    postLoans(this.apiLoanRequests, data, callback)
  }

  public onFillLoan(approval, callback) {
    const { contracts, metamask, web3Utils } = this
    const protocolContractInstance = contracts.contracts.Protocol
    fillLoan(
      { approval, protocolContractInstance, metamask, web3Utils },
      callback
    )
  }

  public onClosePosition(data, callback) {
    const { metamask } = this
    closePosition({ data, metamask }, (err, result) => {
      if (err) {
        Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
      }
      callback(err, result)
    })
  }

  public onCleanContract(data, callback) {
    const { contracts, metamask } = this
    const wranglerLoanRegistry = contracts.contracts.WranglerLoanRegistry
    cleanContract({ metamask, data, wranglerLoanRegistry }, (err, result) => {
      if (err) {
        Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
      }
      callback(err, result)
    })
  }

  public onTopUpPosition(data, topUpCollateralAmount, callback) {
    topUpPosition({ data, topUpCollateralAmount }, (err, result) => {
      if (err) {
        Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
      }
      callback(err, result)
    })
  }

  public onLiquidatePosition(data, callback) {
    liquidatePosition({ data }, (err, result) => {
      if (err) {
        Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
      }
      callback(err, result)
    })
  }

  public onCancelOrder(data, callback) {
    const { web3Utils, contracts, metamask } = this
    const protocolContractInstance = contracts.contracts.Protocol
    const { currentWETHExchangeRate } = this.exchangeRates
    cancelOrder(
      {
        web3Utils,
        data,
        currentWETHExchangeRate,
        protocolContractInstance,
        metamask
      },
      (err, result) => {
        if (err) {
          Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        }
        callback(err, result)
      }
    )
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

  public debounce(func, wait, immediate) {
    let timeout = -1
    //tslint:disable
    return function() {
      const context = this
      const args = arguments
      const later = () => {
        timeout = -1
        if (!immediate) {
          func.apply(context, args)
        }
      }
      const callNow = immediate && !timeout
      if (timeout !== -1) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(later, wait)
      if (callNow) {
        func.apply(context, args)
      }
    }
    //tslint:enable
  }

  private init() {
    this.contracts = Constants.DEFAULT_CONTRACTS
    this.orders = Constants.DEFAULT_ORDERS
    this.loading = Constants.DEFAULT_LOADINGS
  }

  private fetchContractByToken(token, callback) {
    const { web3Utils, metamask } = this
    const { network } = metamask

    fetchContractByToken(token, { web3Utils, network }, (err, res) => {
      if (err) {
        return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
      }
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
        if (
          this.contracts.contracts.Loan &&
          this.contracts.contracts.LoanRegistry
        ) {
          this.fetchLoanPositions()
        }
      }
    })
  }

  private fillZero(len = 40) {
    return `0x${new Array(len).fill(0).join('')}`
  }
}
