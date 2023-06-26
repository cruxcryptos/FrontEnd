import React, { Fragment } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
	Box,
	Button,
	Typography,
	CircularProgress,
	LinearProgress,
	SvgIcon
} from "@material-ui/core"

import { ReactComponent as ComingSoonImg } from "./../resources/coming-soon-ic.svg"
import { CardRow } from "./cardCommon"
import Tooltip from "./Tooltip"
import WithRouterLink from "./WithRouterLink"
import { ReactComponent as StatsIcon } from "./../resources/stats-ic.svg"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { ReactComponent as StakingIcon } from "./../resources/link-ic.svg"
import { ReactComponent as GaslessIcon } from "./../resources/gasless-ic.svg"
import { ReactComponent as GiftIcon } from "./../resources/gift-ic.svg"
import { ReactComponent as FarmIcon } from "./../resources/farm-icon.svg"

const ButtonWithLink = WithRouterLink(Button)

const useStyles = makeStyles(theme => {
	return {
		iconBox: {
			borderRadius: "100%",
			border: "2px solid #E6791B",
			overflow: "hidden",
			position: "absolute",
			width: 100,
			height: 100,
			top: -theme.spacing(7),
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.black,
			boxShadow: theme.type === "light" ? theme.shadows[25] : 0,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center"
		},
		overlay: {
			position: "absolute",
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			backgroundColor: theme.palette.overlay
		},
		loading: {
			position: "absolute",
			width: "100%",
			height: "100%",
			top: 0,
			left: 0
		},
		comingSoon: {
			width: 160,
			height: "auto"
		}
	}
})

export default function PoolCard({
	id,
	icon,
	name,
	totalStakedADX,
	percentageFilledPool,
	totalStakedUSD,
	currentAPY,
	weeklyYield,
	weeklyYieldInfo,
	onStakeBtnClick,
	onWithdrawAllBtnClick,
	onClaimRewardsBtnClick,
	loading,
	disabled,
	disabledInfo,
	lockupPeriodTitle,
	lockupPeriodInfo,
	lockupPeriod,
	loaded,
	actions,
	comingSoon,
	actionBtn,
	actionBtnWithdraw,
	actionBtnClaimRewards,
	totalStakedADXuser,
	totalStakedUSDUser,
	totalRewardsUsd,
	endStakingDate,
	UserEndStakeLock,
	startStakingDate,
	totalCurrentPendingRewards,
	extraData = [],
	statsPath
}) {
	const { t } = useTranslation()
	const classes = useStyles()
	const temporarydisable = true
	return (
		<Box
			bgcolor={"background.card"}
			p={3}
			my={3}
			mx={1.5}
			pt={7}
			width={270}
			maxWidth="100%"
			minHeight={420}
			display="flex"
			flexDirection="column"
			alignItems="center"
			boxShadow={25}
			position="relative"
		>
			<Box mb={3} style={{ textAlign: "center", color: "rgb(230, 121, 27)" }}>
				<span style={{ textAlign: "center" }}>Pool</span>
				<Typography align="center" variant="h5" color="textPrimary">
					{name}
				</Typography>
			</Box>

			{comingSoon ? (
				<Box>
					<SvgIcon className={classes.comingSoon} color="primary">
						<ComingSoonImg
							width="100%"
							height="100%"
							// width={160}
						/>
					</SvgIcon>
				</Box>
			) : (
				<>
					<Box>
						{" "}
						<CardRow
							color="text.main"
							fontWeight={"fontWeightRegular"}
							fontSize={14}
							text={
								percentageFilledPool
									? percentageFilledPool + "% Filled"
									: 0 + "% Filled"
							}
							// infoText={t('common.totalStaked')}
							justify="center"
						/>{" "}
						<LinearProgress
							variant="buffer"
							value={
								percentageFilledPool
									? percentageFilledPool + "% Filled"
									: 0 + "% Filled"
							}
							valueBuffer={100}
						/>
						<p>
							<p></p>
						</p>
						<CardRow
							color="text.main"
							fontWeight={"fontWeightRegular"}
							fontSize={14}
							text={t("common.totalStaked")}
							// infoText={t('common.totalStaked')}
							justify="center"
						/>
						<CardRow
							color="special.main"
							fontWeight={"fontWeightBold"}
							fontSize={20}
							text={totalStakedADX}
							isAmountText
							// infoText={totalStakedADX}
							justify="center"
						/>
						<CardRow
							color="text.primary"
							fontWeight={"fontWeightBold"}
							fontSize={14}
							text={totalStakedUSD}
							isAmountText
							// infoText={totalStakedADX}
							justify="center"
							mb={3}
						/>
						<CardRow
							color="text.primary"
							fontWeight={"fontWeightRegular"}
							fontSize={14}
							text={t("pools.currentAPYLabel")}
							// infoText={"Current annual yield (APY)"}
							justify="center"
						/>
						<CardRow
							color="special.main"
							fontWeight={"fontWeightBold"}
							fontSize={20}
							text={currentAPY}
							isAmountText
							// infoText={currentAPY}
							justify="center"
						/>
						<CardRow
							color="text.main"
							fontWeight={"fontWeightBold"}
							fontSize={14}
							text={t("pools.weeklyYield", { yield: weeklyYield })}
							infoText={weeklyYieldInfo}
							justify="center"
							mb={3}
						/>
						<CardRow
							color="text.main"
							fontWeight={"fontWeightRegular"}
							fontSize={14}
							text={lockupPeriodTitle}
							infoText="This pool has a lock of the user $CRUX staked."
							// infoText={"Current annual yield (APY)"}
							justify="center"
						/>
						<CardRow
							color="text.primary"
							fontWeight={"fontWeightRegular"}
							fontSize={14}
							text={lockupPeriod}
							// infoText={"Current annual yield (APY)"}
							justify="center"
							mb={3}
						/>{" "}
						{!temporarydisable ? (
							<>
								<CardRow
									color="text.main"
									fontWeight={"fontWeightRegular"}
									fontSize={14}
									text="Pool Started on"
									infoText="Pool openned for the first time on the date presented."
									// infoText={"Current annual yield (APY)"}
									justify="center"
								/>
								<CardRow
									color="text.primary"
									fontWeight={"fontWeightBold"}
									fontSize={14}
									text={`${new moment.unix(startStakingDate).format(
										"DD-MM-YYYY h:mm A"
									)}`}
									isAmountText
									// infoText={totalStakedADX}
									justify="center"
									mb={3}
								/>
								<CardRow
									color="text.main"
									fontWeight={"fontWeightRegular"}
									fontSize={14}
									text="Pool Ends on"
									infoText="Pool closes on the date presented."
									// infoText={"Current annual yield (APY)"}
									justify="center"
								/>
								<CardRow
									color="text.primary"
									fontWeight={"fontWeightBold"}
									fontSize={14}
									text={`${new moment.unix(endStakingDate).format(
										"DD-MM-YYYY h:mm A"
									)}`}
									isAmountText
									// infoText={totalStakedADX}
									justify="center"
									mb={3}
								/>
								{extraData.map(data => (
									<Fragment key={data.id}>
										<CardRow
											color="text.main"
											fontWeight={"fontWeightRegular"}
											fontSize={14}
											text={data.title}
											infoText={data.titleInfo}
											justify="center"
										/>

										{data.importantValue && (
											<CardRow
												color="special.main"
												fontWeight={"fontWeightBold"}
												fontSize={20}
												text={data.importantValue}
												isAmountText
												infoText={data.valueInfo}
												justify="center"
											/>
										)}

										{data.normalValue && (
											<CardRow
												color="text.primary"
												fontWeight={"fontWeightRegular"}
												fontSize={14}
												text={data.normalValue}
												infoText={data.valueInfo}
												justify="center"
												mb={3}
											/>
										)}

										{data.extra && (
											<CardRow
												color="text.primary"
												fontWeight={"fontWeightRegular"}
												fontSize={14}
												text={data.extra}
												infoText={data.extrInfo}
												justify="center"
												mb={3}
											/>
										)}
									</Fragment>
								))}{" "}
							</>
						) : (
							<></>
						)}
						{!!statsPath && (
							<Box mb={2}>
								<ButtonWithLink
									fullWidth
									color="default"
									to={statsPath}
									startIcon={
										<SvgIcon fontSize="inherit" color="inherit">
											<StatsIcon width="100%" height="100%" />
										</SvgIcon>
									}
								>
									{t("common.poolStats")}
								</ButtonWithLink>
							</Box>
						)}
						
						{!temporarydisable ? (
							<>
						<Tooltip title={disabled ? disabledInfo : ""}>
							<div>
								{actionBtn || (
									<Button
										id={`stake-pool-${id}`}
										fullWidth
										variant="contained"
										disableElevation
										color="secondary"
										size="large"
										onClick={onStakeBtnClick}
										disabled={disabled}
									>
										{t("common.stake")}
									</Button>
								)}
							</div>
						</Tooltip>
						<p></p>
						{totalStakedUSDUser > 0 && (
							<>
								<p
									style={{ width: "100%", height: "2px", marginBottom: "10px" }}
								></p>
								<p></p>
								<div style={{ width: "100%", textAlign: "center" }}>
									<GiftIcon
										style={{ width: "100%", color: "#4BB543", fill: "#4BB543" }}
									/>
								</div>
								<CardRow
									color="text.main"
									fontWeight={"fontWeightRegular"}
									fontSize={14}
									text="Your Stake"
									// infoText={t('common.totalStaked')}
									justify="center"
								/>

								<CardRow
									color="special.main"
									fontWeight={"fontWeightBold"}
									fontSize={20}
									text={totalStakedADXuser}
									isAmountText
									// infoText={totalStakedADX}
									justify="center"
								/>
								<CardRow
									color="text.primary"
									fontWeight={"fontWeightBold"}
									fontSize={14}
									text={totalStakedUSDUser}
									isAmountText
									// infoText={totalStakedADX}
									justify="center"
									mb={0}
								/>
								<CardRow
									color="text.primary"
									fontWeight={"fontWeightBold"}
									fontSize={14}
									text={"( Excluding Rewards )"}
									isAmountText
									// infoText={totalStakedADX}
									justify="center"
									mb={3}
								/>
								{new moment.unix(UserEndStakeLock) > Date.now() && (
									<>
										<CardRow
											color="text.main"
											fontWeight={"fontWeightRegular"}
											fontSize={14}
											text="Locked Until"
											// infoText={t('common.totalStaked')}
											justify="center"
										/>
										<CardRow
											color="text.primary"
											fontWeight={"fontWeightBold"}
											fontSize={14}
											text={`${
												UserEndStakeLock && UserEndStakeLock > 0
													? new moment.unix(UserEndStakeLock).format(
															"DD-MM-YYYY h:mm A"
													  )
													: "Data not loaded"
											}`}
											isAmountText
											// infoText={totalStakedADX}
											justify="center"
											mb={3}
										/>

										<p></p>
									</>
								)}

								{new moment.unix(endStakingDate) < Date.now() && (
									<>
										<div style={{ textAlign: "center !important" }}>
											<p style={{ textAlign: "center", color: "#4BB543" }}>
												Your Staked $CRUX is now unlocked.
											</p>
											{actionBtnWithdraw || (
												<Button
													id={`stake-pool-${id}`}
													fullWidth
													variant="contained"
													disableElevation
													color="secondary"
													size="large"
													onClick={onWithdrawAllBtnClick}
													disabled={disabled}
												>
													WITHDRAW ALL
												</Button>
											)}
										</div>
										<p></p>
									</>
								)}
								<CardRow
									color="text.main"
									fontWeight={"fontWeightRegular"}
									fontSize={14}
									text="Current Rewards"
									// infoText={t('common.totalStaked')}
									justify="center"
								/>

								<CardRow
									color="special.main"
									fontWeight={"fontWeightBold"}
									fontSize={20}
									text={totalCurrentPendingRewards}
									isAmountText
									// infoText={totalStakedADX}
									justify="center"
								/>

								<CardRow
									color="text.primary"
									fontWeight={"fontWeightBold"}
									fontSize={14}
									text={totalRewardsUsd}
									isAmountText
									// infoText={totalStakedADX}
									justify="center"
									mb={3}
								/>

								<p></p>
								<div>
									{actionBtnClaimRewards || (
										<Button
											id={`stake-pool-${id}`}
											fullWidth
											variant="contained"
											disableElevation
											color="secondary"
											size="large"
											onClick={onWithdrawAllBtnClick}
										>
											Claim Rewards
										</Button>
									)}
								</div>
							</>
						)}
						</>) : <><div style={{width:'100%', fontWeight:'bold',textAlign:'center'}}><h2 style={{fontWeight:'800', color:'yellow'}}>Live 28th June</h2></div></>}
					</Box>
				</>
			)}

			{!!loading && (
				<Box
					classes={{ root: classes.overlay }}
					display="flex"
					flexDirection="column"
					alignItems="center"
					justifyContent="center"
				>
					<Typography align="center" component="div" variant="h3"></Typography>
				</Box>
			)}

			<Box classes={{ root: classes.iconBox }}>
				{icon || null}
				{!!loading && (
					<CircularProgress
						classes={{ root: classes.loading }}
						size={96}
						color="primary"
						thickness={2}
					/>
				)}
			</Box>
		</Box>
	)
}
