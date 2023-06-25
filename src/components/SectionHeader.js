import React, { useContext } from "react"
import AppContext from "../AppContext"
import { makeStyles } from "@material-ui/core/styles"
import { Box, Typography } from "@material-ui/core"
import { AddSharp as AddIcon } from "@material-ui/icons"
import { toIdAttributeString } from "../helpers/formatting"
import { useTranslation } from "react-i18next"
import WithDialog from "./WithDialog"
import DepositForm from "./DepositForm"
import { DEPOSIT_POOLS } from "../helpers/constants"
import { DEPOSIT_ACTION_TYPES } from "../actions"
import { PRIMARY, SECONDARY } from "themeMUi"

const DepositsDialog = WithDialog(DepositForm)

const useStyles = makeStyles(theme => ({
	fabIcon: {
		marginRight: theme.spacing(1)
	}
}))

const SectionHeader = ({ title, actions }) => {
	const { t } = useTranslation()
	const classes = useStyles()

	const { stats, chosenWalletType } = useContext(AppContext)
	const canStake = !!chosenWalletType.name && !!stats.connectedWalletAddress

	return (
		<Box
			display="flex"
			flexDirection="row"
			justifyContent="space-between"
			alignItems="center"
			flexWrap="wrap"
		>
			<Box color="text.main" mb={1}>
				<Typography variant="h3" style={{ wordBreak: "break-word" }}>
					$CRUX STAKING POOLS
				</Typography>
				<p></p>
				<span style={{ color: "#fff", fontSize:'20px' }}>
					Stake your CRUX and win even more CRUX.
				</span>
				<br></br>
				<span style={{ color: "#fff", fontSize:'20px' }}>
					Crux pools have a limited capacity for accepting deposits. Once the
					maximum deposit amount is reached, the pools will remain operational
					exclusively for those who have successfully contributed.
				</span>
				<p></p>
			</Box>
		</Box>
	)
}

export default SectionHeader
