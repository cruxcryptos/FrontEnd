import React, { useState, useContext, useEffect } from "react"
import { Switch, Route } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"
import {
	Drawer,
	Modal,
	Backdrop,
	Fade,
	Snackbar,
	useMediaQuery,
	Box,
	Button
} from "@material-ui/core"
import { Alert as MuiAlert, AlertTitle } from "@material-ui/lab"
import ChooseWallet from "./ChooseWallet"
import Stakings from "./Stakings"
import Gasless from "./Gasless"
import Rewards from "./Rewards"
import Farm from "./Farm"
import Stats from "./Stats"
import Pools from "./Pools"
import { MigrateNowPopup, MigrateNowAlert } from "./MigrateNowPopup"
import LegacyADXSwapDialog from "./LegacyADXSwapDialog"
import ConfirmationDialog from "./ConfirmationDialog"
import { AppToolbar } from "./Toolbar"
import SideNav from "./SideNav"
import {
	ZERO,
	UNBOND_DAYS,
	POOLS,
	REACT_APP_RPC_URL,
	IDLE_TIMEOUT_MINUTES
} from "../helpers/constants"
import {
	formatADXPretty,
	toIdAttributeString,
	formatAddress
} from "../helpers/formatting"
import { styles } from "./rootStyles"
import AppContext from "../AppContext"
import { ExternalAnchor } from "./Anchor"
import { createNewBond } from "../actions"
import { ShtarvolinkiSnack } from "./../Snack"
import clsx from "clsx"
import { useTranslation, Trans } from "react-i18next"
import cruxvideo from "./../components/CRUX_TEASE.mp4"
import imagemfundo from "./army.png"
import logonew from './../resources/crux_ai.png'

function Alert(props) {
	return <MuiAlert variant="filled" {...props} />
}

const useStyles = makeStyles(styles)
const STOP_LEGACY_SWAP_AFTER = new Date("2022-03-16T00:00:00Z").getTime()

export default function Root() {
	const { t } = useTranslation()
	const classes = useStyles()
	const [mobileOpen, setMobileOpen] = useState(false)
	const [showMobileWarning, setshowMobileWarning] = useState(false)
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}
	const isTempDrawer = useMediaQuery(theme => theme.breakpoints.down("sm"))

	const {
		isNewBondOpen,
		setNewBondOpen,
		toUnbond,
		setToUnbond,
		openErr,
		openDoingTx,
		snackbarErr,
		stats,
		connectWallet,
		setConnectWallet,
		chosenWalletType,
		wrapDoingTxns,
		onRequestUnbond,
		onUnbond,
		onClaimRewards,
		handleErrClose,
		getSigner,
		prices,
		onWalletTypeSelect,
		onConnectionDisconnect,
		snackHooks,
		chainWarning,
		newBondPool,
		setNewBondPool,
		legacySwapInPrg,
		setLegacySwapInPrg,
		legacySwapOpen,
		setLegacySwapInOpen,
		idlePopupOpen,
		onIdleDialogAction,
		// secondsToAutoRefresh,
		account,
		updatingStats
	} = useContext(AppContext)

	const drawer = SideNav({
		prices,
		stats,
		onRequestUnbond: setToUnbond,
		onUnbond,
		onClaimRewards,
		setConnectWallet,
		updatingStats,
		chosenWalletType
	})

	let mobile = false
	if (window.innerWidth <= 800) {
		mobile = true
	}

	const container = window !== undefined ? document.body : undefined

	return mobile ? (
		<>
			<div className={classes.root} style={{textAlign:'center'}}>
				<img src={logonew} alt='crux_logo'/>
				<h1 style={{marginTop:'10%', textAlign:'center'}}>CRUX STAKING</h1>
				<div style={{ width: "100% !important", textAlign:'center' }}>
					<p> <strong>CRUX DAPP for staking is only available through Laptop/Desktop.</strong> </p>
				</div>
				<p>Alternately, check our main website</p>
				<a href="https://cruxcryptos.com" style={{color:'green', fontWeight:'800'}}>cruxcryptos.com </a>
			</div>
		</>
	) : (
		<>
			<div className={classes.root}>
				<AppToolbar
					chosenWalletType={chosenWalletType}
					setConnectWallet={setConnectWallet}
					onConnectionDisconnect={onConnectionDisconnect}
					setNewBondOpen={setNewBondOpen}
					handleDrawerToggle={handleDrawerToggle}
					stats={stats}
				/>

				<nav aria-label="side navigation">
					<Drawer
						container={container}
						variant={isTempDrawer ? "temporary" : "permanent"}
						anchor="left"
						open={isTempDrawer ? mobileOpen : true}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper
						}}
						ModalProps={{
							keepMounted: true // Better open performance on mobile.
						}}
					>
						{drawer}
					</Drawer>
				</nav>
				{/* 
			<div style={{maxWidth:'100%', border:'1px solid red', marginLeft:'20px'}}>
				<video
					autoPlay
					loop
					muted
					style={{
						width: "50%",
						border: "1px solid red !important",
						margin: "0",
						padding: "0"
					}}
				>
					<source src={cruxvideo} type="video/mp4" />
				</video>
			</div> */}
				<main className={classes.content} id="rootclassyc">
					<div className={classes.contentInner}>
						<Box mb={2} className={classes.stickyAlerts}>
							{stats.hasPendingTransactions && (
								<Box mt={2}>
									<Alert severity="warning" variant="filled">
										<AlertTitle id="alert-pending-transactions-warning-title">
											{t("messages.pendingTransactionsTitle")}
										</AlertTitle>
										<Box>
											<Trans
												i18nKey="messages.pendingTransactionsInfo1"
												values={{
													account: formatAddress(account)
												}}
												components={{
													external: (
														<ExternalAnchor
															id="external-link-adex-token"
															target="_blank"
															href={`https://etherscan.io/address/${account}`}
															color="textPrimary"
														></ExternalAnchor>
													)
												}}
											/>
										</Box>
										<Box>
											<Trans i18nKey="messages.pendingTransactionsInfo2" />
										</Box>
									</Alert>
								</Box>
							)}
						</Box>
						<MigrateNowAlert />

						<Switch>
							<Route path="/stakings">
								<Stakings />
							</Route>
							<Route path="/gasless">
								<Gasless />
							</Route>
							<Route path="/rewards">
								<Rewards />
							</Route>
							<Route path="/farm">
								<Farm />
							</Route>
							<Route path="/stats">
								<Stats />
							</Route>
							<Route path="/">
								<Pools />
							</Route>
						</Switch>

						{// Load stats first to prevent simultanious calls to getSigner
						Date.now() < STOP_LEGACY_SWAP_AFTER &&
							LegacyADXSwapDialog(
								stats.loaded ? getSigner : null,
								wrapDoingTxns,
								chosenWalletType,
								legacySwapInPrg,
								setLegacySwapInPrg,
								legacySwapOpen,
								setLegacySwapInOpen
							)}

						{ConfirmationDialog({
							isOpen: !!toUnbond,
							onDeny: () => setToUnbond(null),
							onConfirm: () => {
								if (toUnbond) onRequestUnbond(toUnbond)
								setToUnbond(null)
							},
							confirmActionName: t("common.unbond"),
							content: (
								<Trans
									i18nKey="dialogs.bondToV5MigrationConfirmation"
									values={{
										amount: formatADXPretty(
											toUnbond ? toUnbond.currentAmount : ZERO
										),
										currency: "CRUX",
										unbondDays: UNBOND_DAYS
									}}
									components={{
										box: <Box mb={2}></Box>,
										ol: <ol></ol>,
										li: <li></li>
									}}
								/>
							)
						})}

						{ChooseWallet({
							open: !!connectWallet,
							handleClose: () => {
								setConnectWallet(null)
							},
							handleListItemClick: onWalletTypeSelect,
							disableNonBrowserWallets: !REACT_APP_RPC_URL
						})}

						<Snackbar
							open={openErr}
							autoHideDuration={10000}
							onClose={handleErrClose}
						>
							<Alert
								id={`err-aler-${toIdAttributeString(snackbarErr)}`}
								onClose={handleErrClose}
								severity="error"
							>
								{t(
									snackbarErr.msg || snackbarErr,
									Object.entries(snackbarErr.opts || {}).reduce(
										(opts, [key, value]) => {
											opts[key] = t(value)
											return opts
										},
										{}
									)
								)}
							</Alert>
						</Snackbar>
						<ShtarvolinkiSnack {...snackHooks} />

						<Modal
							open={chainWarning}
							aria-labelledby="alert-chain-warning-title"
							aria-describedby="alert-chain-description"
							BackdropComponent={Backdrop}
							className={clsx(classes.modal, classes.alwaysOnTop)}
						>
							<Fade in={chainWarning}>
								<Box>
									<Alert severity="warning">
										<AlertTitle id="alert-chain-warning-title">
											{t("messages.unsupportedEthNetwork")}
										</AlertTitle>
										<Box id="alert-chain-description">
											{t("messages.connectToMainnet")}
										</Box>
										<Box
											id="alert-chain-disconnect"
											mt={1}
											alignItems="center"
											display="flex"
											flexDirection="column"
										>
											<Box mb={1}>or</Box>
											<Button
												size="small"
												variant="contained"
												onClick={onConnectionDisconnect}
											>
												Disconnect current wallet
											</Button>
										</Box>
									</Alert>
								</Box>
							</Fade>
						</Modal>
						<Modal
							open={idlePopupOpen}
							aria-labelledby="alert-user-idle-title"
							aria-describedby="alert-user-idle-description"
							BackdropComponent={Backdrop}
							className={clsx(classes.modal, classes.alwaysOnTop)}
						>
							<Fade in={idlePopupOpen}>
								<Box>
									<Alert
										severity="info"
										action={
											<Button
												variant="contained"
												color="secondary"
												onClick={onIdleDialogAction}
											>
												{t("messages.continueSession")}
											</Button>
										}
									>
										{t("messages.useIdleTitle", {
											minutes: IDLE_TIMEOUT_MINUTES
										})}
									</Alert>
								</Box>
							</Fade>
						</Modal>
						<Modal
							open={openDoingTx}
							aria-labelledby="info-doingTx"
							BackdropComponent={Backdrop}
							closeAfterTransition
							className={clsx(classes.modal)}
						>
							<Fade in={openDoingTx}>
								<Box>
									<Alert severity="info">
										<Box id="info-doingTx" p={2}>
											{t("messages.signAllTransactions", {
												wallet: chosenWalletType.name || ""
											})}
										</Box>
									</Alert>
								</Box>
							</Fade>
						</Modal>
					</div>
				</main>
			</div>
		</>
	)
}
