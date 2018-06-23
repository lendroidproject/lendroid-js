export interface IContractOptions {
  // The address transactions should be made from
  from: string
  // The gas price in wei to use for transactions
  gasPrice: string
  // The maximum gas provided for a transaction (gas limit)
  gas: number
  // Byte code of contract for deployment
  data: string
}
