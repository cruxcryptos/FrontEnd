import React, { useEffect, useState, useContext } from "react"
import { useLocation } from "react-router-dom"
import { getPoolStatsByPoolId} from "../actions"
import {
	toIdAttributeString,
	formatADXPretty,
	formatDate
} from "../helpers/formatting"
import { DEPOSIT_POOLS, STAKING_RULES_URL, ZERO } from "../helpers/constants"
import {
	Grid,
	Typography,
	Button,
	FormControl,
	FormControlLabel,
	Checkbox,
	Box
} from "@material-ui/core"
import AppContext from "../AppContext"
import { useTranslation, Trans } from "react-i18next"
import { ExternalAnchor } from "./Anchor"
import Tooltip from "./Tooltip"
import { AmountText } from "./cardCommon"
import { utils } from "ethers"

const activePool = DEPOSIT_POOLS[0]

export default function MigrationForm({
	closeDialog,
	bond,
	isWithdrawMigration,
	poolLabel,
	created
}) {
	const location = useLocation()
	const { t } = useTranslation()
	const { stats, chosenWalletType, account, wrapDoingTxns } = useContext(
		AppContext
	)

	const {
		userWalletBalance,
		tomPoolStats,
		tomStakingV5PoolStats,
		userWalletToIdentityADXAllowance
	} = stats
	const { identityAdxRewardsAmount } = tomPoolStats
	const { unbondDays } = tomStakingV5PoolStats

	const [claimPendingRewards, setClaimPendingRewards] = useState(true)
	const [stakeWalletBalance, setStakeWalletBalance] = useState(false)
	const [confirmEnterTo, setConfirmEnterTo] = useState(false)
	const [enterTo, setEnterTo] = useState(null)

	const [confirmed, setConfirmed] = useState(false)

	const params = new URLSearchParams(location.search)
	const enterToParam = params.get("enterTo")

	const [poolStats, setPoolStats] = useState({})

	useEffect(() => {
		try {
			setEnterTo(utils.getAddress(enterToParam))
		} catch {
			setEnterTo(null)
		}
	}, [enterToParam])

	useEffect(() => {
		const newPoolStats = getPoolStatsByPoolId(stats, activePool.id)

		setPoolStats(newPoolStats)
	}, [stats])

	const onAction = async () => {
		if (!bond) {
			return
		}

		setConfirmed(false)
		if (closeDialog) closeDialog()

		const interactionAddress = enterTo && confirmEnterTo ? enterTo : null

	}

	const disableMigrationMsg = !confirmed ? t("bonds.tosNotConfirmed") : ""

	return ""
}
