import * as chai from 'chai'
import { getWalletAbi, getWalletBytecode } from '../../constants/deployed-constants'

const expect = chai.expect

it('should successfully read in an ABI into JSON', async () => expect(await getWalletAbi()).to.not.be.null)
it('should successfully read in bytecode to a string', async () => expect(await getWalletBytecode).to.not.be.null)