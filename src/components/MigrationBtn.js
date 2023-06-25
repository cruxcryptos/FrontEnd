import React, { useContext } from "react"
import { Button, Fab } from "@material-ui/core"

import WithRouterLink from "./WithRouterLink"
import { useTranslation } from "react-i18next"
import WithDialog from "./WithDialog"
import MigrationForm from "./MigrationForm"
import AppContext from "../AppContext"
import { ZERO } from "../helpers/constants"
import { getPool } from "../helpers/bonds"

const MigrationDialog = WithDialog(MigrationForm)

const RRButton = WithRouterLink(Button)
const RRFab = WithRouterLink(Fab)

export default function MigrationBtn({ onBeforeOpen, fabButton, color, size }) {
	const { t } = useTranslation()
	const { stats } = useContext(AppContext)

	

		return ("")
}
