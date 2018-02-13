export interface ILoanOffer {
    // Wallet address of loan creator
    lenderAddress: string
    // Loan market e.g. 'OMG/ETH'
    market: string
    // Address of OMG in OMG/ETH market
    loanTokenAddress: string
    // 1000 in 1000 OMG for 100 ETH
    loanTokenAmount: string
    // OMG in OMG/ETH market
    loanTokenSymbol: string
    // Address of ETH (WETH) in OMG/ETH market
    loanCostTokenAddress: string
    // 100 in 1000 OMG for 100 ETH
    loanCostTokenAmount: string
    // ETH in OMG/ETH market
    loanCostTokenSymbol: string
    // Smart contract address for token wanted for interest (currently same as loanCostToken so ETH)
    loanInterestTokenAddress: string
    // Fixed interest rate that lender sets for loan
    loanInterestTokenAmount: string
    // ETH in OMG/ETH
    loanInterestTokenSymbol: string
}

export interface ILoanOfferWithSignature extends ILoanOffer {
    ecSignature: string
}
