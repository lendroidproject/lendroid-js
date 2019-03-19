"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
exports.getTokenExchangeRate = function (token, callback) {
    var url = "https://api.coinmarketcap.com/v1/ticker/" + token.toLowerCase() + "//?convert=ETH";
    axios_1.default.get(url)
        .then(function (res) {
        var result = res.data[0];
        callback(1 / result.price_eth, token);
        setTimeout(exports.getTokenExchangeRate, 12 * 1000, token === 'WETH' ? 'DAI' : 'WETH', callback);
    });
};
//# sourceMappingURL=exchanges.js.map