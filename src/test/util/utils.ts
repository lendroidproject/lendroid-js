import { walletABI, walletByteCode } from './constants'
import { Contract, TransactionReceipt } from 'web3/types'
import { Web3Service } from '../../services/web3-service'
import { TokenAddress } from '../../constants/tokens'

export interface IDeployedContractResponse {
  contract: Contract,
  receipt: TransactionReceipt
}

export const deployWalletContract = async (web3Service: Web3Service): Promise<IDeployedContractResponse> => {

  const account: string = await web3Service.userAccount()
  // @ts-ignore
  const contract: Contract = new web3Service.Web3.eth.Contract(walletABI, {
    from: account,
    gas: 64393,
    gasPrice: '1238888888',
  })
  const receipt: TransactionReceipt = {} as TransactionReceipt

  // contract = await contract.deploy({ data: walletByteCode, arguments: [web3Service.deployedConstants.getTokenTransferProxyAddress(), TokenAddress.WETH] })
  //   .send({
  //     from: account,
  //     gas: 47188,
  //     gasPrice: '12388000'
  //   })
  //   .on('error', error => {
  //     throw Error(JSON.stringify(error))
  //   })
  //   .on('receipt', rec => {
  //     if (!rec.contractAddress) {
  //       throw Error('An error occurred')
  //     }
  //     receipt = rec as TransactionReceipt
  //   })

  return { contract, receipt }
}
