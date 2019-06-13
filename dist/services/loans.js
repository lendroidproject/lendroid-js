"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
exports.postLoans = function (base, data, callback) {
    constants_1.apiPost(base, '/loan_requests', data, callback);
};
exports.getLoanHealth = function (base, id, callback) {
    constants_1.apiGet(base, "/loan_request/" + id, callback);
};
//# sourceMappingURL=loans.js.map