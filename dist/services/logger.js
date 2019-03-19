"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = (function () {
    function Logger() {
    }
    Logger.log = function (context, message) {
        console.log("context=" + context + ", " + JSON.stringify(message));
    };
    Logger.info = function (context, message) {
        console.info("context=" + context + ", " + JSON.stringify(message));
    };
    Logger.error = function (context, message) {
        console.error("context=" + context + ", " + JSON.stringify(message));
    };
    return Logger;
}());
exports.Logger = Logger;
exports.LOGGER_CONTEXT = {
    INIT: 'Lendroid Init',
    RESET: 'Lendroid Reset',
    CONTRACT_ERROR: 'Contract Error',
    API_ERROR: 'API Error',
};
//# sourceMappingURL=logger.js.map