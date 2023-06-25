import { BigNumber, utils } from "ethers"
import walletconnectLogo from "../walletconnect-logo.svg"
import metamaskLogo from "../metamask-fox.svg"
import trezorLogo from "../trezor.svg"
// import ledgerLogo from "../ledger.png"

import { ReactComponent as BalancerIcon } from "./../resources/balancer-bal-logo.svg"
import { ReactComponent as UniswapIcon } from "./../resources/uniswap-uni-logo.svg"
import { ReactComponent as YUSDIcon } from "./../resources/yUSD.svg"
import { ReactComponent as ADXIcon } from "./../resources/adex-logo-clean.svg"
import { ReactComponent as ETHIcon } from "./../resources/eth-logo.svg"
import { ReactComponent as YFIIcon } from "./../resources/yfi-logo.svg"
import { ReactComponent as LINKIcon } from "./../resources/chain-link-logo.svg"
import { ReactComponent as LoyaltyIcon } from "./../resources/loyalty-ic.svg"
import { ReactComponent as TomIcon } from "./../resources/tom-ic.svg"

export const useTestnet = true // TODO env cfg

// CRUX ADDRESS
export const ADDR_STAKING = useTestnet
	? "0x5178f1Def5B0a1CAEffB5767D0ae2c4Bb7cC1d6B"
	: "0x4846c6837ec670bbd1f5b485471c8f64ecb9c534"

export const ZERO = BigNumber.from(0)
// export const PRICES_API_URL =
// 	"https://min-api.cryptocompare.com/data/price?fsym=ADX&tsyms=BTC,USD,EUR"

export const PRICES_API_URL = `https://api.coingecko.com/api/v3/simple/price?ids=ADEX&vs_currencies=usd`
export const PRICE_CRUX_API_URL =
	"https://api.geckoterminal.com/api/v2/networks/bsc/tokens/0xd641156213ad80a007993a1d9ce80085414cff39/pools"
export const UNBOND_DAYS = 20
export const STAKING_RULES_URL = null

export const IDLE_TIMEOUT_MINUTES = 10

//CRUX ADDRESS
export const ADDR_ADX = useTestnet
	? "0x87122ceAdD906c5a025986d1B293F824d520053c"
	: "0xADE00C28244d5CE17D72E40330B1c318cD12B7c3"

//CRUX SMALL POOL STAKE ADDRESS
export const CRUX_SMALLPOOL_STAKEADDRESS = useTestnet
	? "0xf8863011e19BAc754F566DBf511ea47Fe3B91eA7"
	: "0xADE00C28244d5CE17D72E40330B1c318cD12B7c3"
//CRUX SMALL POOL STAKE ADDRESS

//CRUX MID POOL STAKE ADDRESS
export const CRUX_MIDPOOL_STAKEADDRESS = useTestnet
	? "0x157c754FED4144DCdf9F8b106eA0D821e9E179d1"
	: "0xADE00C28244d5CE17D72E40330B1c318cD12B7c3"

//CRUX LARGE POOL STAKE ADDRESS
export const CRUX_LARGEPOOL_STAKEADDRESS = useTestnet
	? "0xc5693A61Ab5a137F5BDeAc56884C04A610d64Ea5"
	: "0xADE00C28244d5CE17D72E40330B1c318cD12B7c3"

export const ZERO_ADDR = "0x0000000000000000000000000000000000000000"

export const MAX_UINT = BigNumber.from(
	"115792089237316195423570985008687907853269984665640564039457584007913129639935"
)

export const DEFAULT_BOND = {
	poolId: "",
	amount: ZERO
}

export const POOLS = [
	{
		label: "common.validatorTom",
		id: utils.id("validator:0x2892f6C41E0718eeeDd49D98D648C789668cA67d"),
		selectable: true,
		minStakingAmount: "0.0",
		purpose: "pools.tomPurpose",
		lockupPeriod: 30,
		lockupPeriodText: "pools.tomLockupPeriodTxt",
		rewardPolicy: "pools.tomRewardPolicy",
		slashPolicy: "pools.tomSlashPolicy",
		apyStability: "pools.tomApyStability",
		url: useTestnet ? "http://localhost:8005" : "https://tom.adex.network",
		estimatedAnnualFeeYield: 182500,
		estimatedAnnualADXYield: 15103448.2758,
		estimatedAnnualADXEarlyYield: 12166666.6666
	},
	{
		label: "common.validatorJerry",
		id: utils.id("validator:0xce07CbB7e054514D590a0262C93070D838bFBA2e"),
		selectable: false,
		minStakingAmount: "0.0",
		purpose: "pools.jerryPurpose",
		lockupPeriod: 30,
		lockupPeriodText: "pools.jerryLockupPeriodTxt",
		rewardPolicy: "pools.jerryRewardPolicy",
		slashPolicy: "pools.jerrySlashPolicy",
		apyStability: "pools.jerryApyStability",
		url: useTestnet ? "http://localhost:8005" : "https://tom.adex.network"
	}
]

export const DEPOSIT_POOLS = [
	{
		label: "common.loPo",
		id: utils.id("deposit:0x5178f1Def5B0a1CAEffB5767D0ae2c4Bb7cC1d6B"),
		selectable: true,
		minStakingAmount: "0.0",
		rewardPolicy: "pools.loPoRewardPolicy",
		slashPolicy: "pools.loPoSlashPolicy",
		url:
			"https://etherscan.io/address/0x5178f1Def5B0a1CAEffB5767D0ae2c4Bb7cC1d6B",
		confirmationLabel: null,
		confirmationUrl: "https://sepolia.etherscan.io/tx//"
	},
	{
		label: "common.loPo",
		id: utils.id("deposit:0xc0959377dccb4d95Df6d275051b7Bf447155FD3B"),
		selectable: true,
		minStakingAmount: "0.0",
		rewardPolicy: "pools.loPoRewardPolicy",
		slashPolicy: "pools.loPoSlashPolicy",
		url:
			"https://etherscan.io/address/0xc0959377dccb4d95Df6d275051b7Bf447155FD3B",
		confirmationLabel: null,
		confirmationUrl: "https://sepolia.etherscan.io/tx//"
	},
	{
		label: "common.loPo",
		id: utils.id("deposit:0xAd6e2B74FA0e6e1EAF5Bba55b6dfFc07E9e922BE"),
		selectable: true,
		minStakingAmount: "0.0",
		rewardPolicy: "pools.loPoRewardPolicy",
		slashPolicy: "pools.loPoSlashPolicy",
		url:
			"https://etherscan.io/address/0xAd6e2B74FA0e6e1EAF5Bba55b6dfFc07E9e922BE",
		confirmationLabel: null,
		confirmationUrl: "https://sepolia.etherscan.io/tx//"
	}
]

export const iconByPoolId = ({ poolId, id }) => {
	switch (poolId || id) {
		case DEPOSIT_POOLS[0].id:
			return BalancerIcon
		case DEPOSIT_POOLS[1].id:
			return BalancerIcon
		case DEPOSIT_POOLS[2].id:
			return BalancerIcon
		case "adex-staking-pool":
		case POOLS[0].id:
		case POOLS[1].id:
		default:
			return null
	}
}

export const METAMASK = "Metamask"
export const WALLET_CONNECT = "WalletConnect"
export const TREZOR = "Trezor"
export const LEDGER = "Ledger"

export const Wallets = [
	{
		name: METAMASK,
		icon: metamaskLogo
	},
	{
		name: WALLET_CONNECT,
		icon: walletconnectLogo,
		extraLabel: {
			message: "dialogs.exceptWallets",
			data: {
				wallets: "Trust Wallet"
			}
		}
	},
	{
		name: TREZOR,
		icon: trezorLogo,
		extraLabel: {
			message: "dialogs.trezorDefaultAddressOnly"
		}
	}
	// {
	// 	name: LEDGER,
	// 	icon: ledgerLogo
	// }
]

export const SUPPORTED_CHAINS = useTestnet
	? [{ id: 11155111, name: "sepolia" }]
	: [{ id: 1, name: "mainnet" }]

export const TOKEN_OLD_TO_NEW_MULTIPLIER = BigNumber.from("100000000000000")

export const REACT_APP_INFURA_ID = "3d22938fd7dd41b7af4197752f83e8a1"

// export const REACT_APP_RPC_URL =
// 	"wss://mainnet.infura.io/ws/v3/3d22938fd7dd41b7af4197752f83e8a1"
export const INFURA_API_KEY = "9b1a725f03c94dbe9ebe0133561a3c99"
export const REACT_APP_RPC_URL = useTestnet
	? `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
	: //: "https://morning-wild-water.quiknode.pro/66011d2c6bdebc583cade5365086c8304c13366c/"
	  //   "https://mainnet.infura.io/v3/3d22938fd7dd41b7af4197752f83e8a1"
	  "https://eth-mainnet.alchemyapi.io/v2/ZxuaPQ9OfTqfnwJM4VTNGxgP4gMQDH07"

export const ADEX_RELAYER_HOST = useTestnet
	? // ? "https://goerli-relayer.adex.network"
	  "http://localhost:1934"
	: "https://relayer.adex.network"
// export const ADEX_RELAYER_HOST = "https://goerli-relayer.adex.network"
