"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
exports.getTokenExchangeRate = function (token, callback) {
    var url = "https://min-api.cryptocompare.com/data/price?fsym=" + token + "&tsyms=ETH";
    axios_1.default.get(url)
        .then(function (res) {
        var result = res.data.ETH;
        callback(1 / result);
    })
        .catch(function (err) {
        callback(1);
    });
};
//# sourceMappingURL=exchanges.js.map