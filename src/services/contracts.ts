import axios from 'axios'
import Web3 from 'web3'
import * as Constants from '../constants'

export const fetchContractByToken = (token, payload, callback) => {
  const { network } = payload
  const web3 = payload.web3 as Web3
  const { CONTRACT_ADDRESSES } = Constants

  if (!CONTRACT_ADDRESSES[token][network]) {
    return callback({ message: 'Unknown' })
  }

  if (!CONTRACT_ADDRESSES[token].def) {
    const url = `https://${network === 1 ? 'api' : 'api-kovan'}.etherscan.io/api?module=contract&action=getabi&address=${CONTRACT_ADDRESSES[token][network]}`
    axios.get(url)
      .then(res => {
        const contractABI = JSON.parse(res.data.result)
        const contractInstance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESSES[token][network])
        callback(null, { data: contractInstance })
      })
      .catch(err => callback(err))
  } else {
    const contractABI = CONTRACT_ADDRESSES[token].def
    const contractInstance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESSES[token][network])
    callback(null, { data: contractInstance })
  }
}

export const fetchETHBallance = (payload, callback) => {
  const { address } = payload
  const web3 = payload.web3 as Web3

  web3.eth.getBalance(address)
    .then(value => {
      callback(null, { data: web3.utils.fromWei(value.toString(), 'ether') })
    })
    .catch(err => callback(err))
}

export const fetchBallanceByToken = (payload, callback) => {
  const { address } = payload
  const web3 = payload.web3 as Web3
  const contractInstance = payload.contractInstance

  if (!contractInstance.methods.balanceOf) { return callback({ message: 'No ballanceOf() in Contract Instance' }) }
  contractInstance.methods.balanceOf(address)
    .call()
    .then(res => {
      const value = web3.utils.fromWei(res.toString(), 'ether')
      callback(null, { data: value })
    })
    .catch(err => callback(err))
}

export const fetchAllowanceByToken = (payload, callback) => {
  const { address, contractInstance, tokenTransferProxyContract } = payload
  const web3 = payload.web3 as Web3

  if (!contractInstance.methods.allowance) { return callback({ message: 'No allowance() in Contract Instance' }) }
  contractInstance.methods.allowance(address, tokenTransferProxyContract.address)
    .call()
    .then(res => {
      const value = web3.utils.fromWei(res.toString(), 'ether')
      callback(null, { data: value })
    })
    .catch(err => callback(err))
}

export const fetchLoanPositions = (payload, callback) => {
  const { address, LoanRegistry, Loan } = payload
  const web3 = payload.web3 as Web3
  const loanABI = Loan.abi

  LoanRegistry.methods.getLoanCounts(address).call()
    .then(async (err, res) => {
      if (err) { return callback(err) }

      const counts = res.map(item => item.toNumber())
      const positions: any[] = []

      for (let i = 0; i < counts[0]; i++) {
        const response = await LoanRegistry.methods.lentLoans(address, i).call()
        positions.push({
          type: 'lent',
          address: response
        })
      }
      for (let i = 0; i < counts[1]; i++) {
        const response = await LoanRegistry.methods.borrowedLoans(address, i).call()
        positions.push({
          type: 'borrowed',
          address: response
        })
      }

      for (const position of positions) {
        const loanContract = new web3.eth.Contract(loanABI, position.address)

        // a. `AMOUNT` is`Loan.loanAmountBorrowed()`
        // b. `TOTAL INTEREST` is`Loan.loanAmountOwed() - Loan.loanAmountBorrowed()`
        // c. `TERM` is`Loan.expiresAtTimestamp - currentTimestamp`
        // d. `LOAN HEALTH` is calculated as follows:
        //   i. `var currentCollateralAmount = Loan.loanAmountBorrowed() / eth_To_DAI_Rate`
        //   ii.display the result of`Loan.collateralAmount() / currentCollateralAmount * 100`
        let loanAmountBorrowed = await loanContract.methods.loanAmountBorrowed().call()
        loanAmountBorrowed = web3.utils.fromWei(loanAmountBorrowed.toString(), 'ether')
        let loanStatus = await loanContract.methods.status().call()
        loanStatus = web3.utils.fromWei(loanStatus.toString(), 'ether')
        let loanAmountOwed = await loanContract.methods.loanAmountOwed().call()
        loanAmountOwed = web3.utils.fromWei(loanAmountOwed.toString(), 'ether')
        let collateralAmount = await loanContract.methods.collateralAmount().call()
        collateralAmount = web3.utils.fromWei(collateralAmount.toString(), 'ether')
        let expiresAtTimestamp = await loanContract.methods.expiresAtTimestamp().call()
        expiresAtTimestamp = expiresAtTimestamp.toString() * 1000
        let createdAtTimestamp = await loanContract.methods.createdAtTimestamp().call()
        createdAtTimestamp = createdAtTimestamp.toString() * 1000
        const borrower = await loanContract.methods.borrower().call()
        const wrangler = await loanContract.methods.wrangler().call()
        const owner = await loanContract.methods.owner().call()

        position.loanNumber = address
        position.amount = loanAmountBorrowed
        position.totalInterest = parseFloat(loanAmountOwed.toString()) - parseFloat(loanAmountBorrowed.toString())
        position.term = (parseInt(expiresAtTimestamp.toString(), 10) - Date.now()) / 3600

        let status = 'Unknown'
        switch (loanStatus) {
          case Constants.LOAN_STATUS_ACTIVE: status = 'Active'; break
          case Constants.LOAN_STATUS_CLOSED: status = 'Closed'; break
          case Constants.LOAN_STATUS_LIQUIDATED: status = 'Liquidated'; break
          case Constants.LOAN_STATUS_LIQUIDATING: status = 'Liquidating'; break
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
          wrangler,
          userAddress: address,
          loanStatus,
          owner,
        }
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
  const { amount, isWrap, _WETHContractInstance } = payload
  const web3 = payload.web3 as Web3

  if (isWrap) {
    _WETHContractInstance.methods.deposit({ value: web3.utils.toWei(amount.toString(), 'ether') }).send()
      .then(hash => callback(null, hash))
      .catch(err => callback(err))
  } else {
    _WETHContractInstance.methods.withdraw(web3.utils.toWei(amount.toString(), 'ether'), {}).send()
      .then(hash => callback(null, hash))
      .catch(err => callback(err))
  }
}

export const allowance = (payload, callback) => {
  const { address, tokenContractInstance, tokenAllowance, newAllowance, tokenTransferProxyContract } = payload
  const web3 = payload.web3 as Web3

  if (
    tokenAllowance === 0
    || !tokenContractInstance.methods.increaseApproval
    || !tokenContractInstance.methods.decreaseApproval) {
    tokenContractInstance.methods.approve(
      tokenTransferProxyContract.address,
      web3.utils.toWei(newAllowance.toString(), 'ether'),
      { from: address })
      .send()
      .then(hash => callback(null, hash))
      .catch(err => callback(err))
  } else {
    if (newAllowance > tokenAllowance) {
      tokenContractInstance.methods.increaseApproval(
        tokenTransferProxyContract.address,
        web3.utils.toWei((newAllowance - tokenAllowance).toString(), 'ether'),
        { from: address })
        .send()
        .then(hash => callback(null, hash))
        .catch(err => callback(err))
    } else {
      tokenContractInstance.methods.decreaseApproval(
        tokenTransferProxyContract.address,
        web3.utils.toWei((tokenAllowance - newAllowance).toString(), 'ether'),
        { from: address })
        .send()
        .then(hash => callback(null, hash))
        .catch(err => callback(err))
    }
  }
}

export const fillLoan = (payload, callback) => {
  const { approval, loanOfferRegistryContractInstance } = payload

  loanOfferRegistryContractInstance.methods.fill(
    approval._addresses,
    approval._values,
    approval._vS,
    approval._rS,
    approval._sS,
    approval._isOfferCreatorLender
  ).send()
    .then(hash => callback(null, hash))
    .catch(err => callback(err))
}

export const closePosition = (payload, callback) => {
  const { data } = payload

  data.origin.loanContract.methods.close(
    data.origin.collateralToken,
    { from: data.origin.userAddress }
  )
    .send()
    .then(hash => {
      setTimeout(callback, 5000, null, hash)
    })
    .catch(err => callback(err))
}

export const topUpPosition = (payload, callback) => {
  const { data, topUpCollateralAmount } = payload

  data.LoanContract.methods.topUp(
    data.collateralToken,
    topUpCollateralAmount,
    { from: data.userAddress },
    callback
  )
    .send()
    .then(hash => {
      setTimeout(callback, 5000, null, hash)
    })
    .catch(err => callback(err))
}

export const cancelOrder = async (payload, callback) => {
  const { data, currentWETHExchangeRate, loanOfferRegistryContractInstance } = payload
  const web3 = payload.web3 as Web3

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
    data.offerExpiryTimestamp,
    data.relayerFeeLST,
    data.monitoringFeeLST,
    data.rolloverFeeLST,
    data.closureFeeLST,
    data.creatorSalt
  ]

  const orderHash = await loanOfferRegistryContractInstance.methods.computeOfferHash(addresses, values).call()
  let filledAmount = await loanOfferRegistryContractInstance.methods.filled(orderHash).call()
  filledAmount = web3.utils.fromWei(filledAmount.toString(), 'ether')
  const cancelledCollateralTokenAmount = data.loanAmountOffered * currentWETHExchangeRate - filledAmount
  loanOfferRegistryContractInstance.methods.cancel(
    addresses,
    values,
    data.vCreator,
    data.rCreator,
    data.sCreator,
    web3.utils.toWei(cancelledCollateralTokenAmount.toString(), 'ether'),
  ).send()
    .then(result => callback(null, result))
    .catch(err => callback(err))
}
