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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var Web3 = require('web3');
var Constants = require("./constants");
var services_1 = require("./services");
var Lendroid = (function () {
    function Lendroid(initParams) {
        if (initParams === void 0) { initParams = {}; }
        var _this = this;
        this.web3 = new Web3(initParams.provider || window.web3.currentProvider);
        this.web3Utils = new services_1.Web3Utils(this.web3);
        this.apiEndpoint = initParams.apiEndpoint || Constants.API_ENDPOINT;
        this.apiLoanRequests =
            initParams.apiLoanRequests || Constants.API_LOAN_REQUESTS;
        this.stateCallback =
            initParams.stateCallback ||
                (function () { return console.log('State callback is not set'); });
        this.metamask = { address: undefined, network: undefined };
        this.fetchETHBallance = this.fetchETHBallance.bind(this);
        this.fetchBallanceByToken = this.fetchBallanceByToken.bind(this);
        this.fetchAllowanceByToken = this.fetchAllowanceByToken.bind(this);
        this.fetchAllowanceByAddress = this.fetchAllowanceByAddress.bind(this);
        this.fetchOrders = this.fetchOrders.bind(this);
        this.fetchPositions = this.fetchPositions.bind(this);
        this.fetchDAIExchange = this.fetchDAIExchange.bind(this);
        this.onCreateOrder = this.onCreateOrder.bind(this);
        this.onFillOrderServer = this.onFillOrderServer.bind(this);
        this.onDeleteOrder = this.onDeleteOrder.bind(this);
        this.onWrapETH = this.onWrapETH.bind(this);
        this.onAllowance = this.onAllowance.bind(this);
        this.onPostLoans = this.onPostLoans.bind(this);
        this.onFillLoan = this.onFillLoan.bind(this);
        this.onClosePosition = this.onClosePosition.bind(this);
        this.onTopUpPosition = this.onTopUpPosition.bind(this);
        this.onLiquidatePosition = this.onLiquidatePosition.bind(this);
        this.onCancelOrder = this.onCancelOrder.bind(this);
        this.init();
        this.fetchETHBallance();
        Constants.BALLANCE_TOKENS.forEach(function (token) {
            _this.fetchBallanceByToken(token);
            _this.fetchAllowanceByToken(token);
        });
        services_1.Logger.info(services_1.LOGGER_CONTEXT.INIT, {
            apiEndpoint: this.apiEndpoint,
            metamask: this.metamask
        });
        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var accounts, network;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.web3.eth.getAccounts()];
                    case 1:
                        accounts = _a.sent();
                        return [4, this.web3.eth.net.getId()];
                    case 2:
                        network = _a.sent();
                        if ((accounts && accounts[0] !== this.metamask.address) ||
                            network !== this.metamask.network) {
                            this.reset({ address: accounts[0], network: network });
                        }
                        return [2];
                }
            });
        }); }, 1000);
        setInterval(function () {
            _this.fetchOrders();
        }, 30 * 1000);
        this.debounceUpdate = this.debounce(this.stateCallback, 500, null);
    }
    Lendroid.prototype.onCreateOrder = function (postData, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, web3Utils, contracts, metamask, address, addresses, values, protocolContractInstance, onSign, orderHash;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, web3Utils = _a.web3Utils, contracts = _a.contracts, metamask = _a.metamask;
                        address = metamask.address;
                        addresses = [
                            (postData.lender = postData.lender.length
                                ? postData.lender
                                : this.fillZero()),
                            (postData.borrower = postData.borrower.length
                                ? postData.borrower
                                : this.fillZero()),
                            (postData.relayer = postData.relayer.length
                                ? postData.relayer
                                : this.fillZero()),
                            postData.wrangler,
                            postData.collateralToken,
                            postData.loanToken
                        ];
                        values = [
                            (postData.loanAmountOffered = web3Utils.toWei(postData.loanAmountOffered)),
                            (postData.relayerFeeLST = web3Utils.toWei(postData.relayerFeeLST)),
                            (postData.monitoringFeeLST = web3Utils.toWei(postData.monitoringFeeLST)),
                            (postData.rolloverFeeLST = web3Utils.toWei(postData.rolloverFeeLST)),
                            (postData.closureFeeLST = web3Utils.toWei(postData.closureFeeLST))
                        ];
                        protocolContractInstance = contracts.contracts
                            ? contracts.contracts.Protocol
                            : null;
                        onSign = function (hash) {
                            web3Utils.eth
                                .sign(hash, address)
                                .then(function (result) {
                                postData.ecSignatureCreator = result;
                                result = result.substr(2);
                                postData.rCreator = "0x" + result.slice(0, 64);
                                postData.sCreator = "0x" + result.slice(64, 128);
                                postData.vCreator = "" + result.slice(128, 130) === '00' ? '27' : '28';
                                services_1.createOrder(_this.apiEndpoint, postData, function (err, res) {
                                    if (err) {
                                        callback(err);
                                        return services_1.Logger.error(services_1.LOGGER_CONTEXT.API_ERROR, err.message);
                                    }
                                    else {
                                        callback(null, res);
                                    }
                                    setTimeout(_this.fetchOrders, 2000);
                                });
                            })
                                .catch(function (err) {
                                callback(err);
                                return services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
                            });
                        };
                        return [4, protocolContractInstance.methods
                                .kernel_hash(addresses, values, parseInt(postData.offerExpiry, 10), postData.creatorSalt, parseInt(postData.interestRatePerDay, 10), parseInt(postData.loanDuration, 10))
                                .call()];
                    case 1:
                        orderHash = _b.sent();
                        onSign(orderHash);
                        return [2];
                }
            });
        });
    };
    Lendroid.prototype.onFillOrderServer = function (id, value, callback) {
        var _this = this;
        services_1.fillOrderServer(this.apiEndpoint, id, value, function (err, res) {
            callback(err, res);
            setTimeout(_this.fetchOrders, 300);
            setTimeout(_this.fetchPositions, 1000);
        });
    };
    Lendroid.prototype.onDeleteOrder = function (id, callback) {
        var _this = this;
        services_1.deleteOrder(this.apiEndpoint, id, function (err, res) {
            callback(err, res);
            setTimeout(_this.fetchOrders, 300);
        });
    };
    Lendroid.prototype.onWrapETH = function (amount, isWrap, callback) {
        var _this = this;
        var _a = this, web3Utils = _a.web3Utils, contracts = _a.contracts, metamask = _a.metamask;
        var _WETHContractInstance = contracts.contracts.WETH;
        if (!_WETHContractInstance) {
            callback(null);
            return;
        }
        this.loading.wrapping = true;
        services_1.wrapETH({ web3Utils: web3Utils, amount: amount, isWrap: isWrap, _WETHContractInstance: _WETHContractInstance, metamask: metamask }, function (err, hash) {
            if (err) {
                _this.loading.wrapping = false;
                callback(null);
                services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
            }
            else {
                _this.debounceUpdate();
                var wrapInterval_1 = setInterval(function () {
                    web3Utils.eth
                        .getTransactionReceipt(hash)
                        .then(function (res) {
                        if (res) {
                            clearInterval(wrapInterval_1);
                            setTimeout(function () {
                                _this.fetchBallanceByToken('WETH', function (e) {
                                    _this.loading.wrapping = false;
                                    callback(e);
                                }, true);
                            }, 1000);
                        }
                    })
                        .catch(function (error) {
                        _this.loading.wrapping = false;
                        callback(null);
                        services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, error.message);
                    });
                }, 3000);
            }
        });
    };
    Lendroid.prototype.onAllowance = function (token, newAllowance, callback) {
        var _this = this;
        var _a = this, web3Utils = _a.web3Utils, contracts = _a.contracts, metamask = _a.metamask;
        var address = metamask.address;
        var tokenContractInstance = contracts.contracts[token];
        var protocolContract = contracts.contracts.Protocol;
        var tokenAllowance = contracts.allowances[token];
        if (newAllowance === tokenAllowance) {
            callback(null);
            return;
        }
        this.loading.allowance = true;
        services_1.allowance({
            address: address,
            web3Utils: web3Utils,
            tokenContractInstance: tokenContractInstance,
            tokenAllowance: tokenAllowance,
            newAllowance: newAllowance,
            protocolContract: protocolContract
        }, function (err, hash) {
            if (err) {
                _this.loading.allowance = false;
                callback(null);
                services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
            }
            else {
                var allowanceInterval_1 = setInterval(function () {
                    web3Utils.eth
                        .getTransactionReceipt(hash)
                        .then(function (res) {
                        if (res) {
                            clearInterval(allowanceInterval_1);
                            setTimeout(function () {
                                _this.fetchAllowanceByToken(token, function (e) {
                                    _this.loading.allowance = false;
                                    callback(e);
                                }, true);
                            }, 1000);
                        }
                    })
                        .catch(function (error) {
                        _this.loading.allowance = false;
                        callback(null);
                        services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, error.message);
                    });
                }, 3000);
            }
        });
    };
    Lendroid.prototype.onPostLoans = function (data, callback) {
        services_1.postLoans(this.apiLoanRequests, data, callback);
    };
    Lendroid.prototype.onFillLoan = function (approval, callback) {
        var _a = this, contracts = _a.contracts, metamask = _a.metamask, web3Utils = _a.web3Utils;
        var protocolContractInstance = contracts.contracts.Protocol;
        services_1.fillLoan({ approval: approval, protocolContractInstance: protocolContractInstance, metamask: metamask, web3Utils: web3Utils }, callback);
    };
    Lendroid.prototype.onClosePosition = function (data, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var metamask, _a, borrower, loanAmountOwed, borrowerAllowance;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        metamask = this.metamask;
                        _a = data.origin, borrower = _a.borrower, loanAmountOwed = _a.loanAmountOwed;
                        return [4, this.fetchAllowanceByAddress(borrower)];
                    case 1:
                        borrowerAllowance = _b.sent();
                        if (borrowerAllowance > loanAmountOwed) {
                            services_1.closePosition({ data: data, metamask: metamask }, function (err, res) {
                                if (err) {
                                    services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
                                }
                                callback(err, res);
                                setTimeout(_this.fetchPositions, 100);
                            });
                        }
                        else {
                            callback({
                                message: "Borrower's DAI allowance should at least " + loanAmountOwed
                            });
                        }
                        return [2];
                }
            });
        });
    };
    Lendroid.prototype.onTopUpPosition = function (data, topUpCollateralAmount, callback) {
        var _this = this;
        services_1.topUpPosition({ data: data, topUpCollateralAmount: topUpCollateralAmount }, function (err, res) {
            if (err) {
                services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
            }
            callback(err, res);
            setTimeout(_this.fetchPositions, 100);
        });
    };
    Lendroid.prototype.onLiquidatePosition = function (data, callback) {
        var _this = this;
        services_1.liquidatePosition({ data: data }, function (err, res) {
            if (err) {
                services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
            }
            callback(err, res);
            setTimeout(_this.fetchPositions, 100);
        });
    };
    Lendroid.prototype.onCancelOrder = function (data, callback) {
        var _a = this, web3Utils = _a.web3Utils, contracts = _a.contracts, metamask = _a.metamask;
        var protocolContractInstance = contracts.contracts.Protocol;
        var currentWETHExchangeRate = this.exchangeRates.currentWETHExchangeRate;
        services_1.cancelOrder({
            web3Utils: web3Utils,
            data: data,
            currentWETHExchangeRate: currentWETHExchangeRate,
            protocolContractInstance: protocolContractInstance,
            metamask: metamask
        }, function (err, result) {
            if (err) {
                services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
            }
            callback(err, result);
        });
    };
    Lendroid.prototype.init = function () {
        this.contracts = Constants.DEFAULT_CONTRACTS;
        this.orders = Constants.DEFAULT_ORDERS;
        this.loading = Constants.DEFAULT_LOADINGS;
        this.exchangeRates = Constants.DEFAULT_EXCHANGES;
        this.stateCallback();
    };
    Lendroid.prototype.reset = function (metamask) {
        services_1.Logger.info(services_1.LOGGER_CONTEXT.RESET, metamask);
        this.metamask = metamask;
        if (metamask.network) {
            this.init();
            this.fetchContracts();
            this.fetchOrders();
        }
    };
    Lendroid.prototype.fetchOrders = function () {
        var _this = this;
        var address = this.metamask.address;
        this.loading.orders = true;
        this.stateCallback();
        services_1.fetchOrders(this.apiEndpoint, function (err, orders) {
            _this.loading.orders = false;
            if (err) {
                return services_1.Logger.error(services_1.LOGGER_CONTEXT.API_ERROR, err.message);
            }
            _this.orders.myOrders.lend = orders.result.filter(function (item) { return item.lender === address; });
            _this.orders.myOrders.borrow = orders.result.filter(function (item) { return item.borrower === address; });
            _this.orders.orders = orders.result.filter(function (item) { return item.lender !== address && item.borrower !== address; });
            setTimeout(_this.debounceUpdate, 1000);
        });
    };
    Lendroid.prototype.fetchPositions = function (specificAddress) {
        var _this = this;
        if (specificAddress === void 0) { specificAddress = null; }
        var _a = this, web3Utils = _a.web3Utils, metamask = _a.metamask, contracts = _a.contracts;
        var address = metamask.address;
        var Protocol = contracts.contracts.Protocol;
        this.loading.positions = true;
        services_1.fetchPositions({
            web3Utils: web3Utils,
            address: address,
            Protocol: Protocol,
            specificAddress: specificAddress,
            oldPostions: this.contracts.positions
        }, function (err, res) {
            _this.loading.positions = false;
            if (err) {
                return services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
            }
            _this.contracts.positions = res.positions;
            _this.debounceUpdate();
        });
    };
    Lendroid.prototype.fetchDAIExchange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var web3Utils, DAI2ETH, exchange, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        web3Utils = this.web3Utils;
                        DAI2ETH = (this.contracts.contracts || { DAI2ETH: null }).DAI2ETH;
                        if (!DAI2ETH) return [3, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, DAI2ETH.methods.read().call()];
                    case 2:
                        exchange = _a.sent();
                        this.exchangeRates.currentDAIExchangeRate = web3Utils.fromWei(exchange);
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        return [2, services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err_1.message)];
                    case 4: return [2];
                }
            });
        });
    };
    Lendroid.prototype.fetchContracts = function () {
        var _this = this;
        Constants.CONTRACT_TOKENS.forEach(function (token) {
            _this.fetchContractByToken(token, null);
        });
    };
    Lendroid.prototype.fetchContractByToken = function (token, callback) {
        var _this = this;
        var _a = this, web3Utils = _a.web3Utils, metamask = _a.metamask;
        var network = metamask.network;
        services_1.fetchContractByToken(token, { web3Utils: web3Utils, network: network }, function (err, res) {
            if (err) {
                return services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
            }
            _this.contracts.contracts[token] = res.data;
            if (callback) {
                return callback();
            }
            if (token === 'Protocol') {
                if (_this.contracts.contracts.Protocol) {
                    _this.fetchPositions();
                }
            }
        });
    };
    Lendroid.prototype.fetchETHBallance = function () {
        var _this = this;
        var _a = this, web3Utils = _a.web3Utils, metamask = _a.metamask, contracts = _a.contracts;
        var address = (metamask || { address: null }).address;
        if (address && contracts && contracts.balances) {
            services_1.fetchETHBallance({ web3Utils: web3Utils, address: address }, function (err, res) {
                if (err) {
                    return services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
                }
                contracts.balances.ETH = res.data;
                _this.debounceUpdate();
            });
            setTimeout(this.fetchETHBallance, 2500);
        }
        else {
            setTimeout(this.fetchETHBallance, 500);
        }
        this.fetchDAIExchange();
    };
    Lendroid.prototype.fetchBallanceByToken = function (token, callback, once) {
        var _this = this;
        if (callback === void 0) { callback = function () { return null; }; }
        if (once === void 0) { once = false; }
        var _a = this, web3Utils = _a.web3Utils, metamask = _a.metamask, contracts = _a.contracts;
        var address = (metamask || { address: null }).address;
        if (contracts && contracts.contracts && contracts.contracts[token]) {
            services_1.fetchBallanceByToken({
                web3Utils: web3Utils,
                contractInstance: contracts.contracts[token],
                address: address
            }, function (err, res) {
                if (err) {
                    callback(null);
                    return services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
                }
                _this.contracts.balances[token] = res.data;
                _this.debounceUpdate();
                callback(null);
            });
            if (!once) {
                setTimeout(this.fetchBallanceByToken, 2500, token);
            }
        }
        else {
            if (!once) {
                setTimeout(this.fetchBallanceByToken, 500, token);
            }
        }
    };
    Lendroid.prototype.fetchAllowanceByToken = function (token, callback, once) {
        var _this = this;
        if (callback === void 0) { callback = function () { return null; }; }
        if (once === void 0) { once = false; }
        var _a = this, web3Utils = _a.web3Utils, metamask = _a.metamask, contracts = _a.contracts;
        var address = (metamask || { address: null }).address;
        if (contracts &&
            contracts.contracts &&
            contracts.contracts[token] &&
            contracts.contracts.Protocol) {
            services_1.fetchAllowanceByToken({
                web3Utils: web3Utils,
                address: address,
                contractInstance: contracts.contracts[token],
                protocolContract: contracts.contracts.Protocol
            }, function (err, res) {
                if (err) {
                    callback(null);
                    return services_1.Logger.error(services_1.LOGGER_CONTEXT.CONTRACT_ERROR, err.message);
                }
                _this.contracts.allowances[token] = res.data;
                _this.debounceUpdate();
                callback(null);
            });
            if (!once) {
                setTimeout(this.fetchAllowanceByToken, 2500, token);
            }
        }
        else {
            if (!once) {
                setTimeout(this.fetchAllowanceByToken, 500, token);
            }
        }
    };
    Lendroid.prototype.fetchAllowanceByAddress = function (address, token) {
        var _this = this;
        if (token === void 0) { token = 'DAI'; }
        return new Promise(function (resolve, reject) {
            var _a = _this, web3Utils = _a.web3Utils, contracts = _a.contracts;
            if (contracts &&
                contracts.contracts &&
                contracts.contracts[token] &&
                contracts.contracts.Protocol) {
                services_1.fetchAllowanceByToken({
                    web3Utils: web3Utils,
                    address: address,
                    contractInstance: contracts.contracts[token],
                    protocolContract: contracts.contracts.Protocol
                }, function (err, res) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res.data);
                    }
                });
            }
            else {
                reject({ message: 'Contracts not ready, try again later.' });
            }
        });
    };
    Lendroid.prototype.debounce = function (func, wait, immediate) {
        var timeout = -1;
        return function () {
            var context = this;
            var args = arguments;
            var later = function () {
                timeout = -1;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            if (timeout !== -1) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    };
    Lendroid.prototype.fillZero = function (len) {
        if (len === void 0) { len = 40; }
        return "0x" + new Array(len).fill(0).join('');
    };
    return Lendroid;
}());
exports.Lendroid = Lendroid;
//# sourceMappingURL=lendroid.js.map