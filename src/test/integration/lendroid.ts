import * as chai from 'chai'
import * as ganache from 'ganache-cli'
import { deployWalletContract, IDeployedContractResponse } from '../util/utils'
import { Contract, TransactionReceipt } from 'web3/types'
import { Lendroid } from '../../lendroid'

const expect = chai.expect

// Password for newly generated accounts in testing
const password = 'password'

describe('Lendroid', () => {
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
        const deposit = 50

        await lendroid.depositFunds(deposit)

        setTimeout(async () => {
            expect(await lendroid.getWithdrawableBalance()).to.equal(deposit)
        }, 8000)
    })
})