export namespace Logger {
    /**
     * To log DEBUG logs to console
     */
    export const log = (context: Context, message: string): void => {
        console.log(`context=${context}, ${message}`)
    }

    /**
     * To log INFO logs to console (for viewing in browser)
     */
    export const info = (context: Context, message: string) => {
        console.info(`context=${context}, ${message}`)
    }

    /**
     * To log WARNING/ERROR logs to console
     */
    export const error = (context: Context, message: string): void => {
        console.error(`context=${context}, ${message}`)
    }
}

/**
 * Context/functionality under which a message/error is being logged
 */
export enum Context {
    DEPOSIT_FUNDS = 'DepositFunds',
    WEBPACK = 'Webpack',
    WEB3 = 'Web3',
    COMMIT_FUNDS = 'CommitFunds',
    GET_APPROVAL = 'GetApproval',
    GET_WITHDRAWABLE_BALANCE = 'GetWithdrawableBalance',
    GET_POSITION_BALANCE = 'GetPositionBalance',
    GET_CASH_BALANCE = 'GetCashBalance',
    GET_LOCKED_BALANCE = 'GetLockedBalance',
    CREATE_LOAN_OFFER = 'CreateLoanOffer',
    GET_LOAN_OFFERS = 'GetLoanOffers',
    INTEGRATION_TEST = 'IntegrationTest',
    OPEN_TRADING_POSITION = 'OpenTradingPosition',
    SIGN_LOAN_OFFER = 'SignLoanOffer'
}
