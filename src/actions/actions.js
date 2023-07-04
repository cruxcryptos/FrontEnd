import { Contract } from "ethers"
import { BigNumber, utils } from "ethers"
import BalanceTree from "adex-protocol-eth/js/BalanceTree"
import StakingABI from "adex-protocol-eth/abi/Staking"
import CoreABI from "adex-protocol-eth/abi/AdExCore"
import ERC20ABI from "../abi/ERC20"
import CRUXABI from "../abi/CRUXABI"

import CRUX_MIDPOOL_ABI from "../abi/CRUX_MIDPOOL_STAKE_ABI"
import {
	ADDR_STAKING,
	ADDR_ADX,
	MAX_UINT,
	ZERO,
	CRUX_MIDPOOL_STAKEADDRESS,
	CRUX_SMALLPOOL_STAKEADDRESS,
	CRUX_LARGEPOOL_STAKEADDRESS,
	CRUX_SMALL_MIDTERM_STAKEADDRESS
} from "../helpers/constants"
import { getBondId } from "../helpers/bonds"
import { getUserIdentity } from "../helpers/identity"
import { getSigner, getDefaultProvider } from "../ethereum"
import {
	loadUserLoyaltyPoolsStats,
	loadUserSmallPoolStats,
	loadUserLongPoolStats,
	loadUserSmallMidPoolStats,
	LOYALTY_POOP_EMPTY_STATS
} from "./loyaltyPoolActions"
import { executeOnIdentity, toChannelTuple } from "./common"

const defaultProvider = getDefaultProvider

//const Staking = new Contract(ADDR_STAKING, StakingABI, defaultProvider)

//CRUX
const Token = new Contract(ADDR_ADX, ERC20ABI, defaultProvider)

//CRUX MID STAKER
const CruxMidpoolStakeContract = new Contract(
	CRUX_MIDPOOL_STAKEADDRESS,
	CRUX_MIDPOOL_ABI,
	defaultProvider
)

//CRUX MID STAKER
const CruxSmallPoolStakeContract = new Contract(
	CRUX_SMALLPOOL_STAKEADDRESS,
	CRUX_MIDPOOL_ABI,
	defaultProvider
)

//CRUX MID STAKER
const CruxLongPoolStakeContract = new Contract(
	CRUX_LARGEPOOL_STAKEADDRESS,
	CRUX_MIDPOOL_ABI,
	defaultProvider
)
//CRUX small mid  STAKER
const CruxSmallMidTermStakeContract = new Contract(
	CRUX_SMALL_MIDTERM_STAKEADDRESS,
	CRUX_MIDPOOL_ABI,
	defaultProvider
)

// const MAX_SLASH = BigNumber.from("1000000000000000000")
const SECONDS_IN_YEAR = 365 * 24 * 60 * 60

export const POOL_EMPTY_STATS = {
	totalStake: ZERO,
	totalCurrentTotalActiveStake: ZERO,
	currentAdxIncentiveAPY: 0,
	lastDaiFeesAPY: 0,
	totalAPY: 0,
	userRewardsADX: ZERO,
	userRewardsDAI: ZERO,
	loaded: false,
	userDataLoaded: false,
	rewardChannels: [],
	userBonds: []
}

export const EMPTY_STATS = {
	connectedWalletAddress: null,
	loaded: false,
	userBonds: [],
	userBalance: ZERO,
	totalStake: ZERO,
	totalStakeTom: ZERO,
	rewardChannels: [],
	identityADXIncentiveChannels: [],
	identityAdxRewardsAmount: ZERO,
	totalRewardADX: ZERO,
	totalRewardDAI: ZERO,
	tomRewardADX: ZERO,
	totalLockedOnDeposits: ZERO,
	totalPendingToUnlock: ZERO,
	totalUnlockedDeposits: ZERO,
	totalStaked: ZERO,
	apyTomADX: 0,
	userTotalStake: ZERO,
	totalBalanceADX: ZERO,
	userWalletBalance: ZERO,
	userIdentityBalance: ZERO,
	gaslessAddrBalance: ZERO,
	// canExecuteGasless: false,
	// canExecuteGaslessError: null,
	loyaltyPoolStats: LOYALTY_POOP_EMPTY_STATS,
	smallPoolStats: LOYALTY_POOP_EMPTY_STATS,
	longPoolStats: LOYALTY_POOP_EMPTY_STATS,
	smallMidTermPoolStats: LOYALTY_POOP_EMPTY_STATS,
	tomPoolStats: POOL_EMPTY_STATS,
	prices: {},
	legacyTokenBalance: ZERO,
	identityDeployed: false,
	userWalletToIdentityADXAllowance: ZERO,
	tomBondsMigrationData: {
		hasToMigrate: false,
		bondToMigrate: null,
		isWithdrawMigration: false
	},
	hasPendingTransactions: false
}

export async function loadStats(chosenWalletType, prices) {
	const [totalStake, userStats] = await Promise.all([
		Token.balanceOf("0xD641156213ad80A007993a1D9cE80085414CFF39"),
		loadUserStats(chosenWalletType, prices)
	])

	// return { ...userStats, ...totalStake, totalStakeTom: totalStake }
	return { ...userStats, ...totalStake }
}

// export async function loadActivePoolsStats(prices) {
// 	const tomPoolStats = await getPoolStats(POOLS[0], prices)

// 	return { tomPoolStats }
// }

export async function getPoolStats(pool, prices) {
	const totalStake = await Token.balanceOf(CRUX_MIDPOOL_STAKEADDRESS)
	const totalStakeSmallPool = await Token.balanceOf(CRUX_SMALLPOOL_STAKEADDRESS)
	const totalStakeLongPool = await Token.balanceOf(CRUX_LARGEPOOL_STAKEADDRESS)
	const totalStakeMidTermPool = await Token.balanceOf(CRUX_SMALL_MIDTERM_STAKEADDRESS)

	const stats = {
		...POOL_EMPTY_STATS,
		loaded: true,
		totalStake,
		totalStakeSmallPool,
		totalStakeLongPool,
		totalStakeMidTermPool
	}

	return stats
}

export async function loadUserStats(chosenWalletType, prices) {
	const signer = await getSigner(chosenWalletType)
	const addr = await signer.getAddress()
	let totalStaked = 0
	let totalStakedSmall = 0
	let totalStakedLong = 0
	let totalStakedSmallMid = 0

	if (addr.length > 2) {
		const identityAddr = getUserIdentity(addr).addr
		const identityDeployed =
			(await defaultProvider.getCode(identityAddr)) !== "0x"

		totalStaked = await CruxMidpoolStakeContract.amountStaked(addr)
		totalStakedSmall = await CruxSmallPoolStakeContract.amountStaked(addr)
		totalStakedLong = await CruxLongPoolStakeContract.amountStaked(addr)
		totalStakedSmallMid = await CruxSmallMidTermStakeContract.amountStaked(addr)

		if (!chosenWalletType.name) {
			const loyaltyPoolStats = await loadUserLoyaltyPoolsStats()
			const smallPoolStats = await loadUserSmallPoolStats()
			const longPoolStats = await loadUserLongPoolStats()
			const smallMidTermPoolStats = await loadUserSmallMidPoolStats()
			//const poolStats = await loadActivePoolsStats(prices)

			return {
				...EMPTY_STATS,
				loyaltyPoolStats,
				smallPoolStats,
				longPoolStats,
				smallMidTermPoolStats,
				prices,
				loaded: true
			}
		}

		if (!signer) return { ...EMPTY_STATS, loaded: true }

		const [
			{
				userBonds: userBondsData,
				userBalance,
				userWalletBalance,
				userIdentityBalance
			},
			loyaltyPoolStats,
			smallPoolStats,
			longPoolStats,
			smallMidTermPoolStats,
			migrationBonusPromilles = BigNumber.from(1048),
			userWalletToIdentityADXAllowance,
			latestTransactionsCount,
			pendingTransactionsCount
		] = await Promise.all([
			loadBondStats(addr, identityAddr), // TODO: TOM only at the moment
			loadUserLoyaltyPoolsStats(addr),
			loadUserSmallPoolStats(addr),
			loadUserLongPoolStats(addr),
			loadUserSmallMidPoolStats(addr),
			//StakingMigrator.WITH_BONUS_PROMILLES(), // TODO: uncomment when migrator deployed
			Token.allowance(addr, identityAddr),
			// NOTE: getTransactionCount does not work correct with signer, because "pending" may not be supported by signers provider
			defaultProvider.getTransactionCount(addr, "latest"),
			defaultProvider.getTransactionCount(addr, "pending")
		])

		const nonStakedBalance = userWalletBalance

		totalStaked = totalStaked.add(totalStakedLong)
		totalStaked = totalStaked.add(totalStakedSmallMid)
		totalStaked = totalStaked.add(totalStakedSmall)

		const totalBalanceADX = nonStakedBalance
			.add(totalStaked)
			.add(userIdentityBalance)
		return {
			identityAddr,
			identityDeployed,
			connectedWalletAddress: addr,
			userBalance: nonStakedBalance, // ADX on wallet, legacy identity and gasless addr
			loaded: true,
			totalStaked,
			totalStakedLong,
			totalStakedSmall,
			totalStakedSmallMid,
			totalBalanceADX, // Wallet + Stake + Reward
			// canExecuteGasless,
			// canExecuteGaslessError,
			loyaltyPoolStats,
			smallPoolStats,
			longPoolStats,
			smallMidTermPoolStats,
			prices,
			userWalletToIdentityADXAllowance
		}
	}
}

export async function loadBondStats(addr, identityAddr) {
	const [
		[userWalletBalance, userIdentityBalance],
		// slashLogs,
		migrationLogs = []
	] = await Promise.all([
		Promise.all([Token.balanceOf(addr), Token.balanceOf(identityAddr)])
		// defaultProvider.getLogs({
		// 	fromBlock: 0,
		// 	...Staking.filters.LogSlash(null, null)
		// }),
	])

	//TODO: remove identity code
	const userBalance = userWalletBalance.add(userIdentityBalance)

	// const slashedByPool = slashLogs.reduce((pools, log) => {
	// 	const { poolId, newSlashPts } = Staking.interface.parseLog(log).args
	// 	pools[poolId] = newSlashPts
	// 	return pools
	// }, {})
	const userBonds = ""

	return {
		userBonds,
		userBalance,
		userWalletBalance,
		userIdentityBalance
	}
}

export async function claimRewards(chosenWalletType, rewardChannels) {
	console.log("triggered claimRewards")
	/* const signer = await getSigner(chosenWalletType)
	if (!signer) throw new Error("errors.failedToGetSigner")
	const walletAddr = await signer.getAddress()

	// @TODO: this is obsolete, it should be removed at some point (when no more DAI rewards on wallets are left)
	//const coreWithSigner = new Contract(ADDR_CORE, CoreABI, signer)
	const legacyChannels = rewardChannels.filter(
		channel => channel.claimFrom === walletAddr
	)
	for (const channel of legacyChannels) {
		const channelTuple = toChannelTuple(channel.channelArgs)
		await coreWithSigner.channelWithdraw(
			channelTuple,
			channel.stateRoot,
			channel.signatures,
			channel.proof,
			channel.amount
		)
	}

	const identityChannels = rewardChannels.filter(
		channel => channel.claimFrom !== walletAddr
	)
	const toTransfer = {}
	identityChannels.forEach(channel => {
		const { tokenAddr } = channel.channelArgs
		const amnt = toTransfer[tokenAddr] || ZERO
		toTransfer[tokenAddr] = amnt.add(channel.outstandingReward)
	})
	const identityTxns = identityChannels
		.map(channel => {
			const channelTuple = toChannelTuple(channel.channelArgs)
			return [
				Core.address,
				Core.interface.encodeFunctionData("channelWithdraw", [
					channelTuple,
					channel.stateRoot,
					channel.signatures,
					channel.proof,
					channel.amount
				])
			]
		})
		.concat(
			Object.entries(toTransfer).map(([tokenAddr, amount]) => [
				tokenAddr,
				Token.interface.encodeFunctionData("transfer", [walletAddr, amount])
			])
		)

	if (identityTxns.length) {
		await executeOnIdentity(chosenWalletType, identityTxns)
	} */
}

export async function reBond(chosenWalletType, { amount, poolId, nonce }) {
	const bond = [amount, poolId, nonce || ZERO]
	const signer = await getSigner(chosenWalletType)
	if (!signer) throw new Error("errors.failedToGetSigner")
	const walletAddr = await signer.getAddress()
	const { addr } = getUserIdentity(walletAddr)
	return executeOnIdentity(
		chosenWalletType,0
	)
}

export async function identityWithdraw(chosenWalletType) {
	const signer = await getSigner(chosenWalletType)
	if (!signer) throw new Error("errors.failedToGetSigner")
	const walletAddr = await signer.getAddress()
	const { addr } = getUserIdentity(walletAddr)

	const identityBalance = await Token.balanceOf(addr)

	const identityTxns = [
		[
			Token.address,
			Token.interface.encodeFunctionData("transfer", [
				walletAddr,
				identityBalance
			])
		]
	]

	await executeOnIdentity(chosenWalletType, identityTxns, {}, false, null)
}
