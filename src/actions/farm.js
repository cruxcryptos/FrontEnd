import { Contract, utils } from "ethers"
import {  ZERO, MAX_UINT } from "../helpers/constants"
import ERC20ABI from "../abi/ERC20"
import { getSigner, getDefaultProvider } from "../ethereum"
import { getUserIdentity } from "../helpers/identity"
import { executeOnIdentity } from "./common"
import { formatTokens, formatADX } from "../helpers/formatting"
import { TranslatableError } from "../helpers/errors"

// const MASTER_CHEF_ADDR = "0x2f0e755e0007E6569379a43E453F264b91336379" // goerli
const MASTER_CHEF_ADDR = "0xC0223ab23b519260AE7C52Dfb0a3dff65Da8385A"
// const AVG_ETH_BLOCK_TAME = 13.08
const DAYS_IN_YEAR = 365
// const SECS_IN_YEAR = DAYS_IN_YEAR * 24 * 60 * 60
// const TOTAL_FARM_ADX_REWARDS = 5_000_000
// const DAYS_TO_DISTRIBUTE_REWARDS = 30

// const AVG_BLOCKS_PER_YEAR = SECS_IN_YEAR / AVG_ETH_BLOCK_TAME

const defaultProvider = getDefaultProvider



const getOtherTokenAndPoolPrice = (known, unknown) => {
	const totalLPPrice =
		(parseFloat(utils.formatUnits(known.poolBalance, known.decimals)) /
			known.weight) *
		known.usdPrice
	const unknownPrice =
		(totalLPPrice * unknown.weight) /
		parseFloat(utils.formatUnits(unknown.poolBalance, unknown.decimals))

	return { unknownPrice, totalLPPrice }
}




export const getFarmPoolsStats = async ({
	chosenWalletType,
	externalPrices
}) => {
	return ""
}

export async function onLiquidityPoolDeposit({
	pool,
	stats,
	chosenWalletType,
	actionAmount,
	pendingADX
}) {
	if (!stats || !pool) throw new Error("errors.statsNotProvided")
	if (!actionAmount) throw new Error("errors.noDepositAmount")
	if (actionAmount.isZero())
		throw new TranslatableError("errors.zeroDepositToken", {
			currency: pool.depositAssetName
		})

	const signer = await getSigner(chosenWalletType)
	if (!signer) throw new Error("errors.failedToGetSigner")

	const walletAddr = await signer.getAddress()
	const identityAddr = getUserIdentity(walletAddr).addr

	const LPToken = new Contract(
		pool.depositAssetAddr, // just for testing
		ERC20ABI,
		defaultProvider
	)

	const [
		allowance,
		allowanceMC,
		balanceOnWallet,
		balanceOnIdentity,
		identityCode
	] = await Promise.all([
		LPToken.allowance(walletAddr, identityAddr),
		LPToken.allowance(identityAddr, MASTER_CHEF_ADDR),
		LPToken.balanceOf(walletAddr),
		LPToken.balanceOf(identityAddr),
		defaultProvider.getCode(identityAddr)
	])

	const isDeployed = identityCode !== "0x"

	if (actionAmount.gt(balanceOnWallet)) {
		throw new Error("errors.amountTooLarge")
	}

	const setAllowance = actionAmount.gt(ZERO) && !allowance.gte(actionAmount)

	const needed = actionAmount.sub(balanceOnIdentity)

	// set allowance to identity
	if (setAllowance) {
		const tokenWithSigner = LPToken.connect(signer)
		await tokenWithSigner.approve(identityAddr, MAX_UINT)
	}

	let identityTxns = []

	if (needed.gt(ZERO))
		identityTxns.push([
			LPToken.address,
			LPToken.interface.encodeFunctionData("transferFrom", [
				walletAddr,
				identityAddr,
				needed
			])
		])

	if (allowanceMC.lt(actionAmount)) {
		identityTxns.push([
			LPToken.address,
			LPToken.interface.encodeFunctionData("approve", [
				MASTER_CHEF_ADDR,
				MAX_UINT
			])
		])
	}



	return executeOnIdentity(
		chosenWalletType,
		identityTxns,
		setAllowance ? { gasLimit: isDeployed ? 269_420 : 469_420 } : {}
	)
}

export async function onLiquidityPoolWithdraw({
	pool,
	stats,
	chosenWalletType,
	actionAmount,
	pendingADX
}) {
	if (!stats || !pool) throw new Error("errors.statsNotProvided")
	if (!actionAmount) throw new Error("errors.noDepositAmount")

	const signer = await getSigner(chosenWalletType)
	if (!signer) throw new Error("errors.failedToGetSigner")

	const walletAddr = await signer.getAddress()
	const identityAddr = getUserIdentity(walletAddr).addr

	const LPToken = new Contract(pool.depositAssetAddr, ERC20ABI, defaultProvider)

	return ""
}

export async function onHarvestAll({ farmStats, chosenWalletType }) {
	if (!farmStats) throw new Error("errors.statsNotProvided")

	const signer = await getSigner(chosenWalletType)
	if (!signer) throw new Error("errors.failedToGetSigner")

	const walletAddr = await signer.getAddress()
	const identityAddr = getUserIdentity(walletAddr).addr

	const { statsByPoolId, totalRewards } = farmStats

	const poolsToHarvest = [...Object.values(statsByPoolId)].filter(
		pool => pool.pendingADX && pool.pendingADX.gt(ZERO)
	)

	if (!poolsToHarvest.length) {
		throw new Error("errors.nothingToHarvest")
	}

	const totalADXRewards = poolsToHarvest.reduce(
		(a, b) => a.add(b.pendingADX),
		ZERO
	)

	if (!totalRewards.eq(totalADXRewards)) {
		throw new Error("errors.invalidTotalRewards")
	}

	const identityTxns = poolsToHarvest.reduce((txns, pool) => {
		const { poolId } = pool

		return txns
	}, [])

	return executeOnIdentity(chosenWalletType, identityTxns)
}
