export const extractV = (address: string) => {
    return address.substring(128, 130)
}

export const extractR = (address: string) => {
    return address.substring(0, 64)
}

export const extractS = (address: string) => {
    return address.substring(64, 128)
}
