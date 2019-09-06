"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var Constants = require("../constants");
exports.fetchContractByToken = function (token, payload, callback) {
    var network = payload.network, web3Utils = payload.web3Utils, contractAddresses = payload.contractAddresses;
    if (!contractAddresses[token][network]) {
        return callback({ message: 'Unknown' });
    }
    if (!contractAddresses[token].def) {
        var url = "https://" + (network === 1 ? 'api' : 'api-kovan') + ".etherscan.io/api?module=contract&action=getabi&address=" + contractAddresses[token][network];
        axios_1.default
            .get(url)
            .then(function (res) {
            if (Number(res.data.status)) {
                var contractABI = JSON.parse(res.data.result);
                var contractInstance = web3Utils.createContract(contractABI, contractAddresses[token][network]);
                callback(null, { data: contractInstance });
            }
            else {
                callback({ message: res.data.result });
            }
        })
            .catch(function (err) { return callback(err); });
    }
    else {
        var contractABI = contractAddresses[token].def;
        var contractInstance = web3Utils.createContract(contractABI.hasNetwork ? contractABI[network] : contractABI, contractAddresses[token][network]);
        callback(null, { data: contractInstance });
    }
};
exports.fetchETHBallance = function (payload, callback) {
    var address = payload.address, web3Utils = payload.web3Utils;
    web3Utils.eth
        .getBalance(address)
        .then(function (value) {
        callback(null, { data: web3Utils.fromWei(value) });
    })
        .catch(function (err) { return callback(err); });
};
exports.fetchBallanceByToken = function (payload, callback) {
    var address = payload.address, web3Utils = payload.web3Utils;
    var contractInstance = payload.contractInstance;
    if (!contractInstance.methods.balanceOf) {
        return callback({ message: 'No ballanceOf() in Contract Instance' });
    }
    contractInstance.methods
        .balanceOf(address)
        .call()
        .then(function (res) {
        var value = web3Utils.fromWei(res);
        callback(null, { data: value });
    })
        .catch(function (err) {
        console.log('Fetch balance failed', contractInstance._address);
        callback(err);
    });
};
exports.fetchAllowanceByToken = function (payload, callback) {
    var address = payload.address, contractInstance = payload.contractInstance, protocolContract = payload.protocolContract, web3Utils = payload.web3Utils;
    if (!contractInstance.methods.allowance) {
        return callback({ message: 'No allowance() in Contract Instance' });
    }
    contractInstance.methods
        .allowance(address, protocolContract._address)
        .call({ from: address })
        .then(function (res) {
        var value = web3Utils.fromWei(res);
        callback(null, { data: value });
    })
        .catch(function (err) {
        console.log('Fetch allowance failed', contractInstance._address);
        callback(err);
    });
};
var fillZero = function (len) {
    if (len === void 0) { len = 40; }
    return "0x" + new Array(len).fill(0).join('');
};
exports.fetchPositions = function (payload, callback) { return __awaiter(_this, void 0, void 0, function () {
    var address, Protocol, web3Utils, wranglers, lendCount, borrowCount, positions, positionExists, _loop_1, i, _loop_2, i, activePositions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                address = payload.address, Protocol = payload.Protocol, web3Utils = payload.web3Utils, wranglers = payload.wranglers;
                return [4, Protocol.methods.lend_positions_count(address).call()];
            case 1:
                lendCount = _a.sent();
                return [4, Protocol.methods
                        .borrow_positions_count(address)
                        .call()];
            case 2:
                borrowCount = _a.sent();
                positions = [];
                positionExists = {};
                _loop_1 = function (i) {
                    var positionHash, positionData, wrangler, health;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, Protocol.methods
                                    .lend_positions(address, i)
                                    .call()];
                            case 1:
                                positionHash = _a.sent();
                                if (positionHash === fillZero(64)) {
                                    return [2, "continue"];
                                }
                                return [4, Protocol.methods.position(positionHash).call()];
                            case 2:
                                positionData = _a.sent();
                                wrangler = wranglers.find(function (w) { return w.address.toLowerCase() === positionData[5].toLowerCase(); });
                                return [4, axios_1.default.get(wrangler.apiLoanRequests + "/loan_health/" + positionData[0])];
                            case 3:
                                health = _a.sent();
                                if (!positionExists[positionHash]) {
                                    positionExists[positionHash] = true;
                                    positions.push({
                                        type: 'lent',
                                        positionData: positionData,
                                        health: health.data.data,
                                        address: positionHash
                                    });
                                }
                                return [2];
                        }
                    });
                };
                i = 1;
                _a.label = 3;
            case 3:
                if (!(i <= lendCount)) return [3, 6];
                return [5, _loop_1(i)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                i++;
                return [3, 3];
            case 6:
                _loop_2 = function (i) {
                    var positionHash, positionData, wrangler, health;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, Protocol.methods
                                    .borrow_positions(address, i)
                                    .call()];
                            case 1:
                                positionHash = _a.sent();
                                if (positionHash === fillZero(64)) {
                                    return [2, "continue"];
                                }
                                return [4, Protocol.methods.position(positionHash).call()];
                            case 2:
                                positionData = _a.sent();
                                wrangler = wranglers.find(function (w) { return w.address.toLowerCase() === positionData[5].toLowerCase(); });
                                return [4, axios_1.default.get(wrangler.apiLoanRequests + "/loan_health/" + positionData[0])];
                            case 3:
                                health = _a.sent();
                                if (!positionExists[positionHash]) {
                                    positionExists[positionHash] = true;
                                    positions.push({
                                        type: 'borrowed',
                                        positionData: positionData,
                                        health: health.data.data,
                                        address: positionHash
                                    });
                                }
                                return [2];
                        }
                    });
                };
                i = 1;
                _a.label = 7;
            case 7:
                if (!(i <= borrowCount)) return [3, 10];
                return [5, _loop_2(i)];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                i++;
                return [3, 7];
            case 10:
                positions.forEach(function (position) {
                    var positionData = position.positionData, health = position.health;
                    var positionInfo = {
                        index: parseInt(positionData[0], 10),
                        kernel_creator: positionData[1],
                        lender: positionData[2],
                        borrower: positionData[3],
                        relayer: positionData[4],
                        wrangler: positionData[5],
                        created_at: parseInt(positionData[6], 10) * 1000,
                        updated_at: parseInt(positionData[7], 10) * 1000,
                        expires_at: parseInt(positionData[8], 10) * 1000,
                        borrow_currency_address: positionData[9],
                        lend_currency_address: positionData[10],
                        borrow_currency_value: web3Utils.fromWei(positionData[11]),
                        borrow_currency_current_value: web3Utils.fromWei(positionData[12]),
                        lend_currency_filled_value: web3Utils.fromWei(positionData[13]),
                        lend_currency_owed_value: web3Utils.fromWei(positionData[14]),
                        status: parseInt(positionData[15], 10),
                        nonce: parseInt(positionData[16], 10),
                        relayer_fee: web3Utils.fromWei(positionData[17]),
                        monitoring_fee: web3Utils.fromWei(positionData[18]),
                        rollover_fee: web3Utils.fromWei(positionData[19]),
                        closure_fee: web3Utils.fromWei(positionData[20]),
                        hash: positionData[21]
                    };
                    var index = positionInfo.index, kernel_creator = positionInfo.kernel_creator, lender = positionInfo.lender, borrower = positionInfo.borrower, relayer = positionInfo.relayer, wrangler = positionInfo.wrangler, created_at = positionInfo.created_at, updated_at = positionInfo.updated_at, expires_at = positionInfo.expires_at, borrow_currency_address = positionInfo.borrow_currency_address, lend_currency_address = positionInfo.lend_currency_address, borrow_currency_value = positionInfo.borrow_currency_value, borrow_currency_current_value = positionInfo.borrow_currency_current_value, lend_currency_filled_value = positionInfo.lend_currency_filled_value, lend_currency_owed_value = positionInfo.lend_currency_owed_value, status = positionInfo.status, nonce = positionInfo.nonce, relayer_fee = positionInfo.relayer_fee, monitoring_fee = positionInfo.monitoring_fee, rollover_fee = positionInfo.rollover_fee, closure_fee = positionInfo.closure_fee, hash = positionInfo.hash;
                    var statusLabel = 'Unknown';
                    switch (status) {
                        case Constants.LOAN_STATUS_OPEN:
                            statusLabel = 'Active';
                            break;
                        case Constants.LOAN_STATUS_CLOSED:
                            statusLabel = 'Closed';
                            break;
                        case Constants.LOAN_STATUS_LIQUIDATED:
                            statusLabel = 'Liquidated';
                            break;
                        default:
                            statusLabel = 'Unknown';
                    }
                    position.loanNumber = index + 1;
                    position.amount = lend_currency_filled_value;
                    position.totalInterest = Math.max(web3Utils.substract(lend_currency_owed_value, lend_currency_filled_value), 0);
                    position.term = (expires_at - Date.now()) / 1000;
                    position.status = statusLabel;
                    position.origin = {
                        loanAmountBorrowed: lend_currency_filled_value,
                        loanAmountOwed: lend_currency_owed_value,
                        collateralAmount: borrow_currency_current_value,
                        expiresAtTimestamp: expires_at,
                        createdAtTimestamp: created_at,
                        loanContract: Protocol,
                        borrower: borrower,
                        lender: lender,
                        wrangler: wrangler,
                        userAddress: address,
                        loanStatus: status,
                        kernel_creator: kernel_creator,
                        collateralToken: hash,
                        loanToken: kernel_creator === lender ? lend_currency_address : lend_currency_address
                    };
                    position.detail = {
                        index: index,
                        kernel_creator: kernel_creator,
                        lender: lender,
                        borrower: borrower,
                        relayer: relayer,
                        wrangler: wrangler,
                        created_at: created_at,
                        updated_at: updated_at,
                        expires_at: expires_at,
                        borrow_currency_address: borrow_currency_address,
                        lend_currency_address: lend_currency_address,
                        borrow_currency_value: borrow_currency_value,
                        borrow_currency_current_value: borrow_currency_current_value,
                        lend_currency_filled_value: lend_currency_filled_value,
                        lend_currency_owed_value: lend_currency_owed_value,
                        status: status,
                        nonce: nonce,
                        relayer_fee: relayer_fee,
                        monitoring_fee: monitoring_fee,
                        rollover_fee: rollover_fee,
                        closure_fee: closure_fee,
                        hash: hash,
                        health: health
                    };
                });
                activePositions = positions.filter(function (position) { return position.origin.loanStatus !== Constants.LOAN_STATUS_CLOSED; });
                callback(null, {
                    positions: {
                        lent: activePositions
                            .filter(function (position) { return position.type === 'lent'; })
                            .sort(function (a, b) { return b.origin.createdAtTimestamp - a.origin.createdAtTimestamp; })
                            .slice(0, 10),
                        borrowed: activePositions
                            .filter(function (position) { return position.type === 'borrowed'; })
                            .sort(function (a, b) { return b.origin.createdAtTimestamp - a.origin.createdAtTimestamp; })
                            .slice(0, 10)
                    },
                    counts: [lendCount, borrowCount]
                });
                return [2];
        }
    });
}); };
exports.wrapETH = function (payload, callback) {
    var amount = payload.amount, isWrap = payload.isWrap, _WETHContractInstance = payload._WETHContractInstance, metamask = payload.metamask, web3Utils = payload.web3Utils;
    if (isWrap) {
        _WETHContractInstance.methods
            .deposit()
            .send({ value: web3Utils.toWei(amount), from: metamask.address })
            .then(function (hash) { return callback(null, hash.transactionHash); })
            .catch(function (err) { return callback(err); });
    }
    else {
        _WETHContractInstance.methods
            .withdraw(web3Utils.toWei(amount))
            .send({ from: metamask.address })
            .then(function (hash) { return callback(null, hash.transactionHash); })
            .catch(function (err) { return callback(err); });
    }
};
exports.allowance = function (payload, callback) {
    var address = payload.address, tokenContractInstance = payload.tokenContractInstance, tokenAllowance = payload.tokenAllowance, protocolContract = payload.protocolContract, web3Utils = payload.web3Utils;
    if (tokenAllowance === 0 ||
        !tokenContractInstance.methods.increaseApproval ||
        !tokenContractInstance.methods.decreaseApproval) {
        tokenContractInstance.methods
            .approve(protocolContract._address, web3Utils.toWei('10000000000000000000'))
            .send({ from: address })
            .then(function (res) { return callback(null, res.transactionHash); })
            .catch(function (err) { return callback(err); });
    }
    else {
        tokenContractInstance.methods
            .increaseApproval(protocolContract._address, web3Utils.toWei('10000000000000000000'))
            .send({ from: address })
            .then(function (res) { return callback(null, res.transactionHash); })
            .catch(function (err) { return callback(err); });
    }
};
exports.fillLoan = function (payload, callback) {
    var approval = payload.approval, web3Utils = payload.web3Utils;
    web3Utils.sendSignedTransaction(approval._signed_transaction)
        .then(function (hash) { return callback(null, hash.transactionHash); })
        .catch(function (err) { return callback(err); });
};
exports.closePosition = function (payload, callback) {
    var data = payload.data;
    data.origin.loanContract.methods
        .close_position(data.origin.collateralToken)
        .send({ from: data.origin.borrower })
        .then(function (hash) {
        setTimeout(callback, 5000, null, hash.transactionHash);
    })
        .catch(function (err) { return callback(err); });
};
exports.topUpPosition = function (payload, callback) {
    var data = payload.data, topUpCollateralAmount = payload.topUpCollateralAmount;
    data.loanContract.methods
        .topup_position(data.collateralToken, topUpCollateralAmount)
        .send({ from: data.userAddress })
        .then(function (hash) {
        setTimeout(callback, 5000, null, hash.transactionHash);
    })
        .catch(function (err) { return callback(err); });
};
exports.liquidatePosition = function (payload, callback) {
    var data = payload.data;
    data.origin.loanContract.methods
        .liquidate_position(data.origin.collateralToken)
        .send({ from: data.origin.userAddress })
        .then(function (hash) {
        setTimeout(callback, 5000, null, hash.transactionHash);
    })
        .catch(function (err) { return callback(err); });
};
exports.cancelOrder = function (payload, callback) { return __awaiter(_this, void 0, void 0, function () {
    var data, protocolContractInstance, metamask, web3Utils, addresses, values, orderHash, filledOrCancelledLoanAmount, cancelledCollateralTokenAmount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = payload.data, protocolContractInstance = payload.protocolContractInstance, metamask = payload.metamask, web3Utils = payload.web3Utils;
                addresses = [
                    data.lender,
                    data.borrower,
                    data.relayer,
                    data.wrangler,
                    data.collateralToken,
                    data.loanToken
                ];
                values = [
                    data.loanAmountOffered,
                    data.relayerFeeLST,
                    data.monitoringFeeLST,
                    data.rolloverFeeLST,
                    data.closureFeeLST
                ];
                return [4, protocolContractInstance.methods
                        .kernel_hash(addresses, values, parseInt(data.offerExpiry, 10), data.creatorSalt, web3Utils.toWei(data.interestRatePerDay), parseInt(data.loanDuration, 10))
                        .call()];
            case 1:
                orderHash = _a.sent();
                return [4, protocolContractInstance.methods
                        .filled_or_cancelled_loan_amount(orderHash)
                        .call()];
            case 2:
                filledOrCancelledLoanAmount = _a.sent();
                cancelledCollateralTokenAmount = web3Utils.substractBN(data.loanAmountOffered, filledOrCancelledLoanAmount);
                protocolContractInstance.methods
                    .cancel_kernel(addresses, values, parseInt(data.offerExpiry, 10), data.creatorSalt, web3Utils.toWei(data.interestRatePerDay), parseInt(data.loanDuration, 10), data.ecSignatureCreator, web3Utils.toWei(cancelledCollateralTokenAmount))
                    .send({ from: metamask.address })
                    .then(function (result) { return callback(null, result.transactionHash); })
                    .catch(function (err) { return callback(err); });
                return [2];
        }
    });
}); };
//# sourceMappingURL=contracts.js.map