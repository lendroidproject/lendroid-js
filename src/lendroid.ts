import { Token } from './constants/tokens'
import { Context, Logger } from './services/logger'
import { Web3Service } from './services/web3-service'
import { Contract } from 'web3/types'
import { getWalletAbi, walletAddress, wethAddress } from './constants/deployed-constants'
import * as t from 'web3/types'
import { ITransactionResponse } from './types/transaction-response'

/**
 * Initializes the Web3 provider
 */
export const startApp = () => {
    // @ts-ignore
    const web3 = new Web3Service(window.web3.currentProvider)
    const lendroid = new Lendroid()
    lendroid.depositFunds(12)
}

/**
 * TODO
 */
export class Lendroid {

    private API_ENDPOINT: string
    private web3Service = new Web3Service((window as any).web3.currentProvider)

    constructor(apiEndpoint = '', provider?: t.Provider | string) {
        this.API_ENDPOINT = apiEndpoint
        if (provider) {
            this.web3Service = new Web3Service(provider)
        }
    }

    /**
     * Deposits @param amount of @param token from the user's account to the
     * Wallet Smart Contract
     */
    public async depositFunds(amount: number, token: Token = Token.OMG): Promise<void> {
        Logger.log(Context.DEPOSIT_FUNDS, `message=Depositing ${amount} for ${token}`)

        if (amount <= 0) {
            Logger.error(Context.DEPOSIT_FUNDS, `message=Invalid amount, amount=${amount}`)
            return Promise.reject('Invalid amount')
        }

        // TODO: Abstract out to service
        const account = (await this.web3Service.Web3.eth.getAccounts())[0]

        // TODO: Abstract contract retrieval to service
        const contract: Contract = new this.web3Service.Web3.eth.Contract(await getWalletAbi(), walletAddress)
        return contract.methods.deposit().send({
            from: account,
            gas: 4712388,
            gasPrice: '12388',
            value: 500
            // TODO: Create single handler for these transactions
        }).then((response: ITransactionResponse) => {
            if (!response || !response.transactionHash) {
                Logger.error(Context.DEPOSIT_FUNDS, 'message=Unknown error occurred during transaction')
                return Promise.reject('An error occurred')
            }

            Logger.info(Context.DEPOSIT_FUNDS, 'message=Transaction succeeded')
            return Promise.resolve()
        }).catch(error => {
            Logger.error(Context.DEPOSIT_FUNDS, `message=An error occurred, error=${JSON.stringify(error)}`)
            return Promise.reject(error)
        })
    }

    /**
     * Commits @param amount of funds of @param token from the user's deposited balance (will error out if amount > deposited funds)
     * TODO: Test amount > deposited funds
     */
    public async commitFunds(amount: number, token: Token = Token.OMG): Promise<void> {
        Logger.log(Context.COMMIT_FUNDS, `message=Committing ${amount} for ${token}`)

        if (amount <= 0) {
            Logger.error(Context.COMMIT_FUNDS, `message=Invalid amount, amount=${amount}`)
            return Promise.reject('Invalid amount')
        }

        const account = (await this.web3Service.Web3.eth.getAccounts())[0]

        const contract: Contract = new this.web3Service.Web3.eth.Contract(await getWalletAbi(), walletAddress)
        return contract.methods.commitFunds(wethAddress, amount).send({
            from: account,
            gas: 4712388,
            gasPrice: '12388',
            value: 500
        }).then((response: ITransactionResponse) => {
            if (!response || !response.transactionHash) {
                Logger.error(Context.COMMIT_FUNDS, 'message=Unknown error occurred during transaction')
                return Promise.reject('An error occurred')
            }

            Logger.info(Context.COMMIT_FUNDS, 'message=Transaction succeeded')
            return Promise.resolve()
        }).catch(error => {
            Logger.error(Context.COMMIT_FUNDS, `message=An error occurred, error=${JSON.stringify(error)}`)
            return Promise.reject(error)
        })
    }

    public async getBalance() {
        const account = (await this.web3Service.Web3.eth.getAccounts())[0]
        const contract: Contract = new this.web3Service.Web3.eth.Contract(await getWalletAbi(), walletAddress)

        contract.methods.getBalance('0xcc2704ce33089d0f051eb0aff1750bb99fdfab46').call({ from: account })
            .then(result => console.log('\nHERE', result))
    }
}

export const lendroid = new Lendroid()
