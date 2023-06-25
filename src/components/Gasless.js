import React, { useContext, useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Box, SvgIcon, Typography, IconButton } from "@material-ui/core"
import {
	FileCopySharp as CopyIcon,
	HelpSharp as HelpIcon
} from "@material-ui/icons"
import copy from "copy-to-clipboard"
import { ReactComponent as GaslessIcon } from "./../resources/gasless-ic.svg"
import SectionHeader from "./SectionHeader"
import AppContext from "../AppContext"
import { getGaslessInfo } from "../actions"
import StatsCard from "./StatsCard"
import { formatADXPretty } from "../helpers/formatting"
import NewGaslessBondForm from "./NewGaslessBondForm"
import WithDialog from "./WithDialog"
import { ExternalAnchor } from "./Anchor"
import Tooltip from "./Tooltip"
import { useTranslation, Trans } from "react-i18next"

const GaslessDepositDialog = WithDialog(NewGaslessBondForm)

const useStyles = makeStyles(theme => {
	return {
		overlay: {
			position: "absolute",
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "transparent"
		},
		noUserData: {
			opacity: 0.23
		},
		address: {
			wordBreak: "break-all"
		},
		modal: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		bullets: {
			[theme.breakpoints.up("md")]: {
				maxWidth: 800
			}
		},
		actions: {
			maxWidth: 400,
			margin: theme.spacing(1)
		}
	}
})

const defaultGaslessInfo = {
	canExecuteGasless: false,
	canExecuteGaslessError: {
		message: "common.connectWallet"
	}
}

const Gasless = () => {
	
	

	return ""
}

export default Gasless
