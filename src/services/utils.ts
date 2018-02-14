import { BigNumber } from 'bignumber.js';

export const extractV = (address: string): string => {
    return address.substring(128, 130)
}

export const extractR = (address: string): string => {
    return address.substring(0, 64)
}

export const extractS = (address: string): string => {
    return address.substring(64, 128)
}

export const toBigNumber = (num: number): string => {
    return (new BigNumber(num)).times('10e+18').toString(10);
}
