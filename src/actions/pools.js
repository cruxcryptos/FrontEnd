import {
	DEPOSIT_POOLS,
	POOLS,
	ZERO
} from "../helpers/constants"
import {
	onLoyaltyPoolDeposit,
	onLoyaltyPoolWithdraw,
	onLoyaltyPoolClaimRewards,
	onSmallPoolDeposit,
	onSmallPoolClaimRewards,
	onSmallPoolWithdraw,
	onLongPoolDeposit,
	onLongPoolClaimRewards,
	onLongPoolWithdraw,
	onSmallMidDeposit,
	onSmallMidClaimRewards
} from "./loyaltyPoolActions"
import { claimRewards } from "./actions"
import { fetchJSON } from "../helpers/fetch"
import { formatDAI } from "../helpers/formatting"
import ERC20ABI from "../abi/ERC20"
import { Contract } from "ethers"
import { getDefaultProvider } from "../ethereum"
import { TranslatableError } from "../helpers/errors"

const defaultProvider = getDefaultProvider

const MARKET_URL = "https://market.adex.network"
const TOM_URL = "https://tom.adex.network"
export const DEPOSIT_ACTION_TYPES = {
	deposit: "deposit",
	claimrewards: "claimrewards",
	unbondCommitment: "unbondCommitment",
	withdraw: "withdraw",
	rageLeave: "rageLeave"
}

export const getDepositPool = poolId =>
	DEPOSIT_POOLS.concat(POOLS).find(x => x.id === poolId)

export const getDepositActionByPoolId = poolId => {
	if (poolId === DEPOSIT_POOLS[0].id) {
		return onLoyaltyPoolDeposit
	}
	if (poolId === DEPOSIT_POOLS[1].id) {
		return onSmallPoolDeposit
	}
	if (poolId === DEPOSIT_POOLS[2].id) {
		return onLongPoolDeposit
	}
	if (poolId === DEPOSIT_POOLS[3].id) {
		return onSmallMidDeposit
	}
	throw new TranslatableError("errors.noActionForPool", {
		actionName: "deposit",
		poolId
	})
}

export const getClaimRewardsActionByPoolId = poolId => {
	if (poolId === DEPOSIT_POOLS[0].id) {
		return onLoyaltyPoolClaimRewards
	}
	if (poolId === DEPOSIT_POOLS[1].id) {
		return onSmallPoolClaimRewards
	}
	if (poolId === DEPOSIT_POOLS[2].id) {
		return onLongPoolClaimRewards
	}
	if (poolId === DEPOSIT_POOLS[3].id) {
		return onSmallMidClaimRewards
	}
	throw new TranslatableError("errors.noActionForPool", {
		actionName: "claimrewards",
		poolId
	})
}

export const getWithdrawActionByPoolId = poolId => {
	if (poolId === DEPOSIT_POOLS[0].id) {
		return onLoyaltyPoolWithdraw
	}
	if (poolId === DEPOSIT_POOLS[1].id) {
		return onSmallPoolWithdraw
	}
	if (poolId === DEPOSIT_POOLS[2].id) {
		return onLongPoolWithdraw
	}
	if (poolId === DEPOSIT_POOLS[3].id) {
		return onSmallPoolWithdraw
	}
	throw new TranslatableError("errors.noActionForPool", {
		actionName: "withdraw",
		poolId
	})
}

export const getUnbondCommitmentActionByPoolId = poolId => {
	throw new TranslatableError("errors.noActionForPool", {
		actionName: "unbond commitment (leave)",
		poolId
	})
}

export const getRageLeaveActionByPoolId = poolId => {
	throw new TranslatableError("errors.noActionForPool", {
		actionName: "unbond commitment (leave)",
		poolId
	})
}

export const getMaxWithdrawAmountByPoolId = (poolId, stats) => {
	if (poolId === DEPOSIT_POOLS[0].id) {
		return stats.balanceLpADX || ZERO
	}

	return ZERO
}

export const getMaxRageLeaveAmountByPoolId = (poolId, stats) => {
	return ZERO
}

export const getMaxUnbondCommitmentAmountByPoolId = (poolId, stats) => {
	return ZERO
}

export const getMaxUnbondCommitmentCurrentShareBalanceAmountByPoolId = (
	poolId,
	stats
) => {
	return ZERO
}

export const getPoolStatsByPoolId = (stats, poolId) => {
	if (poolId === DEPOSIT_POOLS[0].id) {
		return stats.loyaltyPoolStats
	}
	if (poolId === DEPOSIT_POOLS[1].id) {
		return stats.smallPoolStats
	}
	if (poolId === DEPOSIT_POOLS[2].id) {
		return stats.longPoolStats
	}
	if (poolId === DEPOSIT_POOLS[3].id) {
		return stats.smallMidTermPoolStats
	}
	if (poolId === POOLS[0].id) {
		return stats.loyaltyPoolStats
	}
}

export const getDepositActionByTypeAndPoolId = (actionType, poolId) => {
	switch (actionType) {
		case DEPOSIT_ACTION_TYPES.withdraw:
			return getWithdrawActionByPoolId(poolId)
		case DEPOSIT_ACTION_TYPES.deposit:
			return getDepositActionByPoolId(poolId)
		case DEPOSIT_ACTION_TYPES.claimrewards:
			return getClaimRewardsActionByPoolId(poolId)
		case DEPOSIT_ACTION_TYPES.unbondCommitment:
			return getUnbondCommitmentActionByPoolId(poolId)
		case DEPOSIT_ACTION_TYPES.rageLeave:
			return getRageLeaveActionByPoolId(poolId)
		default:
			throw new TranslatableError("errors.invalidActionType", { actionType })
	}
}

export const getDepositActionMaxAmountByTypeAndPoolId = (
	actionType,
	poolId,
	poolStats,
	userWalletBalance
) => {
	switch (actionType) {
		case DEPOSIT_ACTION_TYPES.withdraw:
			return getMaxWithdrawAmountByPoolId(poolId, poolStats)
		case DEPOSIT_ACTION_TYPES.rageLeave:
			return getMaxRageLeaveAmountByPoolId(poolId, poolStats)
		case DEPOSIT_ACTION_TYPES.unbondCommitment:
			return getMaxUnbondCommitmentAmountByPoolId(poolId, poolStats)
		case DEPOSIT_ACTION_TYPES.deposit:
			return userWalletBalance
		default:
			return 0
	}
}

export const getDepositActionMaxAmountCurrentShareValueByTypeAndPoolId = (
	actionType,
	poolId,
	poolStats
) => {
	switch (actionType) {
		case DEPOSIT_ACTION_TYPES.unbondCommitment:
			return getMaxUnbondCommitmentCurrentShareBalanceAmountByPoolId(
				poolId,
				poolStats
			)

		default:
			return ZERO
	}
}

export const getWithdrawActionBySelectedRewardChannels = (
	rewards,
	chosenWalletType,
	stats
) => {
	const actions = Object.entries(
		rewards.reduce((byPool, r) => {
			const { poolId } = r
			byPool[poolId] = [...(byPool[poolId] || []), r]
			return byPool
		}, {})
	).map(([poolId, rwds]) => {
		if (poolId === DEPOSIT_POOLS[0].id) {
			return onLoyaltyPoolWithdraw.bind(
				null,
				stats,
				chosenWalletType,
				rwds[0].outstandingReward
			)
		}
		if (poolId === POOLS[0].id) {
			const rewardChannels = rwds.map(r => r.rewardChannel)
			return claimRewards.bind(null, chosenWalletType, rewardChannels)
		}
		return () => {}
	})

	return actions
}

const sumValidatorAnalyticsResValue = res =>
	Object.values(res.aggr || {}).reduce((a, b) => a.add(b.value), ZERO)

const toChartData = (data, valueLabel, currency) => {
	const noLast = [...(data.aggr || [{}])]
	noLast.pop()
	return noLast.reduce(
		(data, { time, value }) => {
			data.labels.push(new Date(time).toLocaleString())
			data.datasets.push(parseFloat(currency ? formatDAI(value) : value))

			return data
		},
		{ labels: [], datasets: [], valueLabel, currency }
	)
}

export const getValidatorTomStats = async () => {
	const channels = await fetchJSON(MARKET_URL + "/campaigns?all")
	const {
		totalDeposits,
		totalPayouts,
		uniqueUnits,
		uniquePublishers,
		uniqueAdvertisers
	} = channels.reduce(
		(data, { creator, depositAmount, status, spec }) => {
			data.totalDeposits = data.totalDeposits.add(depositAmount)
			data.totalPayouts = data.totalPayouts.add(
				Object.values(status.lastApprovedBalances || {}).reduce(
					(a, b) => a.add(b),
					ZERO
				)
			)

			spec.adUnits.forEach(({ ipfs }) => {
				data.uniqueUnits[ipfs] = true
			})
			Object.keys(status.lastApprovedBalances).forEach(key => {
				if (key !== creator) {
					data.uniquePublishers[key.toLowerCase()] = true
				}
			})

			data.uniqueAdvertisers[creator.toLowerCase()] = true

			return data
		},
		{
			totalDeposits: ZERO,
			totalPayouts: ZERO,
			uniqueUnits: {},
			uniquePublishers: {},
			uniqueAdvertisers: {}
		}
	)

	const dailyPayoutsData = await fetchJSON(
		TOM_URL + "/analytics?metric=eventPayouts&timeframe=day"
	)
	const yearlyTransactionsData = await fetchJSON(
		TOM_URL + "/analytics?metric=eventCounts&timeframe=year"
	)
	const dailyTransactionsData = await fetchJSON(
		TOM_URL + "/analytics?metric=eventCounts&timeframe=day"
	)
	const monthlyTransactionsData = await fetchJSON(
		TOM_URL + "/analytics?metric=eventCounts&timeframe=month"
	)

	return {
		totalCampaigns: channels.length,
		uniqueUnits: Object.keys(uniqueUnits).length,
		uniquePublishers: Object.keys(uniquePublishers).length,
		uniqueAdvertisers: Object.keys(uniqueAdvertisers).length,
		totalDeposits,
		totalPayouts,
		dailyPayoutsData: toChartData(dailyPayoutsData, "stats.labelPayout", "DAI"),
		dailyPayoutsVolume: sumValidatorAnalyticsResValue(dailyPayoutsData),
		yearlyTransactionsData: toChartData(
			yearlyTransactionsData,
			"stats.labelTransactions"
		),
		yearlyTransactions: sumValidatorAnalyticsResValue(yearlyTransactionsData),
		dailyTransactionsData: toChartData(
			dailyTransactionsData,
			"stats.labelTransactions"
		),
		dailyTransactions: sumValidatorAnalyticsResValue(dailyTransactionsData),
		monthlyTransactionsData: toChartData(
			monthlyTransactionsData,
			"stats.labelTransactions"
		),
		monthlyTransactions: sumValidatorAnalyticsResValue(monthlyTransactionsData)
	}
}

export const getValidatorStatsByPoolId = poolId => {
	if (poolId === POOLS[0].id) {
		return getValidatorTomStats
	}

	return () => ({})
}
