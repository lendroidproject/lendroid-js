import * as chai from 'chai'
import Web3 = require("web3")

const expect = chai.expect

describe('testing web3 functionality', () => {

    // WARNING: This test will fail if you have no local Ethereum node with at least one account running
    it('should access locally running ethereum node', () => {
        // @ts-ignore
        const web3 = new Web3('http://localhost:8545')

        return web3.eth.getAccounts(console.log)
            .then((accounts: string []) => expect(accounts.length).to.be.greaterThan(0))
    })
})