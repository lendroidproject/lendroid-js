/**
 * Assumes valid inputs
 */
export class Wallet {

    public deposit(): string {
        return 'deposit()'
    }

    public commit(tokenAddress: string, amount: number): string {
        return `commitFunds(${tokenAddress}, ${amount})`
    }
}

export const wallet = new Wallet()
