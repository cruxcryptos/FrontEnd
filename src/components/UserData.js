import React, { useContext, useState } from "react"
import { Box, Typography, Button } from "@material-ui/core"
import StatsCard from "./StatsCard"
import { formatADXPretty, getADXInUSDFormatted } from "../helpers/formatting"
import { useTranslation } from "react-i18next"
import { BigNumber } from "ethers"
import ConfirmationDialog from "./ConfirmationDialog"
import AppContext from "../AppContext"
import { ZERO } from "./../helpers/constants"
import { identityWithdraw } from "../actions"

export default function UserData({ stats, prices }) {
	const { t } = useTranslation()
	const [withdrawIdentityOpen, setWithdrawIdentityOpen] = useState(false)
	const { chosenWalletType, wrapDoingTxns } = useContext(AppContext)
	const hasLegacyIdentityBalance =
		stats.identityDeployed && stats.userIdentityBalance.gt(ZERO)

	const onWithdraw = async () => {
		await wrapDoingTxns(identityWithdraw.bind(null, chosenWalletType))()
	}

	return (
		<Box width={1}>
			<Box mb={1.5}>
				{StatsCard({
					size: "large",
					loaded: stats.loaded,
					title: t("userData.myAdxBalance"),
					subtitle: stats.totalBalanceADX
						? formatADXPretty(stats.totalBalanceADX) + " CRUX"
						: "",

					extra: getADXInUSDFormatted(prices, stats.totalBalanceADX),
					/*actions: (<Button
							size="small"
							variant="contained"
							color="secondary"
							disabled={true}
						>upgrade</Button>)*/
					extraInfo: t("userData.adxPrice", {
						priceUSD: getADXInUSDFormatted(
							prices,
							BigNumber.from((1e18).toString())
						)
					})
				})}
			</Box>

			<Box mb={1.5}>
				{StatsCard({
					loaded: stats.loaded,
					title: t("userData.onWallet"),
					titleInfo: [
						t("userData.userBalanceWallet", {
							amount: formatADXPretty(stats.userWalletBalance),
							currency: "CRUX"
						}),
						t("userData.userBalanceGasless", {
							amount: formatADXPretty(stats.gaslessAddrBalance),
							currency: "CRUX"
						}),
						...(hasLegacyIdentityBalance
							? [
									t("userData.activeDepositsLegacyIdentityBalance", {
										amount: formatADXPretty(stats.userIdentityBalance),
										currency: "CRUX"
									})
							  ]
							: [])
					],
					subtitle: stats.userBalance
						? formatADXPretty(stats.userBalance) + "  CRUX"
						: "",
					extra: getADXInUSDFormatted(prices, stats.userBalance)
				})}
			</Box>

			{/* <Box mb={1.5}>
				{StatsCard({
					loaded: stats.loaded,
					title: t("userData.activeStake"),
					titleInfo: t("userData.activeStakeInfo", {
						apy: (tomPoolStats.totalAPY * 100).toFixed(2)
					}),
					subtitle: formatADXPretty(stats.userTotalStake) + " ADX",
					extra: getADXInUSDFormatted(prices, stats.userTotalStake)
				})}
			</Box> */}

			<Box mb={1.5}>
				{StatsCard({
					loaded: stats.loaded,
					title: t("userData.totalStaked"),
					titleInfo: [
						t("userData.activeDepositsInfoLocked", {
							amount: formatADXPretty(stats.totalLockedOnDeposits),
							currency: "CRUX"
						}),
						t("userData.activeUsersStakeLegacy", {
							amount: formatADXPretty(stats.userTotalStake),
							currency: "CRUX"
						}),
						t("userData.activeDepositsInfoPendingToUnlock", {
							amount: formatADXPretty(stats.totalPendingToUnlock),
							currency: "CRUX"
						}),
						t("userData.activeDepositsInfoUnlocked", {
							amount: formatADXPretty(stats.totalUnlockedDeposits),
							currency: "CRUX"
						}),
						t("userData.activeDepositsInfoUnclaimed", {
							amount: formatADXPretty(stats.tomRewardADX),
							currency: "CRUX"
						})
					],
					subtitle: formatADXPretty(stats.totalStaked) + " CRUX",
					extra: getADXInUSDFormatted(prices, stats.totalStaked)
				})}
			</Box>

			{hasLegacyIdentityBalance && (
				<Box mb={1.5}>
					<Box display="inline-block">
						<Button
							id="btn-rewards-page-claim"
							variant="contained"
							color="secondary"
							onClick={() => setWithdrawIdentityOpen(true)}
						>
							{t("common.withdrawLegacy")}
						</Button>
					</Box>
				</Box>
			)}

			{ConfirmationDialog({
				isOpen: withdrawIdentityOpen,
				onDeny: () => setWithdrawIdentityOpen(false),
				onConfirm: () => {
					setWithdrawIdentityOpen(false)
					onWithdraw()
				},
				confirmActionName: t("common.withdraw"),
				content: (
					<>
						<Box mb={1}>
							<Typography>
								{t("dialogs.withdrawFromOldIdentity", {
									amount: formatADXPretty(stats.userIdentityBalance || ZERO),
									currency: "CRUX",
									walletAddr: stats.connectedWalletAddress
								})}
							</Typography>
						</Box>
					</>
				)
			})}
		</Box>
	)
}
