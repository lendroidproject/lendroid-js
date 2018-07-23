export class Logger {
  /**
   * To log DEBUG logs to console
   */
  public static log(context, message) {
    console.log(`context=${context}, ${JSON.stringify(message)}`)
  }

  /**
   * To log INFO logs to console (for viewing in browser)
   */
  public static info(context, message) {
    console.info(`context=${context}, ${JSON.stringify(message)}`)
  }

  /**
   * To log WARNING/ERROR logs to console
   */
  public static error(context, message) {
    console.error(`context=${context}, ${JSON.stringify(message)}`)
  }
}

export const LOGGER_CONTEXT = {
  // Lendroid Main Logs
  INIT: 'Lendroid Init',
  RESET: 'Lendroid Reset',

  // Contracts
  CONTRACT_ERROR: 'Contract Error',

  // API
  API_ERROR: 'API Error',
}
