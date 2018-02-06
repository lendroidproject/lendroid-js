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
    WEBPACK = 'Webpack'
}
