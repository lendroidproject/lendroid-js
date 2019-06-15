"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
exports.fetchOrders = function (base, callback) {
    constants_1.apiGet(base, '/offers', callback);
};
exports.createOrder = function (base, data, callback) {
    constants_1.apiPost(base, '/offers', data, callback);
};
exports.fillOrderServer = function (base, _a, callback) {
    var id = _a.id, value = _a.value, txHash = _a.txHash;
    constants_1.apiPost(base, "/offers/fill/" + id + "/" + value, { txHash: txHash }, callback);
};
exports.deleteOrder = function (base, _a, callback) {
    var id = _a.id, txHash = _a.txHash;
    constants_1.apiDelete(base, "/offers/" + id + "/" + txHash, callback);
};
//# sourceMappingURL=orders.js.map