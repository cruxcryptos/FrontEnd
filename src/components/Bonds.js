import React from "react"
import {
	TableRow,
	TableCell,
	Box,
	Table,
	TableContainer,
	TableHead,
	TableBody
} from "@material-ui/core"
import { formatADXPretty, formatDate } from "../helpers/formatting"
import { AmountText } from "./cardCommon"
import { useTranslation } from "react-i18next"
import { getPool, getBondId } from "../helpers/bonds"

import WithDialog from "./WithDialog"
import MigrationForm from "./MigrationForm"

const MigrationDialog = WithDialog(MigrationForm)

export default function Bonds({ stats }) {
	const { t } = useTranslation()
	// Render all stats cards + bond table
	const bondStatus = bond => {
		if (bond.status === "UnbondRequested") {
			const willUnlock = bond.willUnlock.getTime()
			const now = Date.now()
			if (willUnlock > now) {
				const days = Math.ceil((willUnlock - now) / 86400000)
				return t("bonds.canUnbondIn", { count: days })
			} else {
				return t("bonds.canUnbond")
			}
		}
		if (bond.status === "Active") {
			return `Active, earning ${(stats.tomPoolStats.totalAPY * 100).toFixed(
				2
			)}% APY`
		}
		return bond.status
	}

	return ""
}
