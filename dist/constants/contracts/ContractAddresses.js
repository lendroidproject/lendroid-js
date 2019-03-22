"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ABIs = require("./ContractABIs");
exports.CONTRACT_ADDRESSES = {
    Protocol: {
        1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        42: '0x81619C8640B62512eE6c494c0bb26CC38fC95400',
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
    },
    DAI: {
        1: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        42: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2',
        def: ABIs.DAIABI
    },
    DAI2ETH: {
        1: '0x729D19f657BD0614b4985Cf1D82531c67569197B',
        42: '0x9FfFE440258B79c5d6604001674A4722FfC0f7Bc',
        def: {
            hasNetwork: true,
            1: ABIs.DAI2ETHABI[1],
            42: ABIs.DAI2ETHABI[42]
        }
    }
};
exports.CONTRACT_TOKENS = Object.keys(exports.CONTRACT_ADDRESSES);
exports.BALLANCE_TOKENS = exports.CONTRACT_TOKENS.filter(function (token) { return token.length < 5; });
//# sourceMappingURL=ContractAddresses.js.map