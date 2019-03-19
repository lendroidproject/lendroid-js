export declare const ProtocolABI: ({
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
