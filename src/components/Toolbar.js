import React from "react"
import PropTypes from "prop-types"
import {
	AppBar,
	Toolbar,
	IconButton,
	Box,
	Hidden,
	Button
} from "@material-ui/core"
import { MenuSharp as MenuIcon } from "@material-ui/icons"
import { Help } from "./HelperMenu"
import { Wallet } from "./WalletMenu"
import LangSelect from "./LangSelect"
import ThemeSwitch from "./ThemeSwitch"
import { styles } from "./rootStyles"
import { makeStyles } from "@material-ui/core/styles"
import blue from "@material-ui/core/colors/blue"

const useStyles = makeStyles(styles)

const corAzul = blue["A500"]

export const AppToolbar = ({ handleDrawerToggle }) => {
	const classes = useStyles()

	return (
		<AppBar elevation={0} color="transparent" position="static">
			<Toolbar className={classes.toolbar}>
				<Hidden mdUp>
					<Box>
						<IconButton
							id="mobile-burger-btn"
							color="secondary"
							aria-label="open drawer"
							onClick={handleDrawerToggle}
						>
							<MenuIcon />
						</IconButton>
					</Box>
				</Hidden>
				<Hidden mdDown>
					<Box
						className={classes.toolbarActions}
						flex="1"
						display="flex"
						flexDirection="row"
						alignItems="center"
						justifyContent="flex-end"
						flexWrap="wrap"
					>
						{/* <Box mr={2}>
						<LangSelect />
					</Box> */}
						<Box mr={2}>
							{" "}
							<a
								rel="noopener noreferrer"
								href="https://t.me/CRUX_CRYPTOS"
								target="_blank"
							>
								<Button
									type="submit"
									id={`sign-up-email`}
									className={"telegrambutton"}
									variant="contained"
								>
									Join our telegram
								</Button>
							</a>
						</Box>
						<Box mr={2}>
							<a
								rel="noopener noreferrer"
								href="https://cruxcryptos.com/"
								target="_blank"
							>
								<Button>Visit Crux</Button>
							</a>
						</Box>
						<Box mr={2}>
							<a
								rel="noopener noreferrer"
								href="https://pancakeswap.finance/swap?outputCurrency=0xD641156213ad80A007993a1D9cE80085414CFF39"
								target="_blank"
							>
								<Button>BUY $CRUX</Button>
							</a>
						</Box>
						<Box mr={2}>
							<Help />
						</Box>
						<Box>
							<Wallet />
						</Box>
					</Box>
				</Hidden>
				<Hidden mdUp>
					<div
						style={{
							right: 0,
							position: "absolute"
						}}
					>
						<Wallet />
					</div>
				</Hidden>
			</Toolbar>
		</AppBar>
	)
}

AppToolbar.propTypes = {
	handleDrawerToggle: PropTypes.func.isRequired
}
