export declare class Logger {
    static log(context: any, message: any): void;
    static info(context: any, message: any): void;
    static error(context: any, message: any): void;
}
export declare const LOGGER_CONTEXT: {
    INIT: string;
    RESET: string;
    CONTRACT_ERROR: string;
    API_ERROR: string;
};
