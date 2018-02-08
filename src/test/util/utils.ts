import * as ganache from 'ganache-cli'
import Web3 = require("web3")
import { walletABI, walletByteCode } from './constants'
import { Contract } from 'web3/types'

export const deployWalletContract = async (contractAddresss: string): Promise<Contract> => {
    // @ts-ignore
    const web3 = new Web3(ganache.provider({
        locked: false,
        unlocked_accounts: [0],
        total_accounts: 1
    }))

    const account: string = (await web3.eth.getAccounts())[0]
    let contract = new web3.eth.Contract(walletABI)

    return contract.deploy({ data: walletByteCode })
        .send({
            from: account,
            gas: 4712388,
            gasPrice: '12388'
        })
        .on('error', error => {
            throw Error(error)
        })
        .on('receipt', receipt => {
            if (!receipt.contractAddress) {
                throw Error('An error occurred')
            }
        })
}