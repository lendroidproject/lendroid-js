import * as chai from 'chai'
import 'mocha'
import * as ganache from 'ganache-cli'
import { deployWalletContract, IDeployedContractResponse } from '../util/utils'
import { Contract, TransactionReceipt } from 'web3/types'
import { Lendroid } from '../../lendroid'
import { Context } from '../../services/logger'

const expect = chai.expect

// Password for newly generated accounts in testing
const password = 'password'

describe('Lendroid', function () {
    this.timeout(6000)

    const lendroid = new Lendroid('', ganache.provider({
        locked: false,
        total_accounts: 1
    }))

    let contract: Contract
    let receipt: TransactionReceipt
    let contractAddress: string
    let testAccount: string

    // Deploying a Wallet contract before each test
    before(async () => {
        const response: IDeployedContractResponse = await deployWalletContract(lendroid.Web3)
        contract = response.contract
        receipt = response.receipt
        contractAddress = response.receipt.contractAddress
        testAccount = await lendroid.Web3.eth.personal.newAccount(password)
    })

    it('successfully executes the deposit() function', async () => {
        const deposit = 50000000000000444556777888

        const transactionHash = await lendroid.depositFunds(deposit)

        await lendroid.ensureTransactionSuccess(transactionHash, Context.GET_LOAN_OFFERS)

        expect(await lendroid.getWithdrawableBalance()).to.equal(deposit)
    })
})