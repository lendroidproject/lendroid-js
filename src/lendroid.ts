//tslint:disable
const Web3 = require('web3')
//tslint:enable

import * as Constants from './constants'
import {
  fetchETHBallance,
  fetchContractByToken,
  fetchBallanceByToken,
  fetchAllowanceByToken,
  fetchPositions,
  fillLoan,
  closePosition,
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
  Logger,
  LOGGER_CONTEXT,
  Web3Utils,
  getTokenExchangeRate
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
  private exchangeRates: any
  private contracts: any
  private orders: any
  private lastFetchTime: Date
  private loading: any
  private stateCallback: () => void
  private debounceUpdate: () => void
  public metamask: any
  public relayer: any
  public wranglers: any
  public web3Utils: Web3Utils

  public contractAddresses: any
  public contractTokens: any
  public balanceTokens: any

  constructor(initParams: any = {}) {
    this.web3 = new Web3(
      initParams.provider || (window as any).web3.currentProvider
    )
    this.web3Utils = new Web3Utils(this.web3)
    this.apiEndpoint = initParams.apiEndpoint || Constants.API_ENDPOINT
    this.stateCallback =
      initParams.stateCallback ||
      (() => console.log('State callback is not set'))
    this.metamask = { address: undefined, network: undefined }
    this.relayer = initParams.relayer || ''
    this.wranglers = initParams.wranglers || Constants.DEFAULT_WRANGLERS

    //tslint:disable
    this.contractAddresses = Object.assign({}, Constants.CONTRACT_ADDRESSES, initParams.CONTRACT_ADDRESSES)
    this.contractTokens = Object.keys(this.contractAddresses)
    this.balanceTokens = Constants.BALLANCE_TOKENS.slice().concat(Object.keys(initParams.CONTRACT_ADDRESSES))
    //tslint:enable

    this.fetchETHBallance = this.fetchETHBallance.bind(this)
    this.fetchBallanceByToken = this.fetchBallanceByToken.bind(this)
    this.fetchAllowanceByToken = this.fetchAllowanceByToken.bind(this)
    this.fetchAllowanceByAddress = this.fetchAllowanceByAddress.bind(this)
    this.fetchOrders = this.fetchOrders.bind(this)
    this.fetchPositions = this.fetchPositions.bind(this)
    this.fetchTokenExchange = this.fetchTokenExchange.bind(this)

    this.getTokenByAddress = this.getTokenByAddress.bind(this)
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
    this.onCancelOrder = this.onCancelOrder.bind(this)

    this.init()
    this.fetchETHBallance()
    this.balanceTokens.forEach(token => {
      this.fetchBallanceByToken(token)
      this.fetchAllowanceByToken(token)
    })
    Logger.info(LOGGER_CONTEXT.INIT, {
      apiEndpoint: this.apiEndpoint,
      metamask: this.metamask
    })

    setInterval(async () => {
      const accounts = await this.web3.eth.getAccounts()
      const network = await this.web3.eth.net.getId()
      if (
        (accounts && accounts[0] !== this.metamask.address) ||
        network !== this.metamask.network
      ) {
        this.reset({ address: accounts[0], network })
      }
    }, 1000)

    this.lastFetchTime = new Date()
    setInterval(() => {
      this.lastFetchTime = new Date()
      this.fetchOrders()
    }, 30 * 1000)

    this.debounceUpdate = this.debounce(this.stateCallback, 500, null)
  }

  public getTokenByAddress(address) {
    const { contractAddresses, contractTokens, metamask: { network } } = this
    let ret = ''
    contractTokens.forEach(token => {
      if (contractAddresses[token] && (contractAddresses[token][network] || '').toLowerCase() === address.toLowerCase()) {
        ret = token
      }
    })
    return ret
  }

  public async onCreateOrder(postData, callback) {
    const { web3Utils, contracts, metamask, relayer } = this
    const { address } = metamask

    postData.relayer = relayer

    // 1. an array of addresses[6] in this order: lender, borrower, relayer, wrangler, collateralToken, loanToken
    const addresses = [
      (postData.lender = postData.lender.length
        ? postData.lender
        : this.fillZero()),
      (postData.borrower = postData.borrower.length
        ? postData.borrower
        : this.fillZero()),
      relayer.length
        ? relayer
        : this.fillZero(),
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
      web3Utils.eth.personal
        .sign(hash, address)
        .then(result => {
          postData.ecSignatureCreator = result
          result = result.substr(2)

          postData.rCreator = `0x${result.slice(0, 64)}`
          postData.sCreator = `0x${result.slice(64, 128)}`
          postData.vCreator = `${result.slice(128, 130)}` === '00' ? '27' : '28'

          createOrder(this.apiEndpoint, postData, (err, res) => {
            if (err) {
              callback(err)
              return Logger.error(LOGGER_CONTEXT.API_ERROR, err.message)
            } else {
              callback(null, res)
            }
            setTimeout(this.fetchOrders, 2000)
          })
        })
        .catch(err => {
          callback(err)
          return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        })
    }

    const orderHash = await protocolContractInstance.methods
      .kernel_hash(
        addresses,
        values,
        parseInt(postData.offerExpiry, 10),
        postData.creatorSalt,
        web3Utils.toWei(postData.interestRatePerDay),
        // parseInt(postData.interestRatePerDay, 10),
        parseInt(postData.loanDuration, 10)
      )
      .call()
    onSign(orderHash)
  }

  public onFillOrderServer(id, value, callback) {
    fillOrderServer(this.apiEndpoint, id, value, (err, res) => {
      callback(err, res)
      setTimeout(this.fetchOrders, 300)
      setTimeout(this.fetchPositions, 1000)
    })
  }

  public onDeleteOrder(id, callback) {
    deleteOrder(this.apiEndpoint, id, (err, res) => {
      callback(err, res)
      setTimeout(this.fetchOrders, 300)
    })
  }

  public onWrapETH(amount, isWrap, callback) {
    const { web3Utils, contracts, metamask } = this
    const _WETHContractInstance = contracts.contracts.WETH
    if (!_WETHContractInstance) {
      callback(null)
      return
    }
    this.loading.wrapping = true

    wrapETH(
      { web3Utils, amount, isWrap, _WETHContractInstance, metamask },
      (err, hash) => {
        if (err) {
          this.loading.wrapping = false
          callback(null)
          Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        } else {
          this.debounceUpdate()
          const wrapInterval = setInterval(() => {
            web3Utils.eth
              .getTransactionReceipt(hash)
              .then(res => {
                if (res) {
                  clearInterval(wrapInterval)
                  setTimeout(() => {
                    this.fetchBallanceByToken(
                      'WETH',
                      (e: any) => {
                        this.loading.wrapping = false
                        callback(e)
                      },
                      true
                    )
                  }, 1000)
                }
              })
              .catch(error => {
                this.loading.wrapping = false
                callback(null)
                Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, error.message)
              })
          }, 3000)
        }
      }
    )
  }

  public onAllowance(token, callback) {
    const { web3Utils, contracts, metamask } = this
    const { address } = metamask
    const tokenContractInstance = contracts.contracts[token]
    const protocolContract = contracts.contracts.Protocol
    const tokenAllowance = contracts.allowances[token]

    if (!tokenContractInstance) {
      callback(null)
      return
    }

    this.loading.allowance = true

    allowance(
      {
        address,
        web3Utils,
        tokenContractInstance,
        tokenAllowance,
        protocolContract
      },
      (err, hash) => {
        if (err) {
          this.loading.allowance = false
          callback(null)
          Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        } else {
          const allowanceInterval = setInterval(() => {
            web3Utils.eth
              .getTransactionReceipt(hash)
              .then(res => {
                if (res) {
                  clearInterval(allowanceInterval)
                  setTimeout(() => {
                    this.fetchAllowanceByToken(
                      token,
                      (e: any) => {
                        this.loading.allowance = false
                        callback(e)
                      },
                      true
                    )
                  }, 1000)
                }
              })
              .catch(error => {
                this.loading.allowance = false
                callback(null)
                Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, error.message)
              })
          }, 3000)
        }
      }
    )
  }

  public onPostLoans(data, callback) {
    const wrangler = this.wranglers.find(w => w.address.toLowerCase() === data.wrangler.toLowerCase())

    if (wrangler) {
      postLoans(wrangler.apiLoanRequests, data, callback)
    } else {
      callback({ response: { data: { message: 'No Matching Wrangler!' } } })
    }
  }

  public onFillLoan(approval, callback) {
    const { contracts, metamask, web3Utils } = this
    const protocolContractInstance = contracts.contracts.Protocol
    fillLoan(
      { approval, protocolContractInstance, metamask, web3Utils },
      (err, hash) => {
        if (err) {
          Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
          callback(err, hash)
        } else {
          this.debounceUpdate()
          const txInterval = setInterval(() => {
            web3Utils.eth
              .getTransactionReceipt(hash)
              .then(res => {
                if (res && parseInt(res.status, 16)) {
                  clearInterval(txInterval)
                  callback(err, hash)
                }
              })
              .catch(error => {
                this.loading.wrapping = false
                callback(null)
                Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, error.message)
              })
          }, 1500)
        }
      }
    )
  }

  public async onClosePosition(data, callback) {
    const { metamask, web3Utils } = this

    const { borrower, loanAmountOwed, loanToken } = data.origin
    const token = this.getTokenByAddress(loanToken)
    const borrowerAllowance = await this.fetchAllowanceByAddress(borrower, token)
    if (
      parseFloat(borrowerAllowance.toString()) >= parseFloat(loanAmountOwed)
    ) {
      closePosition({ data, metamask }, (err, hash) => {
        if (err) {
          Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
          callback(err, hash)
        } else {
          this.debounceUpdate()
          const txInterval = setInterval(() => {
            web3Utils.eth
              .getTransactionReceipt(hash)
              .then(res => {
                if (res && parseInt(res.status, 16)) {
                  clearInterval(txInterval)
                  callback(err, hash)
                  setTimeout(this.fetchPositions, 100)
                }
              })
              .catch(error => {
                this.loading.wrapping = false
                callback(null)
                Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, error.message)
              })
          }, 1500)
        }
      })
    } else {
      callback({
        message: `Borrower\'s ${token} allowance should at least ${loanAmountOwed}`
      })
    }
  }

  public onTopUpPosition(data, topUpCollateralAmount, callback) {
    const { web3Utils } = this

    topUpPosition({ data, topUpCollateralAmount }, (err, hash) => {
      if (err) {
        Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        callback(err, hash)
      } else {
        this.debounceUpdate()
        const txInterval = setInterval(() => {
          web3Utils.eth
            .getTransactionReceipt(hash)
            .then(res => {
              if (res && parseInt(res.status, 16)) {
                clearInterval(txInterval)
                callback(err, hash)
                setTimeout(this.fetchPositions, 100)
              }
            })
            .catch(error => {
              this.loading.wrapping = false
              callback(null)
              Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, error.message)
            })
        }, 1500)
      }
    })
  }

  public async onLiquidatePosition(data, callback) {
    const { web3Utils } = this

    const { lender, loanAmountOwed, loanToken } = data.origin
    const token = this.getTokenByAddress(loanToken)
    const lenderAllowance = await this.fetchAllowanceByAddress(lender, token)
    if (parseFloat(lenderAllowance.toString()) >= parseFloat(loanAmountOwed)) {
      liquidatePosition({ data }, (err, hash) => {
        if (err) {
          Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
          callback(err, hash)
        } else {
          this.debounceUpdate()
          const txInterval = setInterval(() => {
            web3Utils.eth
              .getTransactionReceipt(hash)
              .then(res => {
                if (res && parseInt(res.status, 16)) {
                  clearInterval(txInterval)
                  callback(err, hash)
                  setTimeout(this.fetchPositions, 100)
                }
              })
              .catch(error => {
                this.loading.wrapping = false
                callback(null)
                Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, error.message)
              })
          }, 1500)
        }
      })
    } else {
      callback({
        message: `Lender\'s ${token} allowance should at least ${loanAmountOwed}`
      })
    }
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

  private init() {
    this.contracts = Constants.DEFAULT_CONTRACTS
    this.orders = Constants.DEFAULT_ORDERS
    this.loading = Constants.DEFAULT_LOADINGS
    this.exchangeRates = Constants.DEFAULT_EXCHANGES
    this.contractTokens.forEach(token => {
      this.exchangeRates[token] = 0
    })
    this.stateCallback()
  }

  private reset(metamask) {
    Logger.info(LOGGER_CONTEXT.RESET, metamask)
    this.metamask = metamask
    if (metamask.network) {
      this.init()
      this.fetchContracts()
      this.fetchOrders()
    }
  }

  private fetchOrders() {
    const { address } = this.metamask
    this.loading.orders = true
    this.stateCallback()

    fetchOrders(this.apiEndpoint, (err, orders) => {
      this.loading.orders = false
      if (err) {
        return Logger.error(LOGGER_CONTEXT.API_ERROR, err.message)
      }

      orders.result.forEach(order => {
        // collateralToken
        order.loanCurrency = this.getTokenByAddress(order.loanToken)
        // loanToken
        order.collateralCurrency = this.getTokenByAddress(order.collateralToken)
      })

      this.orders.myOrders.lend = orders.result.filter(
        item => item.lender === address
      )
      this.orders.myOrders.borrow = orders.result.filter(
        item => item.borrower === address
      )
      this.orders.orders = orders.result.filter(
        item => item.lender !== address && item.borrower !== address
      )
      setTimeout(this.debounceUpdate, 1000)
    })
  }

  private fetchPositions(specificAddress = null) {
    const { web3Utils, metamask, contracts } = this
    const { address } = metamask
    const { Protocol } = contracts.contracts
    this.loading.positions = true

    fetchPositions(
      {
        web3Utils,
        address,
        Protocol,
        specificAddress,
        oldPostions: this.contracts.positions
      },
      (err, res) => {
        this.loading.positions = false
        if (err) {
          return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        }
        this.contracts.positions = res.positions

        this.contracts.positions.lent.forEach(position => {
          position.loanCurrency = this.getTokenByAddress(position.origin.loanToken)
          position.collateralCurrency = this.getTokenByAddress(position.detail.borrow_currency_address)
        })
        this.contracts.positions.borrowed.forEach(position => {
          position.loanCurrency = this.getTokenByAddress(position.origin.loanToken)
          position.collateralCurrency = this.getTokenByAddress(position.detail.borrow_currency_address)
        })

        this.debounceUpdate()
      }
    )
  }

  private fetchTokenExchange(token) {
    const _ = this
    if (['Protocol', 'LST'].indexOf(token) === -1) {
      getTokenExchangeRate(token, rate => {
        _.exchangeRates[token] = rate
      })
    }
  }

  private fetchContracts() {
    this.contractTokens.forEach(token => {
      this.fetchContractByToken(token, null)
    })
  }

  private fetchContractByToken(token, callback) {
    const { web3Utils, metamask, contractAddresses } = this
    const { network } = metamask

    fetchContractByToken(token, { web3Utils, network, contractAddresses }, (err, res) => {
      if (err) {
        return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
      }
      this.contracts.contracts[token] = res.data

      if (callback) {
        return callback()
      }

      if (token === 'Protocol') {
        if (this.contracts.contracts.Protocol) {
          this.fetchPositions()
        }
      }
    })
  }

  private fetchETHBallance() {
    const { web3Utils, metamask, contracts, contractTokens } = this
    const { address } = metamask || { address: null }
    if (address && contracts && contracts.balances) {
      fetchETHBallance({ web3Utils, address }, (err, res) => {
        if (err) {
          return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
        }
        contracts.balances.ETH = res.data
        this.debounceUpdate()
      })
      setTimeout(this.fetchETHBallance, 2500)
    } else {
      setTimeout(this.fetchETHBallance, 500)
    }
    contractTokens.forEach(token => {
      this.fetchTokenExchange(token)
    })
  }

  private fetchBallanceByToken(
    token,
    callback: any = () => null,
    once = false
  ) {
    const { web3Utils, metamask, contracts } = this
    const { address } = metamask || { address: null }
    if (contracts && contracts.contracts && contracts.contracts[token]) {
      fetchBallanceByToken(
        {
          web3Utils,
          contractInstance: contracts.contracts[token],
          address
        },
        (err, res) => {
          if (err) {
            callback(null)
            return
            // return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
          }
          this.contracts.balances[token] = res.data
          this.debounceUpdate()
          callback(null)
        }
      )
      if (!once) {
        setTimeout(this.fetchBallanceByToken, 2500, token)
      }
    } else {
      if (!once) {
        setTimeout(this.fetchBallanceByToken, 500, token)
      }
    }
  }

  private fetchAllowanceByToken(
    token,
    callback: any = () => null,
    once = false
  ) {
    const { web3Utils, metamask, contracts } = this
    const { address } = metamask || { address: null }
    if (
      contracts &&
      contracts.contracts &&
      contracts.contracts[token] &&
      contracts.contracts.Protocol
    ) {
      fetchAllowanceByToken(
        {
          web3Utils,
          address,
          contractInstance: contracts.contracts[token],
          protocolContract: contracts.contracts.Protocol
        },
        (err, res) => {
          if (err) {
            callback(null)
            return
            // return Logger.error(LOGGER_CONTEXT.CONTRACT_ERROR, err.message)
          }
          this.contracts.allowances[token] = res.data
          this.debounceUpdate()
          callback(null)
        }
      )
      if (!once) {
        setTimeout(this.fetchAllowanceByToken, 2500, token)
      }
    } else {
      if (!once) {
        setTimeout(this.fetchAllowanceByToken, 500, token)
      }
    }
  }

  private fetchAllowanceByAddress(address, token) {
    return new Promise((resolve, reject) => {
      const { web3Utils, contracts } = this
      if (
        contracts &&
        contracts.contracts &&
        contracts.contracts[token] &&
        contracts.contracts.Protocol
      ) {
        fetchAllowanceByToken(
          {
            web3Utils,
            address,
            contractInstance: contracts.contracts[token],
            protocolContract: contracts.contracts.Protocol
          },
          (err, res) => {
            if (err) {
              reject(err)
            } else {
              resolve(res.data)
            }
          }
        )
      } else {
        reject({ message: 'Contracts not ready, try again later.' })
      }
    })
  }

  private debounce(func, wait, immediate) {
    let timeout: any = -1
    //tslint:disable
    return function () {
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

  private fillZero(len = 40) {
    return `0x${new Array(len).fill(0).join('')}`
  }
}
