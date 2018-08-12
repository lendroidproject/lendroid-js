export class Web3Utils {
  private web3: any
  public eth: any

  constructor(web3) {
    this.web3 = web3
    this.eth = web3.eth

    this.toWei = this.toWei.bind(this)
    this.fromWei = this.fromWei.bind(this)
    this.toBN = this.toBN.bind(this)
    this.toDecimal = this.toDecimal.bind(this)
    this.substract = this.substract.bind(this)
    this.substractBN = this.substractBN.bind(this)

    this.createContract = this.createContract.bind(this)
  }

  public toWei(value) {
    return this.web3.utils.toWei(value.toString(), 'ether')
  }

  public fromWei(value) {
    return this.web3.utils.fromWei(value.toString(), 'ether')
  }

  public toBN(value) {
    return this.web3.utils.toBN(value)
  }

  public toDecimal(value) {
    return this.web3.utils.toDecimal(value)
  }

  public substract(value1, value2) {
    const bnValue1 = this.toBN(this.toWei(value1))
    const bnValue2 = this.toBN(this.toWei(value2))
    return parseFloat(
      this.fromWei(
        bnValue1.sub(bnValue2)
      ).toString())
  }

  public substractBN(value1, value2) {
    const bnValue1 = this.toBN(value1)
    const bnValue2 = this.toBN(value2)
    return parseFloat(
      this.fromWei(
        bnValue1.sub(bnValue2)
      ).toString())
  }

  public createContract(abi, address) {
    return new this.eth.Contract(abi, address)
  }
}
