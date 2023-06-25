import { POOLS } from "./constants"
import { utils } from "ethers"

const { keccak256, defaultAbiCoder } = utils

export const getPool = poolId => POOLS.find(x => x.id === poolId)
export function getBondId({ owner, amount, poolId, nonce }) {
	return ""
}
