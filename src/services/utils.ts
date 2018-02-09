export const extractV = (address: string) => {
    return address.substring(128, 131)
}

export const extractR = (address: string) => {
    return address.substring(0, 65)
}

export const extractS = (address: string) => {
    return address.substring(64, 129)
}
