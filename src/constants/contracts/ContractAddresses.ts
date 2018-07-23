import * as ABIs from './ContractABIs'

export const CONTRACT_ADDRESSES = {
  WETH: {
    1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    42: '0xd0a1e359811322d97991e03f863a0c30c2cf029c'
  },
  LST: {
    1: '0x4de2573e27E648607B50e1Cfff921A33E4A34405',
    42: '0x13a68a7cc8564C23390870FF33504F38289ff87e',
    def: ABIs.LSTABI
  },
  DAI: {
    1: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
    42: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2',
    def: ABIs.DAIABI
  },
  LoanOfferRegistry: {
    42: '0x9f2d0e710754046c35fc7fc29b4ae12c7ac7568b',
    def: ABIs.LoanOfferRegisteryABI
  },
  LoanRegistry: {
    42: '0xc31ea8c26a74490c70e98c0badf37bb7ec97cc0c',
    def: ABIs.LoanRegistryABI
  },
  Loan: {
    42: '0x0000000000000000000000000000000000000000',
    def: ABIs.LoanABI
  },
  WranglerLoanRegistry: {
    42: '0x0000000000000000000000000000000000000000',
    def: ABIs.WranglerLoanRegistryABI
  },
  TokenTransferProxy: {
    42: '0xcc94204e4a20c3c371e6bad853f04f079d4b1540',
    def: ABIs.TokenTransferProxyABI
  },
}

export const CONTRACT_TOKENS = Object.keys(CONTRACT_ADDRESSES)
export const BALLANCE_TOKENS = CONTRACT_TOKENS.filter(token => token.length < 5 && token !== 'Loan')
