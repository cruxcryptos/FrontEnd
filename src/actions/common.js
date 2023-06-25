import { BigNumber, Contract } from "ethers"
import { splitSig, Transaction } from "adex-protocol-eth/js"
import IdentityABI from "adex-protocol-eth/abi/Identity"
import FactoryABI from "adex-protocol-eth/abi/IdentityFactory"
import { ZERO } from "../helpers/constants"
import { getUserIdentity, zeroFeeTx, rawZeroFeeTx } from "../helpers/identity"
import {
	ADEX_RELAYER_HOST,
	PRICES_API_URL,
	PRICE_CRUX_API_URL,
	COINMARKETCAP_API
} from "../helpers/constants"
import { getSigner, getDefaultProvider, signMessage } from "../ethereum"

const defaultProvider = getDefaultProvider

export async function getPrices() {
	try {
		const res = await fetch(PRICE_CRUX_API_URL,
			{headers: {
				"Content-Type": "application/json"
			}}
		)
		const data = await res.json()
		if (!data.data[0].attributes) {
			console.log('API fetch for pricing not working.' )
			throw new Error("errors.gettingPrices")
		} else {
			console.log('Current Price fixed: ' + parseFloat(data.data[0].attributes.base_token_price_usd).toFixed(7))
			return {
				USD:parseFloat(data.data[0].attributes.base_token_price_usd).toFixed(7)
			}
		}
	} catch (err) {
		console.error("Triggered Price error on API get")
		return 1
	}
}

export async function executeOnIdentity(
	chosenWalletType,
	txns,
	opts = {},
	gasless,
	extraGasLimit
) {
	const signer = await getSigner(chosenWalletType)
	if (!signer) throw new Error("errors.failedToGetSigner")
	const walletAddr = await signer.getAddress()
	const { addr, bytecode } = getUserIdentity(walletAddr)
	const identity = new Contract(addr, IdentityABI, signer)

	const needsToDeploy =
		(await defaultProvider.getCode(identity.address)) === "0x"
	const idNonce = needsToDeploy ? ZERO : await identity.nonce()
	const toTuples = offset => ([to, data], i) =>
		zeroFeeTx(
			identity.address,
			idNonce.add(i + offset),
			to,
			data
		).toSolidityTuple()
	if (gasless) {
		// @TODO: we can use execute that calls into executeBySender here to only sign one tx
		const txnsRaw = txns.map(([to, data], i) =>
			rawZeroFeeTx(identity.address, idNonce.add(i), to, data)
		)
		const signatures = []
		for (const tx of txnsRaw) {
			const sig = await signMessage(signer, new Transaction(tx).hash())
			signatures.push(splitSig(sig))
		}

		const executeUrl = `${ADEX_RELAYER_HOST}/staking/${walletAddr}/execute`
		const res = await fetch(executeUrl, {
			method: "POST",
			body: JSON.stringify({
				txnsRaw,
				signatures
			}),
			headers: { "Content-Type": "application/json" }
		})
		if (res.status === 500) throw new Error("errors.relayerInternal")
		return res.json()
	} else if (!needsToDeploy) {
		const txnTuples = txns.map(toTuples(0))

		if (extraGasLimit) {
			const estimatedGasLimit = await identity.estimateGas.executeBySender(
				txnTuples,
				opts
			)
			opts.gasLimit = estimatedGasLimit.add(BigNumber.from(extraGasLimit))
		}

		await identity.executeBySender(txnTuples, opts)
	} else {
		// Has offset because the execute() takes the first nonce
		const txnTuples = txns.map(toTuples(1))
		const executeTx = zeroFeeTx(
			identity.address,
			idNonce,
			identity.address,
			identity.interface.encodeFunctionData("executeBySender", [txnTuples])
		)

		const sig = await signMessage(signer, executeTx.hash())
	}
}

export function toChannelTuple(args) {
	return [
		args.creator,
		args.tokenAddr,
		args.tokenAmount,
		args.validUntil,
		args.validators,
		args.spec
	]
}

export async function timeout(ms = 420) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
