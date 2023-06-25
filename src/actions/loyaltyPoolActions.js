import { Contract } from "ethers"
import ERC20ABI from "../abi/ERC20"
import CRUX_MIDPOOL_ABI from "../abi/CRUX_MIDPOOL_STAKE_ABI"
import {
	ADDR_ADX,
	CRUX_MIDPOOL_STAKEADDRESS,
	CRUX_SMALLPOOL_STAKEADDRESS,
	ZERO,
	MAX_UINT,
	CRUX_LARGEPOOL_STAKEADDRESS
} from "../helpers/constants"
import { timeout } from "./common"
import { getSigner, getDefaultProvider, isAmbireWallet } from "../ethereum"

const defaultProvider = getDefaultProvider

const provider = defaultProvider
const Token = new Contract(ADDR_ADX, ERC20ABI, provider)

const CruxMidpoolStakeContract = new Contract(
	CRUX_MIDPOOL_STAKEADDRESS,
	CRUX_MIDPOOL_ABI,
	provider
)

const CruxSmallpoolStakeContract = new Contract(
	CRUX_SMALLPOOL_STAKEADDRESS,
	CRUX_MIDPOOL_ABI,
	provider
)


const CruxLongpoolStakeContract = new Contract(
	CRUX_LARGEPOOL_STAKEADDRESS,
	CRUX_MIDPOOL_ABI,
	provider
)

export const LOYALTY_POOP_EMPTY_STATS = {
	balanceLpToken: ZERO,
	balanceLpADX: ZERO,
	rewardADX: ZERO,
	poolTotalStaked: ZERO,
	currentAPY: 0,
	poolDepositsLimit: ZERO,
	loaded: false,
	userDataLoaded: false,
	unbondDays: 0,
	stakingEvents: [],
	totalRewards: ZERO,
	totalDeposits: ZERO,
	totalWithdraws: ZERO,
	totalSharesOutTransfersAdxValue: ZERO,
	totalSharesInTransfersAdxValue: ZERO,
	lockupPeriodEnd: "not defined",
	userShare: 0
}

export async function loadCruxMidPoolData(addr) {
	if (addr !== undefined) {
		const [
			poolTotalStaked,
			currentAPY,
			poolDepositsLimit,
			stakingDuration,
			startPeriod,
			endPeriod,
			poolTotalStakedUser,
			poolCurrentRewardsUser,
			lockupPeriodEnd,
			endUserLockDate,
			poolLockTimeDeposit,
		] = await Promise.all([
			CruxMidpoolStakeContract.totalDeposited(),
			CruxMidpoolStakeContract.fixedAPY(),
			CruxMidpoolStakeContract.stakingMax(),
			CruxMidpoolStakeContract.stakingDuration(),
			CruxMidpoolStakeContract.startPeriod(),
			CruxMidpoolStakeContract.endPeriod(),
			CruxMidpoolStakeContract.amountStaked(addr),
			CruxMidpoolStakeContract.rewardOf(addr),
			CruxMidpoolStakeContract.lockupPeriod(),
			CruxMidpoolStakeContract.endLockStaking(addr),
			CruxMidpoolStakeContract.fixedLockDays()
		])

		let PercentageFilled = (
			(100 * poolTotalStaked) /
			poolDepositsLimit
		).toFixed(2)

		return {
			...LOYALTY_POOP_EMPTY_STATS,
			poolTotalStaked,
			currentAPY,
			poolDepositsLimit,
			stakingDuration,
			startPeriod,
			endPeriod,
			poolTotalStakedUser,
			poolCurrentRewardsUser,
			lockupPeriodEnd,
			PercentageFilled,
			endUserLockDate,
			poolLockTimeDeposit
		}
	} else {
		let poolTotalStaked = 0
		let currentAPY = 0
		let poolDepositsLimit = 0
		let stakingDuration = 0
		let startPeriod = 0
		let endPeriod = 0
		let poolTotalStakedUser = 0
		let poolCurrentRewardsUser = 0
		let lockupPeriodEnd = 0
		let endUserLockDate = 0
		let poolLockTimeDeposit = 0
		return {
			LOYALTY_POOP_EMPTY_STATS,
		poolTotalStaked,
		currentAPY,
		poolDepositsLimit,
		stakingDuration,
		startPeriod,
		endPeriod,
		poolTotalStakedUser,
		poolCurrentRewardsUser,
		lockupPeriodEnd,
		endUserLockDate,
		poolLockTimeDeposit}
	}
}

export async function loadUserLoyaltyPoolsStats(walletAddr) {
	const poolData = await loadCruxMidPoolData(walletAddr)
	if (!walletAddr) {
		return {
			...poolData,
			loaded: true
		}
	}

	const currentBalance = {
		...poolData,
		loaded: true,
		userDataLoaded: true
	}

	const stats = {
		...currentBalance
	}

	return stats
}

export async function loadSmallPoolData(addr) {
	if (addr !== undefined) {
		const [
			poolTotalStaked,
			currentAPY,
			poolDepositsLimit,
			stakingDuration,
			startPeriod,
			endPeriod,
			poolTotalStakedUser,
			poolCurrentRewardsUser,
			lockupPeriodEnd,
			endUserLockDate,
			poolLockTimeDeposit,
		] = await Promise.all([
			CruxSmallpoolStakeContract.totalDeposited(),
			CruxSmallpoolStakeContract.fixedAPY(),
			CruxSmallpoolStakeContract.stakingMax(),
			CruxSmallpoolStakeContract.stakingDuration(),
			CruxSmallpoolStakeContract.startPeriod(),
			CruxSmallpoolStakeContract.endPeriod(),
			CruxSmallpoolStakeContract.amountStaked(addr),
			CruxSmallpoolStakeContract.rewardOf(addr),
			CruxSmallpoolStakeContract.lockupPeriod(),
			CruxSmallpoolStakeContract.endLockStaking(addr),
			CruxSmallpoolStakeContract.fixedLockDays()
		])

		let PercentageFilled = (
			(100 * poolTotalStaked) /
			poolDepositsLimit
		).toFixed(2)

		return {
			...LOYALTY_POOP_EMPTY_STATS,
			poolTotalStaked,
			currentAPY,
			poolDepositsLimit,
			stakingDuration,
			startPeriod,
			endPeriod,
			poolTotalStakedUser,
			poolCurrentRewardsUser,
			lockupPeriodEnd,
			PercentageFilled,
			endUserLockDate,
			poolLockTimeDeposit
		}
	} else {
		return LOYALTY_POOP_EMPTY_STATS
	}
}

export async function loadUserSmallPoolStats(walletAddr) {
	const poolData = await loadSmallPoolData(walletAddr)
	if (!walletAddr) {
		return {
			...poolData,
			loaded: true
		}
	}

	const currentBalance = {
		...poolData,
		loaded: true,
		userDataLoaded: true
	}

	const stats = {
		...currentBalance
	}

	return stats
}

export async function loadLongPoolData(addr) {
	if (addr !== undefined) {
		const [
			poolTotalStaked,
			currentAPY,
			poolDepositsLimit,
			stakingDuration,
			startPeriod,
			endPeriod,
			poolTotalStakedUser,
			poolCurrentRewardsUser,
			lockupPeriodEnd,
			endUserLockDate,
			poolLockTimeDeposit
		] = await Promise.all([
			CruxLongpoolStakeContract.totalDeposited(),
			CruxLongpoolStakeContract.fixedAPY(),
			CruxLongpoolStakeContract.stakingMax(),
			CruxLongpoolStakeContract.stakingDuration(),
			CruxLongpoolStakeContract.startPeriod(),
			CruxLongpoolStakeContract.endPeriod(),
			CruxLongpoolStakeContract.amountStaked(addr),
			CruxLongpoolStakeContract.rewardOf(addr),
			CruxLongpoolStakeContract.lockupPeriod(),
			CruxLongpoolStakeContract.endLockStaking(addr),
			CruxLongpoolStakeContract.fixedLockDays()
		])

		let PercentageFilled = (
			(100 * poolTotalStaked) /
			poolDepositsLimit
		).toFixed(2)

		return {
			...LOYALTY_POOP_EMPTY_STATS,
			poolTotalStaked,
			currentAPY,
			poolDepositsLimit,
			stakingDuration,
			startPeriod,
			endPeriod,
			poolTotalStakedUser,
			poolCurrentRewardsUser,
			lockupPeriodEnd,
			PercentageFilled,
			endUserLockDate,
			poolLockTimeDeposit
		}
	} else {
		return LOYALTY_POOP_EMPTY_STATS
	}
}

export async function loadUserLongPoolStats(walletAddr) {
	const poolData = await loadLongPoolData(walletAddr)
	if (!walletAddr) {
		return {
			...poolData,
			loaded: true
		}
	}

	const currentBalance = {
		...poolData,
		loaded: true,
		userDataLoaded: true
	}

	const stats = {
		...currentBalance
	}

	return stats
}
export async function onLoyaltyPoolDeposit(
	stats,
	chosenWalletType,
	adxDepositAmount
) {
	if (!stats) throw new Error("errors.statsNotProvided")
	if (!adxDepositAmount) throw new Error("errors.noDepositAmount")
	if (adxDepositAmount.isZero()) throw new Error("errors.zeroDeposit")
	if (adxDepositAmount.gt(stats.userBalance))
		throw new Error("errors.amountTooLarge")

	const signer = await getSigner(chosenWalletType)
	const walletAddr = await signer.getAddress()

	const [allowanceADXLOYALTY] = await Promise.all([
		Token.allowance(walletAddr, CruxMidpoolStakeContract.address)
	])

	const setAllowance = allowanceADXLOYALTY.lt(adxDepositAmount)
	const actions = []

	if (setAllowance) {
		const tokenWithSigner = new Contract(ADDR_ADX, ERC20ABI, signer)
		const approve = async () =>
			tokenWithSigner.approve(CruxMidpoolStakeContract.address, MAX_UINT)

		if (isAmbireWallet(signer)) {
			actions.push(approve())
			await timeout(1090)
		} else {
			await approve()
		}
	}

	const CruxMidpoolStakeContractSigner = new Contract(
		CRUX_MIDPOOL_STAKEADDRESS,
		CRUX_MIDPOOL_ABI,
		signer
	)

	actions.push(
		CruxMidpoolStakeContractSigner.deposit(
			adxDepositAmount,
			setAllowance ? { gasLimit: 150000 } : {}
		)
	)

	return Promise.all(actions)
}

export async function onSmallPoolDeposit(
	stats,
	chosenWalletType,
	adxDepositAmount
) {
	if (!stats) throw new Error("errors.statsNotProvided")
	if (!adxDepositAmount) throw new Error("errors.noDepositAmount")
	if (adxDepositAmount.isZero()) throw new Error("errors.zeroDeposit")
	if (adxDepositAmount.gt(stats.userBalance))
		throw new Error("errors.amountTooLarge")

	const signer = await getSigner(chosenWalletType)
	const walletAddr = await signer.getAddress()

	const [allowanceADXLOYALTY] = await Promise.all([
		Token.allowance(walletAddr, CruxSmallpoolStakeContract.address)
	])

	const setAllowance = allowanceADXLOYALTY.lt(adxDepositAmount)
	const actions = []

	if (setAllowance) {
		const tokenWithSigner = new Contract(ADDR_ADX, ERC20ABI, signer)
		const approve = async () =>
			tokenWithSigner.approve(CruxSmallpoolStakeContract.address, MAX_UINT)

		if (isAmbireWallet(signer)) {
			actions.push(approve())
			await timeout(1090)
		} else {
			await approve()
		}
	}

	const CruxSmallpoolStakeContractWithSigner = new Contract(
		CRUX_SMALLPOOL_STAKEADDRESS,
		CRUX_MIDPOOL_ABI,
		signer
	)

	actions.push(
		CruxSmallpoolStakeContractWithSigner.deposit(
			adxDepositAmount,
			setAllowance ? { gasLimit: 150000 } : {}
		)
	)

	return Promise.all(actions)
}
export async function onLongPoolDeposit(
	stats,
	chosenWalletType,
	adxDepositAmount
) {
	if (!stats) throw new Error("errors.statsNotProvided")
	if (!adxDepositAmount) throw new Error("errors.noDepositAmount")
	if (adxDepositAmount.isZero()) throw new Error("errors.zeroDeposit")
	if (adxDepositAmount.gt(stats.userBalance))
		throw new Error("errors.amountTooLarge")

	const signer = await getSigner(chosenWalletType)
	const walletAddr = await signer.getAddress()

	const [allowanceADXLOYALTY] = await Promise.all([
		Token.allowance(walletAddr, CruxLongpoolStakeContract.address)
	])

	const setAllowance = allowanceADXLOYALTY.lt(adxDepositAmount)
	const actions = []

	if (setAllowance) {
		const tokenWithSigner = new Contract(ADDR_ADX, ERC20ABI, signer)
		const approve = async () =>
			tokenWithSigner.approve(CruxLongpoolStakeContract.address, MAX_UINT)

		if (isAmbireWallet(signer)) {
			actions.push(approve())
			await timeout(1090)
		} else {
			await approve()
		}
	}

	const CruxLongpoolStakeContractWithSigner = new Contract(
		CRUX_LARGEPOOL_STAKEADDRESS,
		CRUX_MIDPOOL_ABI,
		signer
	)

	actions.push(
		CruxLongpoolStakeContractWithSigner.deposit(
			adxDepositAmount,
			setAllowance ? { gasLimit: 150000 } : {}
		)
	)

	return Promise.all(actions)
}

export async function onLoyaltyPoolClaimRewards(stats, chosenWalletType) {
	if (!stats) throw new Error("errors.statsNotProvided")

	const signer = await getSigner(chosenWalletType)

	const actions = []

	const CruxMidpoolStakeContractSigner = new Contract(
		CRUX_MIDPOOL_STAKEADDRESS,
		CRUX_MIDPOOL_ABI,
		signer
	)

	actions.push(CruxMidpoolStakeContractSigner.claimRewards())

	return Promise.all(actions)
}

export async function onSmallPoolClaimRewards(stats, chosenWalletType) {
	if (!stats) throw new Error("errors.statsNotProvided")

	const signer = await getSigner(chosenWalletType)

	const actions = []

	const CruxSmallpoolStakeContractwithSigner = new Contract(
		CRUX_SMALLPOOL_STAKEADDRESS,
		CRUX_MIDPOOL_ABI,
		signer
	)

	actions.push(CruxSmallpoolStakeContractwithSigner.claimRewards())

	return Promise.all(actions)
}

export async function onLongPoolClaimRewards(stats, chosenWalletType) {
	if (!stats) throw new Error("errors.statsNotProvided")

	const signer = await getSigner(chosenWalletType)

	const actions = []

	const CruxLongpoolStakeContractwithSigner = new Contract(
		CRUX_LARGEPOOL_STAKEADDRESS,
		CRUX_MIDPOOL_ABI,
		signer
	)

	actions.push(CruxLongpoolStakeContractwithSigner.claimRewards())

	return Promise.all(actions)
}


export async function onLoyaltyPoolWithdraw(stats, chosenWalletType) {
	if (!stats) throw new Error("errors.statsNotProvided")

	const signer = await getSigner(chosenWalletType)

	const CruxMidpoolStakeContractSigner = new Contract(
		CRUX_MIDPOOL_STAKEADDRESS,
		CRUX_MIDPOOL_ABI,
		signer
	)
	await CruxMidpoolStakeContractSigner.withdrawAll()
}

export async function onSmallPoolWithdraw(stats, chosenWalletType) {
	if (!stats) throw new Error("errors.statsNotProvided")

	const signer = await getSigner(chosenWalletType)

	const CruxSmallpoolStakeContractSigner = new Contract(
		CRUX_SMALLPOOL_STAKEADDRESS,
		CRUX_MIDPOOL_ABI,
		signer
	)
	await CruxSmallpoolStakeContractSigner.withdrawAll()
}

export async function onLongPoolWithdraw(stats, chosenWalletType) {
	if (!stats) throw new Error("errors.statsNotProvided")

	const signer = await getSigner(chosenWalletType)

	const CruxLongpoolStakeContractSigner = new Contract(
		CRUX_LARGEPOOL_STAKEADDRESS,
		CRUX_MIDPOOL_ABI,
		signer
	)
	await CruxLongpoolStakeContractSigner.withdrawAll()
}