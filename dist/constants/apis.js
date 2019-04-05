"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
exports.apiGet = function (base, endPoint, cb) {
    var url = base + endPoint;
    axios_1.default
        .get(url)
        .then(function (res) {
        cb(null, res.data);
    })
        .catch(function (err) {
        cb(err);
    });
};
exports.apiPost = function (base, endPoint, data, cb) {
    var url = base + endPoint;
    axios_1.default
        .post(url, data)
        .then(function (res) {
        cb(null, res.data);
    })
        .catch(function (err) {
        cb(err);
    });
};
exports.apiDelete = function (base, endPoint, cb) {
    var url = base + endPoint;
    axios_1.default
        .delete(url)
        .then(function (res) {
        cb(null, res);
    })
        .catch(function (err) {
        cb(err);
    });
};
//# sourceMappingURL=apis.js.map