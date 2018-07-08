export interface ILoanOffer {
  // Wallet address of loan creator
  lenderAddress: string
  // Loan market e.g. 'OMG/WETH'
  market: string
  // Address of OMG in OMG/WETH market
  loanTokenAddress: string
  // 1000 in 1000 OMG for 100 WETH
  loanTokenAmount: string
  // OMG in OMG/WETH market
  loanTokenSymbol: string
  // Address of WETH (WETH) in OMG/WETH market
  loanCostTokenAddress: string
  // 100 in 1000 OMG for 100 WETH
  loanCostTokenAmount: string
  // WETH in OMG/WETH market
  loanCostTokenSymbol: string
  // Smart contract address for token wanted for interest (currently same as loanCostToken so WETH)
  loanInterestTokenAddress: string
  // Fixed interest rate that lender sets for loan
  loanInterestTokenAmount: string
  // WETH in OMG/WETH
  loanInterestTokenSymbol: string
  wranglerAddress: string
}

export interface ILoanOfferWithSignature extends ILoanOffer {
  ecSignature: string
}
