import React, { useContext } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
	TableRow,
	TableCell,
	Box,
	Table,
	TableContainer,
	TableHead,
	TableBody,
	SvgIcon
} from "@material-ui/core"
import {
	formatADXPretty,
	formatDateTime,
	formatTxnHash
} from "../helpers/formatting"
import AppContext from "../AppContext"
import { AmountText } from "./cardCommon"
import { useTranslation } from "react-i18next"
import { ExternalAnchor } from "./Anchor"
import { iconByPoolId } from "../helpers/constants"

const stakingPoolLabel = {
	"adex-loyalty-pool": "common.loPo",
	"adex-staking-pool": "common.tomStakingPool"
}

const useStyles = makeStyles(theme => {
	return {
		iconBox: {
			borderRadius: "100%",
			width: 42,
			height: 42,
			border:'1px solid red',
			overflow:'hidden',
			backgroundColor: theme.palette.common.white,
			color: theme.palette.common.black,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center"
		}
	}
})

const StakingEventRow = ({ stakingEvent }) => {
	const { t } = useTranslation()
	const classes = useStyles()
	const PoolIcon = iconByPoolId({
		poolId: stakingEvent.pool || "adex-staking-pool"
	})
	return ""
}

export default function StakingPoolTxnsHistory() {
	const { t } = useTranslation()
	const { stats } = useContext(AppContext)
	const { tomStakingV5PoolStats, loyaltyPoolStats, smallPoolStats, longPoolStats } = stats
	const { stakings: stakingPoolEvents } = tomStakingV5PoolStats
	const { stakingEvents: loyaltyPoolEvents } = loyaltyPoolStats
	const { stakingEventsSmall: smallPoolEvents } = smallPoolStats
	const { stakingEventsLong: LongPoolEvents } = longPoolStats

	const stakings = stakingPoolEvents
		.concat(loyaltyPoolEvents)
		.sort((a, b) => a.blockNumber - b.blockNumber)

	return (
		<Box>
			<Box>
				<TableContainer xs={12}>
					<Table aria-label="Bonds table">
						<TableHead>
							<TableRow>
								<TableCell>{t("common.pool")}</TableCell>
								<TableCell align="right">{t("deposits.eventType")}</TableCell>
								<TableCell align="right">{t("deposits.amount")}</TableCell>
								<TableCell align="right">{t("deposits.from")}</TableCell>
								<TableCell align="right">{t("deposits.extraInfo")}</TableCell>
								<TableCell align="right">{t("deposits.txnHash")}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{[...(stakings || [])].reverse().map((stakingEvent, i) => (
								<StakingEventRow
									key={stakingEvent.blockNumber + stakingEvent.type + i}
									stakingEvent={stakingEvent}
								/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Box>
	)
}
