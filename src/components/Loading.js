import React, { useContext } from "react"
import { LinearProgress, Box } from "@material-ui/core"
import logo from "../resources/staking-logo.svg"
import logoCRUX from "../resources/crux_ai.png"
import logoLight from "../resources/logo-light-theme.svg"
import { MultiThemeContext } from "../MultiThemeProvider"

export default function Loading() {
	const { themeType } = useContext(MultiThemeContext)

	return (
		<Box
			display="flex"
			width="100vw"
			height="100vh"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			<Box mb={1}>
				<img
					width="600px"
					src={logoCRUX}
					alt="crux-staking-logo"
				></img>
			</Box>
			<Box width={200} style={{textAlign:'center'}}>
				Loading DEX Stats...
				<LinearProgress color="secondary" />
			</Box>
		</Box>
	)
}
