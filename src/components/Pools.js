import React, { useContext } from "react"
import AppContext from "../AppContext"
import {
	Box,
	Grid,
	SvgIcon,
	Typography,
	useMediaQuery
} from "@material-ui/core"
import PoolCard from "./PoolCard"
import {
	formatADXPretty,
	getADXInUSDFormatted,
	getTimeUnixInDays
} from "../helpers/formatting"
import { ReactComponent as TomIcon } from "./../resources/tom-ic.svg"
import { ReactComponent as LoyaltyIcon } from "./../resources/loyalty-ic.svg"
import { ReactComponent as BalancerIcon } from "./../resources/balancer-bal-logo.svg"
import { ReactComponent as UniswapIcon } from "./../resources/uniswap-uni-logo.svg"
import { ReactComponent as YUSDIcon } from "./../resources/yUSD.svg"
import { ReactComponent as ADXIcon } from "./../resources/adex-logo-clean.svg"
import { ReactComponent as ETHIcon } from "./../resources/eth-logo.svg"
import { ReactComponent as YFIIcon } from "./../resources/yfi-logo.svg"
import { ReactComponent as LINKIcon } from "./../resources/chain-link-logo.svg"
import PoolOneImage from "./../resources/imagery/pool_crux_a.png"
import PoolTwoImage from "./../resources/imagery/pool_crux_b.png"
import PoolThreeImage from "./../resources/imagery/pool_crux_c.png"
import SectionHeader from "./SectionHeader"
import { DEPOSIT_POOLS } from "../helpers/constants"
import StarsIcon from "@material-ui/icons/Stars"
import WithDialog from "./WithDialog"
import DepositForm from "./DepositForm"
import WithdrawRewardForm from "./WithdrawRewardForm"
import WithdrawForm from "./WithdrawForm"
import EmailSignUp from "./EmailSignUpCard"
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"
import Anchor from "components/Anchor"
import { useTranslation } from "react-i18next"
import { DEPOSIT_ACTION_TYPES } from "../actions"
import { makeStyles } from "@material-ui/core/styles"

import cruxvideo from "./CRUX_TEASE.mp4"

const DepositsDialog = WithDialog(DepositForm)
const WithdrawDialog = WithDialog(WithdrawForm)
const WithdrawRewardDialog = WithDialog(WithdrawRewardForm)

const LOYALTY_POOL = DEPOSIT_POOLS[0]
const SMALL_POOL = DEPOSIT_POOLS[1]
const LONG_POOL = DEPOSIT_POOLS[2]

const useStyles = makeStyles(theme => {
	return {
		fontSizeSmall: {
			fontSize: 12
		},
		textWhite: {
			color: "white"
		}
	}
})

const Pools = () => {
	const classes = useStyles()
	const { t } = useTranslation()
	const { stats, chosenWalletType, prices } = useContext(AppContext)
	const { loyaltyPoolStats, smallPoolStats, longPoolStats } = stats

	const canStake = !!chosenWalletType.name && !!stats.connectedWalletAddress
	const justifyCenter = useMediaQuery(theme => theme.breakpoints.down("xs"))

	const loyaltyPoolAPY = loyaltyPoolStats.currentAPY
	const loyaltyPoolTotalStaked = loyaltyPoolStats.poolTotalStaked
	const loyaltyPoolPercentageFilled = loyaltyPoolStats.PercentageFilled || 0
	const loyaltyPoolUserTotalStaked = loyaltyPoolStats.poolTotalStakedUser
	const loyaltyPoolUserTotalCurrentRewards =
		loyaltyPoolStats.poolCurrentRewardsUser
	const EndStaking = loyaltyPoolStats.endPeriod || "0"
	const StartStaking = loyaltyPoolStats.startPeriod || "0"
	const UserEndLockDate = loyaltyPoolStats.endUserLockDate
	const poolLockTimeDeposit = loyaltyPoolStats.poolLockTimeDeposit || "0"

	const SmallPoolPoolAPY = smallPoolStats.currentAPY
	const SmallPoolTotalStaked = smallPoolStats.poolTotalStaked
	const SmallPoolPercentageFilled = smallPoolStats.PercentageFilled || 0
	const SmallPoolUserTotalStaked = smallPoolStats.poolTotalStakedUser
	const SmallPoolUserTotalCurrentRewards = smallPoolStats.poolCurrentRewardsUser
	const EndStakingSmallPool = smallPoolStats.endPeriod || "0"
	const StartStakingSmallPool = smallPoolStats.startPeriod || "0"
	const UserEndLockDateSmallPool = smallPoolStats.endUserLockDate
	const poolLockTimeDepositSmall = smallPoolStats.poolLockTimeDeposit || "0"

	const LongPoolAPY = longPoolStats.currentAPY
	const LongPoolTotalStaked = longPoolStats.poolTotalStaked
	const LongPoolPercentageFilled = longPoolStats.PercentageFilled || 0
	const LongPoolUserTotalStaked = longPoolStats.poolTotalStakedUser
	const LongPoolUserTotalCurrentRewards = longPoolStats.poolCurrentRewardsUser
	const poolLockTimeDepositLong = longPoolStats.poolLockTimeDeposit || "0"
	const EndStakingLongPool = longPoolStats.endPeriod || "0"
	const StartStakingLongPool = longPoolStats.startPeriod || "0"
	const UserEndLockDateLongPool = longPoolStats.endUserLockDate

	return (
		<Box>
			<SectionHeader title={t("common.pools")} />
			<Box mt={4}>
				<Box
					display="flex"
					flex={1}
					flexDirection="row"
					flexWrap="wrap"
					alignItems="stretch"
					justifyContent={justifyCenter ? "center" : "flex-start"}
				>
					{/* SMALL STAKE POOL */}
					<PoolCard
					
					comingSoon={false}
						id="small-pool"
						icon={
							<img
								src={PoolTwoImage}
								style={{ width: "100%" }}
								alt="crux_pool_a"
							></img>
						}
						percentageFilledPool={SmallPoolPercentageFilled}
						name={"Undead"}
						totalStakedADX={`${formatADXPretty(SmallPoolTotalStaked)} CRUX`}
						totalStakedUSD={`${getADXInUSDFormatted(
							prices,
							SmallPoolTotalStaked
						)}`}
						currentAPY={`${SmallPoolPoolAPY.toFixed(2)} %`}
						weeklyYield={`${(SmallPoolPoolAPY / (365 / 7)).toFixed(4)} %`}
						weeklyYieldInfo={[
							t("pools.currentDailyYield", {
								yield: (SmallPoolPoolAPY / 365).toFixed(4)
							})
						]}
						UserEndStakeLock={UserEndLockDateSmallPool}
						loading={!smallPoolStats.loaded}
						disabled={!canStake}
						disabledInfo={t("pools.connectWalletToDeposit")}
						lockupPeriodTitle={t("common.unbondPeriod")}
						lockupPeriodInfo={t("common.noUnbondPeriod")}
						lockupPeriod={poolLockTimeDepositSmall + ` Days`}
						endStakingDate={EndStakingSmallPool}
						startStakingDate={StartStakingSmallPool}
						totalStakedADXuser={`${formatADXPretty(SmallPoolUserTotalStaked)} CRUX`}
						totalStakedUSDUser={`${getADXInUSDFormatted(
							prices,
							SmallPoolUserTotalStaked
						)}`}
						totalCurrentPendingRewards={
							SmallPoolUserTotalCurrentRewards
								? `${formatADXPretty(SmallPoolUserTotalCurrentRewards)} CRUX`
								: "0 CRUX"
						}
						totalRewardsUsd={`${getADXInUSDFormatted(
							prices,
							SmallPoolUserTotalCurrentRewards
						)}`}
						extraData={[
							{
								id: "loyalty-pool-deposits-limit",
								title: t("pools.totalDepositsLimit"),
								titleInfo: "",
								normalValue: `${formatADXPretty(
									smallPoolStats.poolDepositsLimit
								)} CRUX`,
								importantValue: "",
								valueInfo: "",
								extra: "",
								extrInfo: ""
							}
						]}
						poolfilled={SmallPoolPercentageFilled >= 100 ? true : false }
						actionBtn={
							<DepositsDialog
								fullWidth
								id="loyalty-pool-deposit-form-card"
								title={t("common.addNewDeposit")}
								btnLabel={t("common.deposit")}
								color="secondary"
								size="large"
								variant="contained"
								disabled={!canStake}
								depositPool={SMALL_POOL.id}
								actionType={DEPOSIT_ACTION_TYPES.deposit}
							/>
						}
						actionBtnWithdraw={
							<WithdrawDialog
								fullWidth
								id="loyalty-pool-withdraw-form-card"
								title="Unstake $CRUX"
								btnLabel="Withdraw All"
								color="secondary"
								size="large"
								variant="contained"
								userTotalStaked={SmallPoolUserTotalStaked}
								disabled={!canStake}
								depositPool={SMALL_POOL.id}
								actionType={DEPOSIT_ACTION_TYPES.withdraw}
							/>
						}
						actionBtnClaimRewards={
							<WithdrawRewardDialog
								fullWidth
								id="loyalty-pool-claimrewards-form-card"
								title="Claim Staking Rewards"
								btnLabel="Claim Rewards"
								disabled={SmallPoolUserTotalCurrentRewards > 1 ? false : true}
								color="secondary"
								size="large"
								variant="contained"
								depositPool={SMALL_POOL.id}
								currentRewards={SmallPoolUserTotalCurrentRewards}
								actionType={DEPOSIT_ACTION_TYPES.claimrewards}
							/>
						}
					/>

					{/* MIDSTAKEPOOL */}
					<PoolCard
					
					comingSoon={false}
						id="loyalty-pool"
						icon={
							<img
								src={PoolOneImage}
								style={{ width: "100%" }}
								alt="pool_b_crux"
							></img>
						}
						percentageFilledPool={loyaltyPoolPercentageFilled}
						name={"Brainiacs"}
						totalStakedADX={`${formatADXPretty(loyaltyPoolTotalStaked)} CRUX`}
						totalStakedUSD={`${getADXInUSDFormatted(
							prices,
							loyaltyPoolTotalStaked
						)}`}
						currentAPY={`${loyaltyPoolAPY.toFixed(2)} %`}
						weeklyYield={`${(loyaltyPoolAPY / (365 / 7)).toFixed(4)} %`}
						weeklyYieldInfo={[
							t("pools.currentDailyYield", {
								yield: (loyaltyPoolAPY / 365).toFixed(4)
							})
						]}
						
						poolfilled={loyaltyPoolPercentageFilled >= 100 ? true : false }
						loading={!loyaltyPoolStats.loaded}
						disabled={!canStake}
						UserEndStakeLock={UserEndLockDate}
						disabledInfo={t("pools.connectWalletToDeposit")}
						lockupPeriodTitle={t("common.unbondPeriod")}
						lockupPeriodInfo={t("common.noUnbondPeriod")}
						lockupPeriod={poolLockTimeDeposit + ` Days`}
						endStakingDate={EndStaking}
						startStakingDate={StartStaking}
						totalStakedADXuser={`${formatADXPretty(
							loyaltyPoolUserTotalStaked
						)} CRUX`}
						totalStakedUSDUser={`${getADXInUSDFormatted(
							prices,
							loyaltyPoolUserTotalStaked
						)}`}
						totalCurrentPendingRewards={
							loyaltyPoolUserTotalCurrentRewards
								? `${formatADXPretty(loyaltyPoolUserTotalCurrentRewards)} CRUX`
								: "0 CRUX"
						}
						totalRewardsUsd={`${getADXInUSDFormatted(
							prices,
							loyaltyPoolUserTotalCurrentRewards
						)}`}
						extraData={[
							{
								id: "loyalty-pool-deposits-limit",
								title: t("pools.totalDepositsLimit"),
								titleInfo: "",
								normalValue: `${formatADXPretty(
									loyaltyPoolStats.poolDepositsLimit
								)} CRUX`,
								importantValue: "",
								valueInfo: "",
								extra: "",
								extrInfo: ""
							}
						]}
						actionBtn={
							<DepositsDialog
								fullWidth
								id="loyalty-pool-deposit-form-card"
								title={t("common.addNewDeposit")}
								btnLabel={t("common.deposit")}
								color="secondary"
								size="large"
								variant="contained"
								disabled={!canStake}
								depositPool={LOYALTY_POOL.id}
								actionType={DEPOSIT_ACTION_TYPES.deposit}
							/>
						}
						actionBtnWithdraw={
							<WithdrawDialog
								fullWidth
								id="loyalty-pool-withdraw-form-card"
								title="Unstake $CRUX"
								btnLabel="Withdraw All"
								color="secondary"
								size="large"
								variant="contained"
								userTotalStaked={loyaltyPoolUserTotalStaked}
								disabled={!canStake}
								depositPool={LOYALTY_POOL.id}
								actionType={DEPOSIT_ACTION_TYPES.withdraw}
							/>
						}
						actionBtnClaimRewards={
							<WithdrawRewardDialog
								fullWidth
								id="loyalty-pool-claimrewards-form-card"
								title="Claim Staking Rewards"
								btnLabel="Claim Rewards"
								disabled={loyaltyPoolUserTotalCurrentRewards > 1 ? false : true}
								color="secondary"
								size="large"
								variant="contained"
								depositPool={LOYALTY_POOL.id}
								currentRewards={loyaltyPoolUserTotalCurrentRewards}
								actionType={DEPOSIT_ACTION_TYPES.claimrewards}
							/>
						}
					/>

					{/* LONG STAKE POOL */}
					<PoolCard
						id="long-pool"
						
						comingSoon={false}
						icon={
							<img
								src={PoolThreeImage}
								style={{ width: "100%" }}
								alt="pool_c_image"
							></img>
						}
						percentageFilledPool={LongPoolPercentageFilled}
						name={"Survivors"}
						totalStakedADX={`${formatADXPretty(LongPoolTotalStaked)} CRUX`}
						UserEndStakeLock={UserEndLockDateLongPool}
						totalStakedUSD={`${getADXInUSDFormatted(
							prices,
							LongPoolTotalStaked
						)}`}
						currentAPY={`${LongPoolAPY.toFixed(2)} %`}
						weeklyYield={`${(LongPoolAPY / (365 / 7)).toFixed(4)} %`}
						weeklyYieldInfo={[
							t("pools.currentDailyYield", {
								yield: (LongPoolAPY / 365).toFixed(4)
							})
						]}
						poolfilled={LongPoolPercentageFilled >= 100 ? true : false }
						loading={!longPoolStats.loaded}
						disabled={!canStake}
						disabledInfo={t("pools.connectWalletToDeposit")}
						lockupPeriodTitle={t("common.unbondPeriod")}
						lockupPeriodInfo={t("common.noUnbondPeriod")}
						lockupPeriod={poolLockTimeDepositLong + ` Days`}
						endStakingDate={EndStakingLongPool}
						startStakingDate={StartStakingLongPool}
						totalStakedADXuser={`${formatADXPretty(LongPoolUserTotalStaked)} CRUX`}
						totalStakedUSDUser={`${getADXInUSDFormatted(
							prices,
							LongPoolUserTotalStaked
						)}`}
						totalCurrentPendingRewards={
							LongPoolUserTotalCurrentRewards
								? `${formatADXPretty(LongPoolUserTotalCurrentRewards)} CRUX`
								: "0 CRUX"
						}
						totalRewardsUsd={`${getADXInUSDFormatted(
							prices,
							LongPoolUserTotalCurrentRewards
						)}`}
						extraData={[
							{
								id: "loyalty-pool-deposits-limit",
								title: t("pools.totalDepositsLimit"),
								titleInfo: "",
								normalValue: `${formatADXPretty(
									longPoolStats.poolDepositsLimit
								)} CRUX`,
								importantValue: "",
								valueInfo: "",
								extra: "",
								extrInfo: ""
							}
						]}
						actionBtn={
							<DepositsDialog
								fullWidth
								id="loyalty-pool-deposit-form-card"
								title={t("common.addNewDeposit")}
								btnLabel={t("common.deposit")}
								color="secondary"
								size="large"
								variant="contained"
								disabled={!canStake}
								depositPool={LONG_POOL.id}
								actionType={DEPOSIT_ACTION_TYPES.deposit}
							/>
						}
						actionBtnWithdraw={
							<WithdrawDialog
								fullWidth
								id="loyalty-pool-withdraw-form-card"
								title="Unstake $CRUX"
								btnLabel="Withdraw All"
								color="secondary"
								size="large"
								variant="contained"
								userTotalStaked={LongPoolUserTotalStaked}
								disabled={!canStake}
								depositPool={LONG_POOL.id}
								actionType={DEPOSIT_ACTION_TYPES.withdraw}
							/>
						}
						actionBtnClaimRewards={
							<WithdrawRewardDialog
								fullWidth
								id="loyalty-pool-claimrewards-form-card"
								title="Claim Staking Rewards"
								btnLabel="Claim Rewards"
								disabled={LongPoolUserTotalCurrentRewards > 1 ? false : true}
								color="secondary"
								size="large"
								variant="contained"
								depositPool={LONG_POOL.id}
								currentRewards={LongPoolUserTotalCurrentRewards}
								actionType={DEPOSIT_ACTION_TYPES.claimrewards}
							/>
						}
					/>

					<Box>
						<Box
							bgcolor={"background.card"}
							style={{ opacity: "0.9" }}
							p={2}
							my={3}
							mx={1.5}
							width={270}
							display="flex"
							flexDirection="column"
							alignItems="center"
							boxShadow={25}
							position="relative"
						>
							<Grid
								container
								direction="row"
								justifyContent="center"
								alignItems="center"
								spacing={2}
							>
								<Grid item xs={2}>
									<StarsIcon color="secondary" />
								</Grid>
								<Grid item xs={10}>
									<Typography align="left" variant="h5" color="textPrimary">
										<strong>{t("email.newToStaking")}</strong>
									</Typography>

									<Box display="flex" alignItems="center">
										<Typography align="left" variant="body1" color="secondary">
											<Anchor
												target="_blank"
												href="https://crux-mmorpg.gitbook.io/crux/usdcrux-coin/staking"
											>
												Learn More
												<ArrowForwardIosIcon
													fontSize="small"
													classes={{
														fontSizeSmall: classes.fontSizeSmall
													}}
												/>
											</Anchor>
										</Typography>
									</Box>
								</Grid>
							</Grid>
						</Box>
						<EmailSignUp formId={2} formName="stakingportalleads" />
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

export default Pools
