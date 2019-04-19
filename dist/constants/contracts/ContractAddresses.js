"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ABIs = require("./ContractABIs");
exports.CONTRACT_ADDRESSES = {
    Protocol: {
        1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        42: '0xba229b9E2e1C9a3427320B25fc3D194C4B9A3F30',
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
};
exports.CONTRACT_TOKENS = Object.keys(exports.CONTRACT_ADDRESSES);
exports.BALLANCE_TOKENS = exports.CONTRACT_TOKENS.filter(function (token) { return token.length < 5; });
//# sourceMappingURL=ContractAddresses.js.map