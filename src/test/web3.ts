import * as chai from 'chai'
import * as ganache from 'ganache-cli'
import Web3 = require("web3")
import { walletABI, walletByteCode } from './constants'

const expect = chai.expect

describe('testing web3 functionality', () => {
    const password = 'test'

    it('should access locally running ethereum node', () => {
        // @ts-ignore
        // Substitute ganache.Provider() with 'http://localhost:8545' for local ethereum node testing
        const web3 = new Web3(ganache.provider())

        return web3.eth.getAccounts()
            .then((accounts: string []) => expect(accounts.length).to.be.greaterThan(0))
    })

    it('should successfully transfer eth from one account to another', async () => {
        // @ts-ignore
        const web3 = new Web3(ganache.provider())
        const transferValue = 10000000000000
        const coinbase: string = await web3.eth.getCoinbase()
        const testAccount: string = await web3.eth.personal.newAccount(password)
        // Unlocking account
        await web3.eth.personal.unlockAccount(testAccount, password, 1000)

        // Asserting that coinbase has enough value
        expect(parseInt(await web3.eth.getBalance(coinbase))).to.be.greaterThan(10000)
        // Asserting that new account is empty
        expect(parseInt(await web3.eth.getBalance(testAccount))).to.eq(0)

        // Sending ether from coinbase account to new account
        await web3.eth.sendTransaction({
            from: coinbase,
            to: testAccount,
            value: transferValue,
            gas: 4712388,
            gasPrice: '12388'
        })

        // Asserting that transfer was successful
        expect(parseInt(await web3.eth.getBalance(testAccount))).to.eq(transferValue)
    })

    it('should successfully interact with a deployed contract', async () => {
        // @ts-ignore
        const web3 = new Web3(ganache.provider({
            locked: false,
            unlocked_accounts: [0],
            total_accounts: 1
        }))
        const testAccount: string = (await web3.eth.getAccounts())[0]
        await web3.eth.personal.unlockAccount(testAccount, password)

        let contract = new web3.eth.Contract(walletABI)

        return contract.deploy({ data: walletByteCode })
            .send({
                from: testAccount,
                gas: 4712388,
                gasPrice: '12388'
            })
            .on('error', console.log)
            .on('receipt', receipt => expect(receipt.contractAddress).not.be.null)
            .then(deployedContract => contract = deployedContract)
            .then(async contract => {
                contract.setProvider(ganache.provider({
                    locked: false,
                    unlocked_accounts: [0],
                    total_accounts: 1
                }))

                await web3.eth.personal.unlockAccount(testAccount, password)
                // Making sure that accounts have not been overwritten
                expect((await web3.eth.getAccounts())[0]).to.eq(testAccount)

                // .send can modify contract state unlike .call
                return contract.methods.deposit().send({
                    from: testAccount,
                    gas: 4712388,
                    gasPrice: '12388',
                    value: 500
                })
            }).then(() => {
                // .call cannot modify contract state, can only call constant functions
                contract.methods.getBalance('0xcc2704ce33089d0f051eb0aff1750bb99fdfab46').call({ from: testAccount })
                    .then(result => console.log('\nHERE', result))
            })
    })
})