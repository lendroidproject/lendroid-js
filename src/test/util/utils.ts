import { walletABI, walletByteCode } from './constants'
import { Contract, TransactionReceipt } from 'web3/types'

export interface IDeployedContractResponse {
    contract: Contract,
    receipt: TransactionReceipt
}

export const deployWalletContract = async (web3): Promise<IDeployedContractResponse> => {

    const account: string = (await web3.eth.getAccounts())[0]
    let contract = new web3.eth.Contract(walletABI)
    let receipt: TransactionReceipt

    contract = await contract.deploy({ data: walletByteCode })
        .send({
            from: account,
            gas: 4712388,
            gasPrice: '12388'
        })
        .on('error', error => {
            throw Error(error)
        })
        .on('receipt', rec => {
            if (!rec.contractAddress) {
                throw Error('An error occurred')
            }
            receipt = rec as TransactionReceipt
        })

    // @ts-ignore
    return { contract, receipt }
}