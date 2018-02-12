import * as chai from 'chai'
import { Lendroid } from '../../lendroid'

const lendroid = new Lendroid({deployedConstants: { walletAddress: ''}})
const expect = chai.expect

it('should successfully read in an ABI into JSON', async () => expect(await  lendroid.deployedConstants.getWalletAbi()).to.not.be.null)
it('should successfully read in bytecode to a string', async () => expect(await lendroid.deployedConstants.getWalletBytecode).to.not.be.null)