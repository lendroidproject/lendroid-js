"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
exports.fetchOrders = function (base, callback) {
    constants_1.apiGet(base, '/offers', callback);
};
exports.createOrder = function (base, data, callback) {
    constants_1.apiPost(base, '/offers', data, callback);
};
exports.fillOrderServer = function (base, id, value, callback) {
    constants_1.apiPost(base, "/offers/fill/" + id + "/" + value, {}, callback);
};
exports.deleteOrder = function (base, id, callback) {
    constants_1.apiDelete(base, "/offers/" + id, callback);
};
//# sourceMappingURL=orders.js.map