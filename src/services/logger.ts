class Logger {



    /**
     * To log DEBUG/INFO logs to console
     */
    public log(context: Context, message: string): void {
        console.log(`context=${context}, ${message}`)
    }

    /**
     * To log WARNING/ERROR logs to console
     */
    public error(context: Context, message: string): void {
        console.error(`context=${context}, ${message}`)
    }
}

/**
 * Context/functionality under which a message/error is being logged
 */
export enum Context {
    DEPOSIT_FUNDS = 'DepositFunds'
}

// TODO: Look into why TS is complaining here
// @ts-ignore
export const logger = new Logger()