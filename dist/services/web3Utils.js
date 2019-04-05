"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Web3Utils = (function () {
    function Web3Utils(web3) {
        this.web3 = web3;
        this.eth = web3.eth;
        this.toWei = this.toWei.bind(this);
        this.fromWei = this.fromWei.bind(this);
        this.toBN = this.toBN.bind(this);
        this.toDecimal = this.toDecimal.bind(this);
        this.substract = this.substract.bind(this);
        this.substractBN = this.substractBN.bind(this);
        this.createContract = this.createContract.bind(this);
    }
    Web3Utils.prototype.toWei = function (value) {
        return this.web3.utils.toWei(value.toString(), 'ether');
    };
    Web3Utils.prototype.fromWei = function (value) {
        return this.web3.utils.fromWei(value.toString(), 'ether');
    };
    Web3Utils.prototype.toBN = function (value) {
        return this.web3.utils.toBN(value);
    };
    Web3Utils.prototype.toDecimal = function (value) {
        return this.web3.utils.toDecimal(value);
    };
    Web3Utils.prototype.substract = function (value1, value2) {
        var bnValue1 = this.toBN(this.toWei(value1));
        var bnValue2 = this.toBN(this.toWei(value2));
        return parseFloat(this.fromWei(bnValue1.sub(bnValue2)).toString());
    };
    Web3Utils.prototype.substractBN = function (value1, value2) {
        var bnValue1 = this.toBN(value1);
        var bnValue2 = this.toBN(value2);
        return parseFloat(this.fromWei(bnValue1.sub(bnValue2)).toString());
    };
    Web3Utils.prototype.createContract = function (abi, address) {
        return new this.eth.Contract(abi, address);
    };
    return Web3Utils;
}());
exports.Web3Utils = Web3Utils;
//# sourceMappingURL=web3Utils.js.map