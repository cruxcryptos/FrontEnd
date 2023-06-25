import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
	Box,
	Button,
	Checkbox,
	FormGroup,
	FormControl,
	FormControlLabel,
	TextField
} from "@material-ui/core"
import { CardRow } from "./cardCommon"
// import { ExternalAnchor } from "./Anchor"
import { ReactComponent as EmailAwardsIcon } from "./../resources/mail-awards.svg"
import { ReactComponent as StakingLogo } from "./../resources/staking-logo.svg"
import logo from "./../resources/imagery/logo_crux_200_200.png"
import { validateEmail } from "./../helpers/validation"
import {
	extractJSONResponseFromHTML,
	submitFormToMautic
} from "../mauticActions"
import { useTranslation, Trans } from "react-i18next"

const useStyles = makeStyles(theme => {
	return {
		iconBox: {
			borderRadius: "100%",
			position: "absolute",
			width: 160,
			height: 160,
			top: -theme.spacing(4),
			backgroundColor: "transparent",
			color: theme.palette.background.default,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center"
		},
		bold: {
			fontWeight: 800
		},
		singUp: {
			backgroundColor: theme.palette.text.main,
			borderRadius: 20
		},
		gdprCheckbox: ({ errors }) => ({
			fontSize: 10,
			color: errors.gdpr ? theme.palette.error.main : theme.palette.text.main
		}),
		tosCheckbox: ({ errors }) => ({
			fontSize: 10,
			color: errors.tos ? theme.palette.error.main : theme.palette.text.main
		})
	}
})

export default function EmailSignUp(props) {
	const { t } = useTranslation()

	const [email, setEmail] = useState("")
	const [mauticState, setMauticState] = useState({})
	const [waiting, setWaiting] = useState(false)
	const [gdpr, setGDPR] = useState(false)
	// const [tos, setTos] = useState(false)
	const [errors, setErrors] = useState({
		email: false,
		gdpr: false
		// tos: false
	})
	const classes = useStyles({ errors })

	useEffect(() => {
		// console.log(email, gdpr, errors)
	}, [email, gdpr, errors])

	const handleValidationErrors = () => {
		setErrors({
			email: !validateEmail(email),
			gdpr: !gdpr
			// tos: !tos
		})
	}

	const handleSubmitUrl = async () => {}

	const handleSubmit = async () => {
		handleValidationErrors()
		if (
			validateEmail(email) &&
			gdpr
			// && tos
		) {
			setWaiting(true)
			try {
				const HTMLResponse = await submitFormToMautic({ ...props, email })
				const jsonResponse = await extractJSONResponseFromHTML(HTMLResponse)
				setMauticState({
					...jsonResponse
				})
			} catch (error) {
				// If cors is not enabled for address
				console.error(error)
			}
		}
	}

	return (
		<>
			<Box
				bgcolor={"background.card"}
				style={{opacity:'0.9'}}
				p={3}
				my={3}
				mx={1.5}
				pt={15}
				width={270}
				maxWidth="100%"
				minHeight={420}
				display="flex"
				flexDirection="column"
				alignItems="center"
				boxShadow={25}
				position="relative"
			>
				{/* Used for debugging mautic responses */}
				{/* <Box>{JSON.stringify(mauticState)}</Box> */}
				<Box classes={{ root: classes.iconBox }}>
					<img
						src={logo}
						alt="crux_main_logo"
						style={{ width: "70%", marginTop: "40px" }}
					/>
				</Box>
				{mauticState.success ? (
					<CardRow
						mt={3}
						color="text.primary"
						fontWeight={"fontWeightBold"}
						fontSize={16}
						text={mauticState.successMessage}
						justify="center"
						height={1}
						display="flex"
					/>
				) : (
					<>
						<CardRow
							mt={3}
							color="text.primary"
							fontWeight={"fontWeightBold"}
							fontSize={16}
							text={
								"Before you can stake, you need to own $CRUX. It can be bought through PancakeSwap. Make sure to set the slippage to 9%."
							}
							justify="center"
						/>
						<Box width={1} mt={2} display="flex" justifyContent="center">
							<a
								rel="noopener noreferrer"
								href="https://pancakeswap.finance/swap?outputCurrency=0xD641156213ad80A007993a1D9cE80085414CFF39"
								target="_blank"
							>
								<Button
									type="submit"
									id={`sign-up-email`}
									disabled={waiting}
									className={classes.singUp}
									onClick={() => handleSubmitUrl()}
									variant="contained"
									color="secondary"
								>
									BUY CRUX
								</Button>
							</a>
						</Box>
						<Box width={1} mt={2} display="flex" justifyContent="center">
							<a
								rel="noopener noreferrer"
								href="https://cruxcryptos.com"
								target="_blank"
							>
								<Button
									type="submit"
									id={`sign-up-email`}
									disabled={waiting}
									className={classes.singUp}
									onClick={() => handleSubmitUrl()}
									variant="contained"
									color="secondary"
								>
									Check CRUX Website
								</Button>
							</a>
						</Box>
					</>
				)}
			</Box>
		</>
	)
}
