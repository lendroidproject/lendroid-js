import { Token } from './constants/tokens'
import { Context, Logger } from './services/logger'
import Web3 from 'web3'

/**
 * Initializes the Web3 provider
 */
export const startApp = () => {
    // @ts-ignore
    this.web3 = new Web3(web3.currentProvider)
    this.web3.eth.getAccounts().then(console.log)
    // @ts-ignore
    (new Web3(web3.currentProvider)).eth.getAccounts().then(console.log)
    //const web3 = new Web3Service(web3.currentProvider)
}

/**
 * TODO
 */
export class Lendroid {

    private web3;

    public deposit(amount: number, token: Token = Token.OMG): boolean {
        if (amount <= 0) {
            Logger.error(Context.DEPOSIT_FUNDS, `message=Invalid amount, amount=${amount}`)
            return false
        }

        // const contract: Contract = this.web3.eth.Contract(getWalletAbi, walletAddress)
        // contract.methods.deposit().send({})
        return true
    }
}

export const lendroid = new Lendroid()
