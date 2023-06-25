import React, { useState } from "react"
import { Button, Menu, Link, MenuItem } from "@material-ui/core"
import HelpIcon from "@material-ui/icons/HelpOutline"
import { useTranslation } from "react-i18next"

export const Help = () => {
	const { t } = useTranslation()
	const [menuEl, setMenuEl] = useState(null)
	const openHelpMenu = ev => {
		setMenuEl(ev.currentTarget)
	}
	const closeHelpMenu = () => {
		setMenuEl(null)
	}
	return (
		<>
			<Button
				id="help-menu-btn"
				size="large"
				startIcon={<HelpIcon size="large" />}
				onClick={openHelpMenu}
			>
				{t("help.help")}
			</Button>
			<Menu
				id="help-menu-menu"
				anchorEl={menuEl}
				open={Boolean(menuEl)}
				keepMounted
				onClose={closeHelpMenu}
				getContentAnchorEl={null}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				transformOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Link
					id="help-menu-external-link-adex-network-tos"
					color="inherit"
					href="https://crux-mmorpg.gitbook.io/crux/usdcrux-coin/staking"
					target="_blank"
				>
					<MenuItem onClick={closeHelpMenu}>WHAT IS STAKING?</MenuItem>
				</Link>
				<Link
					id="help-menu-external-link-adex-network-staking-user-guide"
					color="inherit"
					href="https://pancakeswap.finance/swap?outputCurrency=0xD641156213ad80A007993a1D9cE80085414CFF39"
					target="_blank"
				>
					<MenuItem onClick={closeHelpMenu}>BUY CRUX - 9% SLIPPAGE</MenuItem>
				</Link>
				<Link
					id="help-menu-external-link-adex-network-staking-source-code"
					color="inherit"
					href="https://twitter.com/CRUX_CRYPTOS"
					target="_blank"
				>
					<MenuItem onClick={closeHelpMenu}>TWITTER</MenuItem>
				</Link>
				<Link
					id="help-menu-external-link-adex-network-audits"
					color="inherit"
					href="https://t.me/CRUX_CRYPTOS"
					target="_blank"
				>
					<MenuItem onClick={closeHelpMenu}>TELEGRAM</MenuItem>
				</Link>
				<Link
					id="help-menu-external-link-adex-network-audits"
					color="inherit"
					href="https://cruxcryptos.com"
					target="_blank"
				>
					<MenuItem onClick={closeHelpMenu}>MAIN WEBSITE</MenuItem>
				</Link>
			</Menu>
		</>
	)
}
