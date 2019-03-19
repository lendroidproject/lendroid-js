"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
exports.postLoans = function (base, data, callback) {
    constants_1.apiPost(base, '/loan_requests', data, callback);
};
//# sourceMappingURL=loans.js.map