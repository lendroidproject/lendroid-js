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
    42: '0x3f5583e0e2f3f75ead2a45069d41ba1ea276be2c',
    def: ABIs.LoanOfferRegisteryABI
  },
  LoanRegistry: {
    42: '0xb3e45863e672b464def4e47ae9ff0f1da21d97b4',
    def: ABIs.LoanRegistryABI
  },
  Loan: {
    42: '0x64c87220016e1ce2074f18d716ee6d358c19870b',
    def: ABIs.LoanABI
  },
  WranglerLoanRegistry: {
    42: '0xf2a61b8fe53fbf6f5a26663680a437c5f45eb94b',
    def: ABIs.WranglerLoanRegistryABI
  },
  TokenTransferProxy: {
    42: '0xf1dbcef9820a758eead322f525e38c9289dc09d0',
    def: ABIs.TokenTransferProxyABI
  },
}

export const CONTRACT_TOKENS = Object.keys(CONTRACT_ADDRESSES)
export const BALLANCE_TOKENS = CONTRACT_TOKENS.filter(token => token.length < 5 && token !== 'Loan')
