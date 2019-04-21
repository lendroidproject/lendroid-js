import axios from 'axios'
import * as Constants from '../constants'

export const fetchContractByToken = (token, payload, callback) => {
  const { network, web3Utils, contractAddresses } = payload

  if (!contractAddresses[token][network]) {
    return callback({ message: 'Unknown' })
  }

  if (!contractAddresses[token].def) {
    const url = `https://${
      network === 1 ? 'api' : 'api-kovan'
      }.etherscan.io/api?module=contract&action=getabi&address=${
      contractAddresses[token][network]
      }`
    axios
      .get(url)
      .then(res => {
        if (Number(res.data.status)) {
          const contractABI = JSON.parse(res.data.result)
          const contractInstance = web3Utils.createContract(
            contractABI,
            contractAddresses[token][network]
          )
          callback(null, { data: contractInstance })
        } else {
          callback({ message: res.data.result })
        }
      })
      .catch(err => callback(err))
  } else {
    const contractABI = contractAddresses[token].def
    const contractInstance = web3Utils.createContract(
      contractABI.hasNetwork ? contractABI[network] : contractABI,
      contractAddresses[token][network]
    )
    callback(null, { data: contractInstance })
  }
}

export const fetchETHBallance = (payload, callback) => {
  const { address, web3Utils } = payload

  web3Utils.eth
    .getBalance(address)
    .then(value => {
      callback(null, { data: web3Utils.fromWei(value) })
    })
    .catch(err => callback(err))
}

export const fetchBallanceByToken = (payload, callback) => {
  const { address, web3Utils } = payload
  const contractInstance = payload.contractInstance

  if (!contractInstance.methods.balanceOf) {
    return callback({ message: 'No ballanceOf() in Contract Instance' })
  }
  contractInstance.methods
    .balanceOf(address)
    .call()
    .then(res => {
      const value = web3Utils.fromWei(res)
      callback(null, { data: value })
    })
    .catch(err => {
      console.log('Fetch balance failed', contractInstance._address)
      callback(err)
    })
}

export const fetchAllowanceByToken = (payload, callback) => {
  const { address, contractInstance, protocolContract, web3Utils } = payload

  if (!contractInstance.methods.allowance) {
    return callback({ message: 'No allowance() in Contract Instance' })
  }
  contractInstance.methods
    .allowance(address, protocolContract._address)
    .call({ from: address })
    .then(res => {
      const value = web3Utils.fromWei(res)
      callback(null, { data: value })
    })
    .catch(err => {
      console.log('Fetch allowance failed', contractInstance._address)
      callback(err)
    })
}

const fillZero = (len = 40) => {
  return `0x${new Array(len).fill(0).join('')}`
}

export const fetchPositions = async (payload, callback) => {
  const { address, Protocol, specificAddress, oldPostions, web3Utils } = payload
  const lendCount = await Protocol.methods.lend_positions_count(address).call()
  const borrowCount = await Protocol.methods
    .borrow_positions_count(address)
    .call()

  const positions: any[] = []
  const positionExists = {}
  for (let i = 1; i <= lendCount; i++) {
    const positionHash = await Protocol.methods
      .lend_positions(address, i)
      .call()
    if (positionHash === fillZero(64)) {
      continue
    }
    const positionData = await Protocol.methods.position(positionHash).call()
    if (!positionExists[positionHash]) {
      positionExists[positionHash] = true
      positions.push({
        type: 'lent',
        positionData,
        address: positionHash
      })
    }
  }
  for (let i = 1; i <= borrowCount; i++) {
    const positionHash = await Protocol.methods
      .borrow_positions(address, i)
      .call()
    if (positionHash === fillZero(64)) {
      continue
    }
    const positionData = await Protocol.methods.position(positionHash).call()
    if (!positionExists[positionHash]) {
      positionExists[positionHash] = true
      positions.push({
        type: 'borrowed',
        positionData,
        address: positionHash
      })
    }
  }

  // if (specificAddress) {
  //   positions = positions.filter(
  //     position => position.address === specificAddress
  //   )
  // }

  positions.forEach(position => {
    const { positionData } = position

    const positionInfo = {
      index: parseInt(positionData[0], 10),
      kernel_creator: positionData[1],
      lender: positionData[2],
      borrower: positionData[3],
      relayer: positionData[4],
      wrangler: positionData[5],
      created_at: parseInt(positionData[6], 10) * 1000,
      updated_at: parseInt(positionData[7], 10) * 1000,
      expires_at: parseInt(positionData[8], 10) * 1000,
      borrow_currency_address: positionData[9],
      lend_currency_address: positionData[10],
      borrow_currency_value: web3Utils.fromWei(positionData[11]),
      borrow_currency_current_value: web3Utils.fromWei(positionData[12]),
      lend_currency_filled_value: web3Utils.fromWei(positionData[13]),
      lend_currency_owed_value: web3Utils.fromWei(positionData[14]),
      status: parseInt(positionData[15], 10),
      nonce: parseInt(positionData[16], 10),
      relayer_fee: web3Utils.fromWei(positionData[17]),
      monitoring_fee: web3Utils.fromWei(positionData[18]),
      rollover_fee: web3Utils.fromWei(positionData[19]),
      closure_fee: web3Utils.fromWei(positionData[20]),
      hash: positionData[21]
    }

    const {
      index,
      kernel_creator,
      lender,
      borrower,
      relayer,
      wrangler,
      created_at,
      updated_at,
      expires_at,
      borrow_currency_address,
      lend_currency_address,
      borrow_currency_value,
      borrow_currency_current_value,
      lend_currency_filled_value,
      lend_currency_owed_value,
      status,
      nonce,
      relayer_fee,
      monitoring_fee,
      rollover_fee,
      closure_fee,
      hash
    } = positionInfo

    let statusLabel = 'Unknown'
    switch (status) {
      case Constants.LOAN_STATUS_OPEN:
        statusLabel = 'Active'
        break
      case Constants.LOAN_STATUS_CLOSED:
        statusLabel = 'Closed'
        break
      case Constants.LOAN_STATUS_LIQUIDATED:
        statusLabel = 'Liquidated'
        break
      default:
        statusLabel = 'Unknown'
    }

    position.loanNumber = index + 1
    position.amount = lend_currency_filled_value
    position.totalInterest = Math.max(
      web3Utils.substract(lend_currency_owed_value, lend_currency_filled_value),
      0
    )
    position.term = (expires_at - Date.now()) / 1000
    position.status = statusLabel

    position.origin = {
      loanAmountBorrowed: lend_currency_filled_value,
      loanAmountOwed: lend_currency_owed_value,
      collateralAmount: borrow_currency_current_value,
      expiresAtTimestamp: expires_at,
      createdAtTimestamp: created_at,
      loanContract: Protocol,
      borrower,
      lender,
      wrangler,
      userAddress: address,
      loanStatus: status,
      kernel_creator,
      collateralToken: hash,
      loanToken: kernel_creator === lender ? lend_currency_address : lend_currency_address
    }

    position.detail = {
      index,
      kernel_creator,
      lender,
      borrower,
      relayer,
      wrangler,
      created_at,
      updated_at,
      expires_at,
      borrow_currency_address,
      lend_currency_address,
      borrow_currency_value,
      borrow_currency_current_value,
      lend_currency_filled_value,
      lend_currency_owed_value,
      status,
      nonce,
      relayer_fee,
      monitoring_fee,
      rollover_fee,
      closure_fee,
      hash
    }
  })

  // if (specificAddress) {
  //   let oldPos = oldPostions.lent.concat(oldPostions.borrowed)
  //   oldPos = oldPos.filter(position => position.address === specificAddress)
  //   positions = positions.concat(oldPos)
  // }

  const activePositions = positions.filter(
    position => position.origin.loanStatus !== Constants.LOAN_STATUS_CLOSED
  )

  callback(null, {
    positions: {
      lent: activePositions
        .filter(position => position.type === 'lent')
        .sort(
          (a, b) => b.origin.createdAtTimestamp - a.origin.createdAtTimestamp
        )
        .slice(0, 10),
      borrowed: activePositions
        .filter(position => position.type === 'borrowed')
        .sort(
          (a, b) => b.origin.createdAtTimestamp - a.origin.createdAtTimestamp
        )
        .slice(0, 10)
    },
    counts: [lendCount, borrowCount]
  })
}

export const wrapETH = (payload, callback) => {
  const { amount, isWrap, _WETHContractInstance, metamask, web3Utils } = payload

  if (isWrap) {
    _WETHContractInstance.methods
      .deposit()
      .send({ value: web3Utils.toWei(amount), from: metamask.address })
      .then(hash => callback(null, hash.transactionHash))
      .catch(err => callback(err))
  } else {
    _WETHContractInstance.methods
      .withdraw(web3Utils.toWei(amount))
      .send({ from: metamask.address })
      .then(hash => callback(null, hash.transactionHash))
      .catch(err => callback(err))
  }
}

export const allowance = (payload, callback) => {
  const {
    address,
    tokenContractInstance,
    tokenAllowance,
    protocolContract,
    web3Utils
  } = payload

  if (
    tokenAllowance === 0 ||
    !tokenContractInstance.methods.increaseApproval ||
    !tokenContractInstance.methods.decreaseApproval
  ) {
    tokenContractInstance.methods
      .approve(protocolContract._address,
        web3Utils.toWei('10000000000000000000')
      )
      .send({ from: address })
      .then(res => callback(null, res.transactionHash))
      .catch(err => callback(err))
  } else {
    tokenContractInstance.methods
      .increaseApproval(
        protocolContract._address,
        web3Utils.toWei('10000000000000000000')
      )
      .send({ from: address })
      .then(res => callback(null, res.transactionHash))
      .catch(err => callback(err))
  }
}

export const fillLoan = (payload, callback) => {
  const { approval, protocolContractInstance, metamask, web3Utils } = payload

  web3Utils.sendSignedTransaction(approval._signed_transaction)
  .then(hash => callback(null, hash.transactionHash))
  .catch(err => callback(err))
}

export const closePosition = (payload, callback) => {
  const { data, metamask } = payload

  data.origin.loanContract.methods
    .close_position(data.origin.collateralToken)
    .send({ from: data.origin.borrower })
    .then(hash => {
      setTimeout(callback, 5000, null, hash.transactionHash)
    })
    .catch(err => callback(err))
}

export const topUpPosition = (payload, callback) => {
  const { data, topUpCollateralAmount } = payload

  data.loanContract.methods
    .topup_position(data.collateralToken, topUpCollateralAmount)
    .send({ from: data.userAddress })
    .then(hash => {
      setTimeout(callback, 5000, null, hash.transactionHash)
    })
    .catch(err => callback(err))
}

export const liquidatePosition = (payload, callback) => {
  const { data } = payload

  data.origin.loanContract.methods
    .liquidate_position(data.origin.collateralToken)
    .send({ from: data.origin.userAddress })
    .then(hash => {
      setTimeout(callback, 5000, null, hash.transactionHash)
    })
    .catch(err => callback(err))
}

export const cancelOrder = async (payload, callback) => {
  const { data, protocolContractInstance, metamask, web3Utils } = payload

  // 1. an array of addresses[6] in this order: lender, borrower, relayer, wrangler, collateralToken, loanToken
  const addresses = [
    data.lender,
    data.borrower,
    data.relayer,
    data.wrangler,
    data.collateralToken,
    data.loanToken
  ]

  // 2. an array of uints[9] in this order: loanAmountOffered, interestRatePerDay, loanDuration, offerExpiryTimestamp, relayerFeeLST, monitoringFeeLST, rolloverFeeLST, closureFeeLST, creatorSalt
  const values = [
    data.loanAmountOffered,
    // data.interestRatePerDay,
    // data.loanDuration,
    // data.offerExpiry,
    data.relayerFeeLST,
    data.monitoringFeeLST,
    data.rolloverFeeLST,
    data.closureFeeLST
    // data.creatorSalt
  ]

  const orderHash = await protocolContractInstance.methods
    .kernel_hash(
      addresses,
      values,
      parseInt(data.offerExpiry, 10),
      data.creatorSalt,
      web3Utils.toWei(data.interestRatePerDay),
      // parseInt(data.interestRatePerDay, 10),
      parseInt(data.loanDuration, 10)
    )
    .call()
  const filledOrCancelledLoanAmount = await protocolContractInstance.methods
    .filled_or_cancelled_loan_amount(orderHash)
    .call()
  const cancelledCollateralTokenAmount = web3Utils.substractBN(
    data.loanAmountOffered,
    filledOrCancelledLoanAmount
  )

  protocolContractInstance.methods
    .cancel_kernel(
      addresses,
      values,
      parseInt(data.offerExpiry, 10),
      data.creatorSalt,
      web3Utils.toWei(data.interestRatePerDay),
      // parseInt(data.interestRatePerDay, 10),
      parseInt(data.loanDuration, 10),
      data.ecSignatureCreator,
      web3Utils.toWei(cancelledCollateralTokenAmount)
    )
    .send({ from: metamask.address })
    .then(result => callback(null, result))
    .catch(err => callback(err))
}
