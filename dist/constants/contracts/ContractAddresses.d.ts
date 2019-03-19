export declare const CONTRACT_ADDRESSES: {
    Protocol: {
        1: string;
        42: string;
        def: ({
            "name": string;
            "inputs": {
                "type": string;
                "name": string;
                "indexed": boolean;
            }[];
            "anonymous": boolean;
            "type": string;
            outputs?: undefined;
            constant?: undefined;
            payable?: undefined;
            gas?: undefined;
        } | {
            "name": string;
            "outputs": never[];
            "inputs": {
                "type": string;
                "name": string;
            }[];
            "constant": boolean;
            "payable": boolean;
            "type": string;
            anonymous?: undefined;
            gas?: undefined;
        } | {
            "name": string;
            "outputs": ({
                "type": string;
                "name": string;
                unit?: undefined;
            } | {
                "type": string;
                "name": string;
                "unit": string;
            })[];
            "inputs": {
                "type": string;
                "name": string;
            }[];
            "constant": boolean;
            "payable": boolean;
            "type": string;
            "gas": number;
            anonymous?: undefined;
        } | {
            "name": string;
            "outputs": {
                "type": string;
                "name": string;
            }[];
            "inputs": ({
                "type": string;
                "name": string;
                unit?: undefined;
            } | {
                "type": string;
                "name": string;
                "unit": string;
            })[];
            "constant": boolean;
            "payable": boolean;
            "type": string;
            "gas": number;
            anonymous?: undefined;
        })[];
    };
    WETH: {
        1: string;
        42: string;
    };
    LST: {
        1: string;
        42: string;
        def: ({
            "constant": boolean;
            "inputs": {
                "name": string;
                "type": string;
            }[];
            "name": string;
            "outputs": {
                "name": string;
                "type": string;
            }[];
            "payable": boolean;
            "stateMutability": string;
            "type": string;
            anonymous?: undefined;
        } | {
            "inputs": never[];
            "payable": boolean;
            "stateMutability": string;
            "type": string;
            constant?: undefined;
            name?: undefined;
            outputs?: undefined;
            anonymous?: undefined;
        } | {
            "anonymous": boolean;
            "inputs": {
                "indexed": boolean;
                "name": string;
                "type": string;
            }[];
            "name": string;
            "type": string;
            constant?: undefined;
            outputs?: undefined;
            payable?: undefined;
            stateMutability?: undefined;
        })[];
    };
    DAI: {
        1: string;
        42: string;
        def: ({
            "constant": boolean;
            "inputs": {
                "name": string;
                "type": string;
            }[];
            "name": string;
            "outputs": {
                "name": string;
                "type": string;
            }[];
            "payable": boolean;
            "stateMutability": string;
            "type": string;
            anonymous?: undefined;
        } | {
            "inputs": {
                "name": string;
                "type": string;
            }[];
            "payable": boolean;
            "stateMutability": string;
            "type": string;
            constant?: undefined;
            name?: undefined;
            outputs?: undefined;
            anonymous?: undefined;
        } | {
            "anonymous": boolean;
            "inputs": {
                "indexed": boolean;
                "name": string;
                "type": string;
            }[];
            "name": string;
            "type": string;
            constant?: undefined;
            outputs?: undefined;
            payable?: undefined;
            stateMutability?: undefined;
        })[];
    };
};
export declare const CONTRACT_TOKENS: string[];
export declare const BALLANCE_TOKENS: string[];
