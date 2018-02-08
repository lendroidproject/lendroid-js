export interface ILoanOffer {
    lenderAddress: string
    tokenPair: string
    loanQuantity: number
    loanToken: string
    costAmount: number
    costToken: string
}

export interface ILoanOfferWithSignature extends ILoanOffer {
    ecSignature: string
}
