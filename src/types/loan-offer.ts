export interface ILoanOffer {
    // Wallet address of loan creator
    lenderAddress: string
    // Loan market e.g. 'OMG/ETH'
    tokenPair: string
    // Address of OMG in OMG/ETH market
    baseTokenAddress: string
    // Address of ETH (WETH) in OMG/ETH market
    quoteTokenAddress: string
    // 1000 in 1000 OMG for 100 ETH
    loanQuantity: number
    // OMG in OMG/ETH market
    loanToken: string
    // Address of OMG in OMG/ETH market
    loanTokenAddress: string
    // 100 in 1000 OMG for 100 ETH
    loanCostAmount: number
    // ETH in OMG/ETH market
    loanCostToken: string
    // Fixed interest rate that lender sets for loan
    loanInterestAmount: number
    // Smart contract address for token wanted for interest (currently same as quote token so ETH)
    loanInterestTokenAddress: string
    // loanCostAmount - loanInterest amount
    loanDepositAmount: number
    // ETH address in OMG/ETH market
    loanDepositTokenAddress: string
}

export interface ILoanOfferWithSignature extends ILoanOffer {
    ecSignature: string
}
