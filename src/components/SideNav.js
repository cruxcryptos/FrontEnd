import React, { useContext } from "react"
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Box,
	SvgIcon,
	CircularProgress,
	alpha
} from "@material-ui/core"
import ReactPlayer from "react-player/youtube"
import clsx from "clsx"
import Anchor from "./Anchor"
import logo from "./../resources/crux_ai.png"
import logoLight from "./../resources/crux_ai.png"
import { makeStyles } from "@material-ui/core/styles"
import { useLocation } from "react-router-dom"
import packageJson from "./../../package.json"
import { ADDR_ADX } from "./../helpers/constants"
import WithRouterLink from "./WithRouterLink"
import UserData from "./UserData"
import MigrationBtn from "./MigrationBtn"
import {
	HomeSharp as HomeIcon,
	DashboardSharp as DashboardIcon
} from "@material-ui/icons"
import { ReactComponent as StakingIcon } from "./../resources/link-ic.svg"
import { ReactComponent as GaslessIcon } from "./../resources/gasless-ic.svg"
import { ReactComponent as GiftIcon } from "./../resources/gift-ic.svg"
import { ReactComponent as StatsIcon } from "./../resources/stats-ic.svg"
import { ReactComponent as FarmIcon } from "./../resources/farm-icon.svg"
import { useTranslation } from "react-i18next"
// import { alpha } from "@material-ui/core/styles/colorManipulator"
import { MultiThemeContext } from "../MultiThemeProvider"

const RRListItem = WithRouterLink(ListItem)

const useStyles = makeStyles(theme => {
	const activeColor = theme.palette.text.primary
	const activeBgColor = theme.palette.background.active

	return {
		sntPadding: {
			paddingTop: 0
		},
		navListRoot: {
			color: theme.palette.text.secondary,
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between"
		},
		navList: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 100,
			overflowY: "auto",
			overflowX: "hidden"
		},
		sideNavToolbar: {},
		version: {
			position: "absolute",
			bottom: 0,
			left: 0,
			right: 0,
			padding: 10,
			paddingLeft: 16,
			borderTopWidth: 1,
			borderTopColor: theme.palette.divider,
			borderTopStyle: "solid"
		},
		listItem: {
			color: theme.palette.text.primary,
			"& .MuiListItemIcon-root": {
				color: theme.palette.text.primary // alpha(theme.palette.text.main, 0.69)
			}
		},
		active: {
			color: activeColor,
			backgroundColor: activeBgColor,
			"&:focus": {
				backgroundColor: activeBgColor
			},
			"&:hover": {
				backgroundColor: activeBgColor,
				color: activeColor,
				"& .MuiListItemIcon-root": {
					color: activeColor
				}
			},
			"& .MuiListItemIcon-root": {
				color: activeColor //theme.palette.text.main
			}
		},
		adxLink: {
			color: theme.palette.text.hint,
			"&:hover": {
				color: theme.palette.text.secondary
			}
		},
		sideSwitch: {
			marginBottom: `${theme.spacing(2)}px`
		},
		icon: {
			height: 32,
			width: "auto",
			cursor: "pointer"
		},
		amount: {
			fontSize: theme.typography.pxToRem(18)
		},
		overlay: {
			position: "absolute",
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "transparent",
			textTransform: "uppercase"
		},
		loading: {
			backgroundColor: alpha(theme.palette.background.darkerPaper, 0.2)
		},
		noUserData: {
			opacity: 0.23
		}
	}
})

function SideNav({
	prices,
	stats,
	onRequestUnbond,
	onUnbond,
	onClaimRewards,
	setConnectWallet,
	updatingStats,
	chosenWalletType
}) {
	const { themeType } = useContext(MultiThemeContext)
	const { t } = useTranslation()
	const classes = useStyles()
	const location = useLocation()
	const path = location.pathname

	return (
		<Box
			position="relative"
			display="flex"
			flexDirection="column"
			justifyContent="space-between"
			flexGrow="1"
		>
			<Box>
				<Box>
					<Box>
						<ListItem>
							<Box
								mb={1}
								display="flex"
								flexDirection="row"
								alignItems="flex-start"
							>
								<img
									width="220px"
									src={themeType === "dark" ? logo : logoLight}
									alt="adex-staking-logo"
								></img>
							</Box>
						</ListItem>

						<Box position="relative">
							<ListItem
								className={clsx({
									[classes.noUserData]: !stats.connectedWalletAddress
								})}
							>
								<Box width={1}>
									{UserData({
										prices,
										stats,
										onRequestUnbond,
										onUnbond,
										onClaimRewards
									})}

									{path !== "/stakings" && (
										<Box>
											<MigrationBtn />
										</Box>
									)}
								</Box>
							</ListItem>
							<Divider />

							{updatingStats && (
								<Box
									id="side-nav-connect-wallet-overlay-loading"
									className={clsx(classes.overlay, classes.loading)}
									display="flex"
									flexDirection="column"
									alignItems="center"
									justifyContent="center"
									color="secondary.main"
									fontSize="h1.fontSize"
									textAlign="center"
								>
									<CircularProgress size="100px" />
								</Box>
							)}

							{!chosenWalletType.name && !updatingStats && (
								<Box
									id="side-nav-connect-wallet-overlay"
									className={classes.overlay}
									display="flex"
									flexDirection="column"
									alignItems="center"
									justifyContent="center"
									color="secondary.main"
									fontSize="h1.fontSize"
									textAlign="center"
									onClick={() => setConnectWallet(true)}
									style={{ cursor: "pointer" }}
								>
									{t("common.connectWallet")}
								</Box>
							)}
						</Box>
					</Box>
				</Box>
			</Box>

			<Box
				display="flex"
				flexDirection="column"
				justifyContent="space-between"
				flex="1"
			>
				<Box>
					<List>
						<RRListItem
							id="side-nav-link-pools"
							button
							to={{ pathname: "/" }}
							className={clsx(classes.listItem, {
								[classes.active]: path === "/"
							})}
						>
							<ListItemIcon color="inherit">
								<DashboardIcon />
							</ListItemIcon>
							<ListItemText primary={t("common.pools")} />
						</RRListItem>
						{/* 						<RRListItem
							id="side-nav-link-farm"
							button
							to={{ pathname: "/farm" }}
							className={clsx(classes.listItem, {
								[classes.active]: path === "/farm"
							})}
						>
							<ListItemIcon color="inherit">
								<SvgIcon color="inherit">
									<FarmIcon width="100%" height="100%" />
								</SvgIcon>
							</ListItemIcon>
							<ListItemText primary={t("common.farm")} />
						</RRListItem> */}
						{/* 						<RRListItem
							id="side-nav-link-stats"
							button
							to={{ pathname: "/stats" }}
							className={clsx(classes.listItem, {
								[classes.active]: path === "/stats"
							})}
						>
							<ListItemIcon color="inherit">
								<SvgIcon color="inherit">
									<StatsIcon width="100%" height="100%" />
								</SvgIcon>
							</ListItemIcon>
							<ListItemText primary={t("common.validatorStats")} />
						</RRListItem> */}
						{/* 						<RRListItem
							id="side-nav-link-gasless"
							button
							to={{ pathname: "/gasless" }}
							className={clsx(classes.listItem, {
								[classes.active]: path === "/gasless"
							})}
						>
							<ListItemIcon color="inherit">
								<SvgIcon color="inherit">
									<GaslessIcon width="100%" height="100%" />
								</SvgIcon>
							</ListItemIcon>
							<ListItemText primary={t("common.gaslessStaking")} />
						</RRListItem> */}
					</List>
					<Box style={{padding:'2px'}}>
						<p></p>
						<h3 style={{marginLeft:'6px'}}>$CRUX Gameplay and Demo is now available through our website.</h3>
						<ReactPlayer
							width="100%"
							playing={true}
							volume={0}
							loop={true}
							muted={true}
							height="100%"
							url="hhttps://www.youtube.com/watch?v=yKlM2DZaG1I"
						/>
					</Box>
				</Box>
				<Box>
					<RRListItem
						id="side-nav-link-staking-landing-page"
						button
						className={clsx(classes.listItem)}
						onClick={() =>
							window.open(
								"https://cruxcryptos.com/",
								"_blank",
								"noopener,noreferrer"
							)
						}
					>
						<ListItemIcon color="inherit">
							<SvgIcon color="inherit">
								<HomeIcon color="inherit" />
							</SvgIcon>
						</ListItemIcon>
						<ListItemText primary={t("common.homePageAndCalculator")} />
					</RRListItem>
					<Divider />
					<ListItem>
						<Box>
							<div>
								<small>
									<Anchor
										id="external-link-crux-network"
										target="_blank"
										href={`https://cruxcryptos.com/`}
									>
										{t("company.copy", { year: new Date().getFullYear() })}
									</Anchor>
								</small>
							</div>
							<div>
								<small>
									<Anchor
										id="external-link-crux-token"
										target="_blank"
										href={`https://bscscan.com/address/0xd641156213ad80a007993a1d9ce80085414cff39`}
									>
										{t("company.adxToken")}
									</Anchor>
								</small>
							</div>
							<div>
								<small>
									<Anchor
										id="external-link-crux-staking-overview"
										target="_blank"
										href="https://cruxcryptos.com/"
									>
										{t("company.version", { version: packageJson.version })}
									</Anchor>
								</small>
							</div>
						</Box>
					</ListItem>
				</Box>
			</Box>
		</Box>
	)
}

export default SideNav
