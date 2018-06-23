export interface ITransactionResponse {
  blockHash: string
  blockNumber: number
  contractAddress: string
  cumulativeGasUsed: number
  from: string
  gasUsed: number
  logsBloom: string
  root: string
  to: string
  transactionHash: string
  transactionIndex: number
  events: any
}
