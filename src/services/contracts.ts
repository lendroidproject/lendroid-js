import axios from 'axios'
import * as Constants from '../constants'

export const fetchContractByToken = (token, payload, callback) => {
  const { network, web3Utils } = payload
  const { CONTRACT_ADDRESSES } = Constants

  if (!CONTRACT_ADDRESSES[token][network]) {
    return callback({ message: 'Unknown' })
  }

  if (!CONTRACT_ADDRESSES[token].def) {
    const url = `https://${network === 1 ? 'api' : 'api-kovan'}.etherscan.io/api?module=contract&action=getabi&address=${CONTRACT_ADDRESSES[token][network]}`
    axios.get(url)
      .then(res => {
        const contractABI = JSON.parse(res.data.result)
        const contractInstance = web3Utils.createContract(contractABI, CONTRACT_ADDRESSES[token][network])
        callback(null, { data: contractInstance })
      })
      .catch(err => callback(err))
  } else {
    const contractABI = CONTRACT_ADDRESSES[token].def
    const contractInstance = web3Utils.createContract(contractABI, CONTRACT_ADDRESSES[token][network])
    callback(null, { data: contractInstance })
  }
}

export const fetchETHBallance = (payload, callback) => {
  const { address, web3Utils } = payload

  web3Utils.eth.getBalance(address)
    .then(value => {
      callback(null, { data: web3Utils.fromWei(value) })
    })
    .catch(err => callback(err))
}

export const fetchBallanceByToken = (payload, callback) => {
  const { address, web3Utils } = payload
  const contractInstance = payload.contractInstance

  if (!contractInstance.methods.balanceOf) { return callback({ message: 'No ballanceOf() in Contract Instance' }) }
  contractInstance.methods.balanceOf(address)
    .call()
    .then(res => {
      const value = web3Utils.fromWei(res)
      callback(null, { data: value })
    })
    .catch(err => callback(err))
}

export const fetchAllowanceByToken = (payload, callback) => {
  const { address, contractInstance, tokenTransferProxyContract, web3Utils } = payload

  if (!contractInstance.methods.allowance) { return callback({ message: 'No allowance() in Contract Instance' }) }
  contractInstance.methods.allowance(address, tokenTransferProxyContract._address)
    .call({ from: address })
    .then(res => {
      const value = web3Utils.fromWei(res)
      callback(null, { data: value })
    })
    .catch(err => callback(err))
}

export const fetchLoanPositions = (payload, callback) => {
  const { address, LoanRegistry, Loan, specificAddress, oldPostions, web3Utils } = payload
  const loanABI = Loan._jsonInterface

  LoanRegistry.methods.getLoanCounts(address).call()
    .then(async res => {

      const counts = res
      counts[0] = Number(counts[0])
      counts[1] = Number(counts[1])
      let positions: any[] = []

      const lentPositionExists = {}
      for (let i = 0; i < counts[0]; i++) {
        const response = await LoanRegistry.methods.lentLoans(address, i).call()
        if (!lentPositionExists[response]) {
          lentPositionExists[response] = true
          positions.push({
            type: 'lent',
            address: response
          })
        }
      }

      const borrowedPositionExists = {}
      for (let i = 0; i < counts[1]; i++) {
        const response = await LoanRegistry.methods.borrowedLoans(address, i).call()
        if (!borrowedPositionExists[response]) {
          borrowedPositionExists[response] = true
          positions.push({
            type: 'borrowed',
            address: response
          })
        }
      }

      if (specificAddress) {
        positions = positions.filter(position => position.address === specificAddress)
      }

      for (const position of positions) {
        const loanContract = web3Utils.createContract(loanABI, position.address)

        // a. `AMOUNT` is`Loan.loanAmountBorrowed()`
        // b. `TOTAL INTEREST` is`Loan.loanAmountOwed() - Loan.loanAmountBorrowed()`
        // c. `TERM` is`Loan.expiresAtTimestamp - currentTimestamp`
        // d. `LOAN HEALTH` is calculated as follows:
        //   i. `var currentCollateralAmount = Loan.loanAmountBorrowed() / eth_To_DAI_Rate`
        //   ii.display the result of`Loan.collateralAmount() / currentCollateralAmount * 100`
        let loanAmountBorrowed = await loanContract.methods.loanAmountBorrowed().call()
        loanAmountBorrowed = web3Utils.fromWei(loanAmountBorrowed)
        const loanStatus = await loanContract.methods.status().call()
        let loanAmountOwed = await loanContract.methods.loanAmountOwed().call()
        loanAmountOwed = web3Utils.fromWei(loanAmountOwed)
        let collateralAmount = await loanContract.methods.collateralAmount().call()
        collateralAmount = web3Utils.fromWei(collateralAmount)
        let expiresAtTimestamp = await loanContract.methods.expiresAtTimestamp().call()
        expiresAtTimestamp = expiresAtTimestamp * 1000
        let createdAtTimestamp = await loanContract.methods.createdAtTimestamp().call()
        createdAtTimestamp = createdAtTimestamp * 1000
        const borrower = await loanContract.methods.borrower().call()
        const lender = await loanContract.methods.lender().call()
        const wrangler = await loanContract.methods.wrangler().call()
        const owner = await loanContract.methods.owner().call()
        const collateralToken = await loanContract.methods.collateralToken().call()

        position.loanNumber = position.address
        position.amount = loanAmountBorrowed
        position.totalInterest = web3Utils.substract(loanAmountOwed, loanAmountBorrowed)
        position.totalInterest = position.totalInterest < 0 ? 0 : position.totalInterest
        position.term = (parseInt(expiresAtTimestamp.toString(), 10) - Date.now()) / 1000

        let status = 'Unknown'
        switch (Number(loanStatus)) {
          case Constants.LOAN_STATUS_ACTIVE: status = 'Active'; break
          case Constants.LOAN_STATUS_CLOSED: status = 'Closed'; break
          case Constants.LOAN_STATUS_LIQUIDATED: status = 'Liquidated'; break
          case Constants.LOAN_STATUS_LIQUIDATING: status = 'Liquidating'; break
          case Constants.LOAN_STATUS_DEACTIVATED: status = 'Deactivated'; break
          default: status = 'Unknown'
        }

        position.status = status

        position.origin = {
          loanAmountBorrowed,
          loanAmountOwed,
          collateralAmount,
          expiresAtTimestamp,
          createdAtTimestamp,
          loanContract,
          borrower,
          lender,
          wrangler,
          userAddress: address,
          loanStatus: Number(loanStatus),
          owner,
          collateralToken,
        }
      }

      if (specificAddress) {
        let oldPos = oldPostions.lent.concat(oldPostions.borrowed)
        oldPos = oldPos.filter(position => position.address === specificAddress)
        positions = positions.concat(oldPos)
      }

      const activePositions = positions.filter(position => position.origin.loanStatus !== Constants.LOAN_STATUS_DEACTIVATED)

      callback(null, {
        positions: {
          lent: activePositions
            .filter(position => (position.type === 'lent'))
            .sort((a, b) => (b.origin.createdAtTimestamp - a.origin.createdAtTimestamp))
            .slice(0, 10),
          borrowed: activePositions
            .filter(position => (position.type === 'borrowed'))
            .sort((a, b) => (b.origin.createdAtTimestamp - a.origin.createdAtTimestamp))
            .slice(0, 10),
        },
        counts
      })
    })
    .catch(err => callback(err))
}

export const wrapETH = (payload, callback) => {
  const { amount, isWrap, _WETHContractInstance, metamask, web3Utils } = payload

  if (isWrap) {
    _WETHContractInstance.methods.deposit().send({ value: web3Utils.toWei(amount), from: metamask.address })
      .then(hash => callback(null, hash.transactionHash))
      .catch(err => callback(err))
  } else {
    _WETHContractInstance.methods.withdraw(web3Utils.toWei(amount)).send({ from: metamask.address })
      .then(hash => callback(null, hash.transactionHash))
      .catch(err => callback(err))
  }
}

export const allowance = (payload, callback) => {
  const { address, tokenContractInstance, tokenAllowance, newAllowance, tokenTransferProxyContract, web3Utils } = payload

  if (
    tokenAllowance === 0
    || !tokenContractInstance.methods.increaseApproval
    || !tokenContractInstance.methods.decreaseApproval) {
    tokenContractInstance.methods.approve(
      tokenTransferProxyContract._address,
      web3Utils.toWei(newAllowance)
    )
      .send({ from: address })
      .then(res => callback(null, res.transactionHash))
      .catch(err => callback(err))
  } else {
    if (newAllowance > tokenAllowance) {
      tokenContractInstance.methods.increaseApproval(
        tokenTransferProxyContract._address,
        web3Utils.toWei(newAllowance - tokenAllowance)
      )
        .send({ from: address })
        .then(res => callback(null, res.transactionHash))
        .catch(err => callback(err))
    } else {
      tokenContractInstance.methods.decreaseApproval(
        tokenTransferProxyContract._address,
        web3Utils.toWei(tokenAllowance - newAllowance)
      )
        .send({ from: address })
        .then(res => callback(null, res.transactionHash))
        .catch(err => callback(err))
    }
  }
}

export const fillLoan = (payload, callback) => {
  const { approval, loanOfferRegistryContractInstance, metamask } = payload

  loanOfferRegistryContractInstance.methods.fill(
    approval._addresses,
    approval._values,
    approval._vS,
    approval._rS,
    approval._sS,
    approval._isOfferCreatorLender
  ).send({ from: metamask.address })
    .then(hash => callback(null, hash))
    .catch(err => callback(err))
}

export const closePosition = (payload, callback) => {
  const { data, metamask } = payload

  data.origin.loanContract.methods.close(
    data.origin.collateralToken
  )
    .send({ from: data.origin.borrower })
    .then(hash => {
      setTimeout(callback, 5000, null, hash)
    })
    .catch(err => callback(err))
}

export const cleanContract = (payload, callback) => {
  const { wranglerLoanRegistry, data } = payload

  wranglerLoanRegistry.methods.releaseContract(data.address)
    .send({ from: data.origin.userAddress })
    .then(hash => {
      setTimeout(callback, 5000, null, hash)
    })
    .catch(err => callback(err))
}

export const topUpPosition = (payload, callback) => {
  const { data, topUpCollateralAmount } = payload

  data.loanContract.methods.topUp(
    data.collateralToken,
    topUpCollateralAmount
  )
    .send({ from: data.userAddress })
    .then(hash => {
      setTimeout(callback, 5000, null, hash)
    })
    .catch(err => callback(err))
}

export const liquidatePosition = (payload, callback) => {
  const { data } = payload

  data.origin.loanContract.methods.liquidate(
    data.origin.collateralToken
  )
    .send({ from: data.origin.userAddress })
    .then(hash => {
      setTimeout(callback, 5000, null, hash)
    })
    .catch(err => callback(err))
}

export const cancelOrder = async (payload, callback) => {
  const { data, currentWETHExchangeRate, loanOfferRegistryContractInstance, metamask, web3Utils } = payload

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
    data.interestRatePerDay,
    data.loanDuration,
    // data.offerExpiryTimestamp,
    data.offerExpiry,
    data.relayerFeeLST,
    data.monitoringFeeLST,
    data.rolloverFeeLST,
    data.closureFeeLST,
    data.creatorSalt
  ]

  const orderHash = await loanOfferRegistryContractInstance.methods.computeOfferHash(addresses, values).call()
  const filledOrCancelledLoanAmount = await loanOfferRegistryContractInstance.methods.getFilledOrCancelledLoanAmount(orderHash).call()
  const cancelledCollateralTokenAmount = web3Utils.substractBN(data.loanAmountOffered, filledOrCancelledLoanAmount)
  loanOfferRegistryContractInstance.methods.cancel(
    addresses,
    values,
    data.vCreator,
    data.rCreator,
    data.sCreator,
    cancelledCollateralTokenAmount.toString(),
  ).send({ from: metamask.address })
    .then(result => callback(null, result))
    .catch(err => callback(err))
}
