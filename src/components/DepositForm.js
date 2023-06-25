import React, { useEffect, useState, useContext } from "react"
import {
	getDepositPool,
	getDepositActionByTypeAndPoolId,
	getPoolStatsByPoolId,
	isValidNumberString,
	getDepositActionMaxAmountByTypeAndPoolId,
	getDepositActionMaxAmountCurrentShareValueByTypeAndPoolId,
	DEPOSIT_ACTION_TYPES
} from "../actions"
import {
	parseADX,
	formatADX,
	formatADXPretty,
	toIdAttributeString,
	formatDateTime
} from "../helpers/formatting"
import { DEPOSIT_POOLS, STAKING_RULES_URL, ZERO } from "../helpers/constants"
import {
	Grid,
	TextField,
	Typography,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormControlLabel,
	Checkbox,
	Box,
	FormHelperText
} from "@material-ui/core"
import Tooltip from "./Tooltip"
import AppContext from "../AppContext"
import { useTranslation, Trans } from "react-i18next"
import StatsCard from "./StatsCard"
import { Alert } from "@material-ui/lab"
import { BigNumber } from "ethers"
import { ExternalAnchor } from "./Anchor"
import { AmountText } from "./cardCommon"

export default function DepositForm({
	depositPool,
	closeDialog,
	actionType = DEPOSIT_ACTION_TYPES.deposit
}) {
	const { t } = useTranslation()
	const { stats, chosenWalletType, wrapDoingTxns } = useContext(AppContext)

	const [actionAmount, setActionAmount] = useState("0.0")
	const [actionAmountBN, setActionAmountBN] = useState(0)
	const [amountErr, setAmountErr] = useState(false)
	const [amountErrText, setAmountErrText] = useState("")
	const [amountErrVals, setAmountErrVals] = useState({})
	const [selectErr, setSelectErr] = useState(false)
	const [selectErrText, setSelectErrText] = useState("")
	const [dirtyInputs, setDirtyInputs] = useState(false)
	const [confirmation, setConfirmation] = useState(false)
	const [rageConfirmed, setRageConfirmed] = useState(false)
	const [rageOverAvailableConfirmed, setRageOverAvailableConfirmed] = useState(
		false
	)
	const [activePool, setActivePool] = useState({})
	const [unbondCommitment, setUnbondCommitment] = useState(null)
	const [activeUnbondCommitments, setActiveUnbondCommitments] = useState(null)
	const [maxAmount, setMaxAmount] = useState(0)
	const [maxAmountAvailableForRage, setMaxAmountAvailableForRage] = useState(0)
	const [
		maxAmountCurrentSharesValue,
		setMaxAmountCurrentSharesValue
	] = useState(0)

	const [poolStats, setPoolStats] = useState({})

	useEffect(() => {
		const newActivePool = getDepositPool(depositPool || {})
		const newPoolStats = newActivePool
			? getPoolStatsByPoolId(stats, newActivePool.id)
			: {}

		console.log("Action Type: " + actionType)
		console.log("newActivePool id: " + newActivePool.id)
		console.log("newPoolStats: " + newPoolStats)
		console.log("Userb: " + stats.userWalletBalance)
		const newMaxAmount = getDepositActionMaxAmountByTypeAndPoolId(
			actionType,
			newActivePool.id,
			newPoolStats,
			stats.userBalance
		)


		const newMaxAmountCurrentShareValue = getDepositActionMaxAmountCurrentShareValueByTypeAndPoolId(
			actionType,
			newActivePool.id,
			newPoolStats
		)

		const newMaxAmountAvailable = getDepositActionMaxAmountByTypeAndPoolId(
			actionType,
			newActivePool.id,
			newPoolStats,
			stats.userWalletBalance
		)

		const newActiveUnbondCommitments = newPoolStats.userLeaves
			? [...newPoolStats.userLeaves].filter(x => !x.withdrawTx)
			: null

		setPoolStats(newPoolStats)
		setActiveUnbondCommitments(newActiveUnbondCommitments)
		setActivePool(newActivePool)
		if (newMaxAmount !== undefined) {
			setMaxAmount(newMaxAmount) //dá erro
		}
		setMaxAmountAvailableForRage(newMaxAmountAvailable)
		setMaxAmountCurrentSharesValue(newMaxAmountCurrentShareValue)
	}, [
		actionType,
		depositPool,
		stats,
		unbondCommitment,
		stats.userWalletBalance
	])

	const onAction = async () => {
		if (!activePool) {
			return
		}

		setConfirmation(false)
		if (closeDialog) closeDialog()

		const action = getDepositActionByTypeAndPoolId(actionType, activePool.id)

		await wrapDoingTxns(
			action.bind(
				null,
				stats,
				chosenWalletType,
				parseADX(actionAmount),
				unbondCommitment
			)
		)()
	}

	const confirmationLabel =
		actionType === DEPOSIT_ACTION_TYPES.deposit ||
		actionType === DEPOSIT_ACTION_TYPES.unbondCommitment ? (
			<Trans
				i18nKey={`deposits.${
					actionType === DEPOSIT_ACTION_TYPES.deposit
						? "depositConfirmationLabel"
						: "unbondConfirmationLabel"
				}`}
				values={{
					unbondDays: poolStats.unbondDays,
					amount: actionAmount,
					currency: "CRUX"
				}}
				components={{
					amount: <AmountText fontSize={21}></AmountText>,
					e1: (
						<ExternalAnchor
							id="new-deposit-form-adex-network-tos"
							target="_blank"
							href="https://www.adex.network/tos/"
						/>
					),
					e2: STAKING_RULES_URL ? (
						<ExternalAnchor
							id="new-bond-form-adex-staking-rules"
							target="_blank"
							href={STAKING_RULES_URL}
						/>
					) : (
						<></>
					)
				}}
			/>
		) : null

	const confirmed = !confirmationLabel || confirmation

	useEffect(() => {
		setAmountErr(false)
		setSelectErr(false)
		setAmountErrText("")
		setAmountErrVals({})

		if (
			actionType === DEPOSIT_ACTION_TYPES.withdraw &&
			activePool.id === DEPOSIT_POOLS[0].id &&
			!unbondCommitment
		) {
			setAmountErr(false)
			setAmountErrText("")

			setSelectErr(true)
			setSelectErrText("errors.unbondCommitmentNotSelected")

			return
		}

		if (
			actionType === DEPOSIT_ACTION_TYPES.withdraw &&
			activePool.id === DEPOSIT_POOLS[0].id &&
			unbondCommitment
		) {
			setSelectErr(false)
			setSelectErrText("")
			return
		}

		if (!isValidNumberString(actionAmount)) {
			setAmountErr(true)
			setAmountErrText("errors.invalidAmountInput")
			return
		}

		const amountInputSplit = actionAmount.split(".")

		if (amountInputSplit[1] && amountInputSplit[1].length > 18) {
			setAmountErr(true)
			setAmountErrText("errors.invalidDecimals")
			return
		}

		const amountWithMaxDecimalsVal = `${
			amountInputSplit[0]
		}${(amountInputSplit[1] !== undefined
			? `.${amountInputSplit[1]}`
			: ""
		).substr(0, 19)}`

		const amountBN = parseADX(amountWithMaxDecimalsVal)

		setActionAmountBN(amountBN)
		setActionAmount(amountWithMaxDecimalsVal)

		const minStakingAmountBN = activePool
			? parseADX(activePool.minStakingAmount || "0")
			: ZERO
		if (amountBN.gt(maxAmount)) {
			setAmountErr(true)
			setAmountErrText("errors.lowADXAmount")
			return
		}
		if (activePool && amountBN.lte(minStakingAmountBN)) {
			setAmountErr(true)
			setAmountErrText("errors.lessThanMinPoolADX")
			return
		}

		if (
			actionType === DEPOSIT_ACTION_TYPES.deposit &&
			poolStats &&
			poolStats.poolTotalStaked &&
			poolStats.poolDepositsLimit &&
			amountBN.add(poolStats.poolTotalStaked).gt(poolStats.poolDepositsLimit)
		) {
			setAmountErr(true)
			setAmountErrText("errors.amountOverPoolLimit")
			return
		}

		// if (
		// 	actionType === DEPOSIT_ACTION_TYPES.deposit &&
		// 	poolStats &&
		// 	activePool.id === DEPOSIT_POOLS[0].id &&
		// 	amountBN.add(poolStats.currentBalanceADX).gt(activePool.poolDepositsLimit)
		// ) {
		// 	setAmountErr(true)
		// 	setAmountErrText("errors.poolMaxDepositReached")
		// 	setAmountErrVals({
		// 		currentDeposited: formatADXPretty(poolStats.currentBalanceADX),
		// 		depositAmount: formatADXPretty(amountBN),
		// 		userDepositsLimit: formatADXPretty(
		// 			BigNumber.from(activePool.userDepositsLimit)
		// 		),
		// 		currency: "CRUX"
		// 	})

		// 	return
		// }
	}, [
		actionAmount,
		actionType,
		activePool,
		maxAmount,
		poolStats,
		unbondCommitment
	])

	const onAmountChange = amountStr => {
		setActionAmount(amountStr)
		setDirtyInputs(true)
	}

	const onUnbondCommitmentChange = ev => {
		setUnbondCommitment(ev.target.value)
		setDirtyInputs(true)
	}

	const getActionBtnText = () => {
		switch (actionType) {
			case DEPOSIT_ACTION_TYPES.deposit:
				return t("common.depositCurrency", { currency: "CRUX" })
			case DEPOSIT_ACTION_TYPES.rageLeave:
				return t("deposits.rageLeave")
			default:
				return "Do it now"
		}
	}

	return (
		<Box width={1}>
			<Grid container spacing={2}>
				{actionType === DEPOSIT_ACTION_TYPES.withdraw &&
				activeUnbondCommitments ? (
					<Grid item xs={12}></Grid>
				) : (
					<Grid item xs={12}>
						<TextField
							fullWidth
							id={`new-${actionType}-form-amount-field`}
							required
							label={t("common.labelADXAmount")}
							type="text"
							value={actionAmount}
							error={dirtyInputs && amountErr}
							onChange={ev => {
								onAmountChange(ev.target.value)
							}}
													helperText={t(
								dirtyInputs && amountErr ? amountErrText : "",
								amountErrVals
							)} 
						/>
						<Box mt={1}>
							<Button
								fullWidth
								size="small"
								id={`new-${actionType}-form-max-amount-btn`}
								onClick={() => {
									onAmountChange(formatADX(maxAmount))
								}}
							>
								{t("common.maxAmountBtn", {
									amount: formatADX(
										maxAmount
									),
									currency: "CRUX"
								})}
							</Button>
						</Box>
						{/* 
						maxAmountAvailableForRage */}
					</Grid>
				)}

				{activePool && (
					<Grid item xs={12} container spacing={2}>
						{actionType === DEPOSIT_ACTION_TYPES.deposit && (
							<>
								<Grid item xs={12}>
									<Typography variant="h6" style={{ color: "#e6791b" }}>
										{t("common.poolRewardPolicy")}:
									</Typography>
									<Typography variant="body1">
										{t(activePool.rewardPolicy)}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography style={{ color: "#e6791b" }} variant="h6">
										{t("common.poolAPY")}:
									</Typography>
									<Typography variant="body1">
										<Trans
											i18nKey="bonds.currentYield"
											values={{
												apy: poolStats.currentAPY,
												sign: "%"
											}}
											components={{
												farmer: (
													<span role="img" aria-label="farmer">
														🌾
													</span>
												)
											}}
										/>
									</Typography>
								</Grid>
							</>
						)}
						{(actionType === DEPOSIT_ACTION_TYPES.deposit ||
							actionType === DEPOSIT_ACTION_TYPES.unbondCommitment) && (
							<Grid item xs={12}>
								<Typography variant="h6" style={{ color: "#e6791b" }}>
									{t("deposits.lockupPeriodLabel")}:
								</Typography>
								<Typography variant="body1">
									{t("deposits.lockupDays", { count: poolStats.poolLockTimeDeposit })}
								</Typography>
							</Grid>
						)}
					</Grid>
				)}

				{confirmationLabel && (
					<Grid item xs={12}>
						<FormControlLabel
							style={{ userSelect: "none" }}
							label={confirmationLabel}
							control={
								<Checkbox
									id={`new-${actionType}-form-tos-check`}
									checked={confirmation}
									onChange={ev => setConfirmation(ev.target.checked)}
								/>
							}
						></FormControlLabel>
					</Grid>
				)}
				<Grid item xs={12}>
					<Tooltip title={t(amountErrText || selectErrText || "")}>
						<FormControl style={{ display: "flex" }}>
							<Button
								id={`new-${actionType}-stake-btn-${toIdAttributeString(
									activePool ? activePool.poolId || actionType : "-not-selected"
								)}`}
								disableElevation
								disabled={
									!confirmed || !!amountErr || !activePool || !!selectErr
								}
								color="primary"
								variant="contained"
								onClick={onAction}
							>
								{getActionBtnText()}
							</Button>
						</FormControl>
					</Tooltip>
				</Grid>
			</Grid>
		</Box>
	)
}
