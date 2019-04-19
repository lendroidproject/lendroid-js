import * as ABIs from './ContractABIs'

export const CONTRACT_ADDRESSES = {
  Protocol: {
    1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    42: '0xba229b9E2e1C9a3427320B25fc3D194C4B9A3F30',
    // 42: '0x81619C8640B62512eE6c494c0bb26CC38fC95400',
    def: ABIs.ProtocolABI
  },
  WETH: {
    1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    42: '0xd0A1E359811322d97991E03f863a0C30C2cF029C'
  },
  LST: {
    1: '0x4de2573e27E648607B50e1Cfff921A33E4A34405',
    42: '0x13a68a7cc8564C23390870FF33504F38289ff87e',
    def: ABIs.LSTABI
  }
}

export const CONTRACT_TOKENS = Object.keys(CONTRACT_ADDRESSES)
export const BALLANCE_TOKENS = CONTRACT_TOKENS.filter(token => token.length < 5)
