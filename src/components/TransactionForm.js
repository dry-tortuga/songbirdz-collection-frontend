"use client";
import { useCallback, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import {
	useAccount,
	useWriteContract,
	useWaitForTransactionReceipt,
	useSwitchChain,
} from "wagmi";
import {
	useWriteContracts,
	useCallsStatus,
	useCapabilities,
} from "wagmi/experimental";

export function TransactionForm({
	calls,
	chainId,
	buttonText = "Transact",
	onStatus,
	disabled = false,
	className,
}) {

	const { address, isConnected, chainId: currentChainId } = useAccount();
	const { switchChainAsync } = useSwitchChain();

	const [status, setStatus] = useState({
		statusName: "init",
		statusData: null,
	});

	const { data: availableCapabilities } = useCapabilities({ account: address });

	const isSmartWallet = Boolean(
		availableCapabilities?.[chainId]?.paymasterService?.supported
	);

	const updateStatus = useCallback(
		(newStatus) => {
			setStatus(newStatus);
			onStatus?.(newStatus);
		},
		[onStatus]
	);

	// For Base account (smart wallet)
	const { writeContracts, data: baseAccountData, isPending: isWritePendingBaseAccount, reset: resetWriteContracts  } = useWriteContracts();

	const batchId = baseAccountData?.id;

	// For EOA wallets
	const {
		writeContract,
		data: txHash,
		isPending: isWritePendingEOA,
		reset: resetWrite,
	} = useWriteContract();

	const { data: receiptEOA, isLoading: isWaitingEOA } = useWaitForTransactionReceipt({
		hash: txHash,
		chainId,
	});

	// Poll the bundle status using the batchId
	const { data: callsStatus } = useCallsStatus({
		id: batchId,
		query: {
			enabled: Boolean(batchId),
			refetchInterval: (data) => {
				return data?.status === "success" ? false : 1000;
			},
		}
	});

	useEffect(() => {
		if (isWritePendingEOA || isWritePendingBaseAccount) {
			updateStatus({ statusName: "pending", statusData: null });
		}
	}, [isWritePendingEOA, isWritePendingBaseAccount, updateStatus]);

	// Listen to success tx status for Base Account
	useEffect(() => {
		if (batchId && callsStatus?.status !== "success") {
			updateStatus({ statusName: "confirmed", statusData: { transactionHash: batchId } });
		}
	}, [batchId, callsStatus, updateStatus]);

	useEffect(() => {
		if (callsStatus?.status === "success") {
			const receipt = callsStatus.receipts?.[0];
			updateStatus({
				statusName: "success",
				statusData: {
					transactionHash: receipt?.transactionHash ?? batchId,
					blockNumber: receipt?.blockNumber,
					receipt,
				},
			});
		}
	}, [callsStatus, batchId, updateStatus]);

	// Listen to success tx status for EOA
	useEffect(() => {
		if (txHash && !receiptEOA) {
			updateStatus({
				statusName: "confirmed",
				statusData: { transactionHash: txHash },
			});
		}
	}, [txHash, receiptEOA, updateStatus]);

	useEffect(() => {
		if (receiptEOA) {
			updateStatus({
				statusName: "success",
				statusData: {
					transactionHash: receiptEOA.transactionHash,
					blockNumber: receiptEOA.blockNumber,
					receipt: receiptEOA,
				},
			});
		}
	}, [receiptEOA, updateStatus]);

	// Add this before handleSubmit
	const handleError = useCallback((error) => {
		const isUserRejection =
			error.message?.includes("User rejected") ||
			error.message?.includes("User denied") ||
			error.message?.includes("Request denied");
		const message = isUserRejection ? "Request denied." : error.message || "Transaction failed";
		updateStatus({ statusName: "error", statusData: { message } });
	}, [updateStatus]);

	const handleSubmit = useCallback(async () => {
		if (!isConnected || calls.length === 0) return;

		try {
			if (chainId && currentChainId !== chainId) {
				await switchChainAsync({ chainId });
			}

			if (isSmartWallet) {
				// EIP-5792 path — paymaster sponsored, batching supported
				writeContracts({
					contracts: calls.map((call) => ({
						address: call.address,
						abi: call.abi,
						functionName: call.functionName,
						args: call.args ?? [],
						value: call.value,
					})),
					chainId,
					capabilities: {
						paymasterService: {
							url: process.env.REACT_APP_COINBASE_PAYMASTER_AND_BUNDLER_ENDPOINT,
						},
					},
				}, { onError: handleError });
			} else {
				// Standard EOA path — MetaMask, Rainbow, injected, etc.
				const call = calls[0];
				writeContract({
					address: call.address,
					abi: call.abi,
					functionName: call.functionName,
					args: call.args ?? [],
					value: call.value,
					chainId,
				}, { onError: handleError });
			}
		} catch (error) {
			updateStatus({ statusName: "error", statusData: { message: error.message } });
		}
	}, [isConnected, isSmartWallet, calls, chainId, currentChainId, switchChainAsync, writeContracts, writeContract, updateStatus, handleError]);

	const handleReset = useCallback(() => {
		resetWrite();
		resetWriteContracts();
		updateStatus({ statusName: "init", statusData: null });
	}, [resetWrite, resetWriteContracts, updateStatus]);

	const isWaitingBaseAccount = Boolean(batchId) && callsStatus?.status !== "success" && callsStatus?.status !== "error";
	const isLoading = isWritePendingBaseAccount || isWritePendingEOA || isWaitingEOA || isWaitingBaseAccount;
	const isWaiting = isWaitingBaseAccount || isWaitingEOA;

	const explorerBase =
		chainId === 84532 ? "https://sepolia.basescan.org" : "https://basescan.org";

	return (
		<div className={`d-flex flex-column gap-2 ${className ?? ""}`}>
			{status.statusName === "success" ? (
				<>
					<Button
						variant="success"
						onClick={() =>
							window.open(`${explorerBase}/tx/${status.statusData.transactionHash}`, "_blank")
						}
						>
						View transaction
					</Button>
					<Button variant="outline-secondary" onClick={handleReset}>
						Send another
					</Button>
				</>
			) : (
				<Button
					variant={status.statusName === "error" ? "danger" : "info"}
					onClick={status.statusName === "error" ? handleReset : handleSubmit}
					disabled={disabled || !isConnected || isLoading}
					>
					{(isWritePendingEOA || isWritePendingBaseAccount) && (
						<>
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
								className="me-2" />
							Confirm in wallet...
						</>
					)}
					{isWaiting && (
						<>
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
								className="me-2" />
							Transaction in progress...
						</>
					)}
					{status.statusName === "error" && "Try again"}
					{status.statusName === "init" && buttonText}
					{status.statusName === "confirmed" && !isWaiting && buttonText}
					</Button>
			)}
			<TransactionStatusDisplay status={status} chainId={chainId} />
		</div>
	);
}

function TransactionStatusDisplay({ status, chainId }) {
	if (status.statusName === "init") return null;

	const explorerBase =
		chainId === 84532 ? "https://sepolia.basescan.org" : "https://basescan.org";

	return (
		<div className="mt-1" style={{ fontSize: "0.875rem" }}>
			{status.statusName === "pending" && (
				<p className="text-warning mb-0">Confirm in wallet.</p>
			)}
			{status.statusName === "confirmed" && (
				<p className="text-primary mb-0">Transaction in progress...</p>
			)}
			{status.statusName === "success" && (
				<p className="text-success mb-0">
					Successful!{" "}
					<a
						href={`${explorerBase}/tx/${status.statusData.transactionHash}`}
						target="_blank"
						rel="noopener noreferrer"
						>
						View on explorer
					</a>
				</p>
			)}
			{status.statusName === "error" && (
				<p className="text-danger mb-0">{status.statusData.message}</p>
			)}
		</div>
	);
}

export default TransactionForm;
