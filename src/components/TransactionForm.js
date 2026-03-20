"use client";
import { useCallback, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from "wagmi";

export function TransactionForm({
  calls,
  chainId,
  buttonText = "Transact",
  onStatus,
  disabled = false,
  className,
}) {
  const { isConnected, chainId: currentChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const [status, setStatus] = useState({
    statusName: "init",
    statusData: null,
  });

  const updateStatus = useCallback(
    (newStatus) => {
      setStatus(newStatus);
      onStatus?.(newStatus);
    },
    [onStatus]
  );

  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    reset: resetWrite,
  } = useWriteContract();

  const { data: receipt, isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId,
  });

  useEffect(() => {
    if (isWritePending) {
      updateStatus({ statusName: "pending", statusData: null });
    }
  }, [isWritePending, updateStatus]);

  useEffect(() => {
    if (txHash && !receipt) {
      updateStatus({
        statusName: "confirmed",
        statusData: { transactionHash: txHash },
      });
    }
  }, [txHash, receipt, updateStatus]);

  useEffect(() => {
    if (receipt) {
      updateStatus({
        statusName: "success",
        statusData: {
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
          receipt,
        },
      });
    }
  }, [receipt, updateStatus]);

  const handleSubmit = useCallback(async () => {
    if (!isConnected || calls.length === 0) return;

    try {
      if (chainId && currentChainId !== chainId) {
        await switchChainAsync({ chainId });
      }

      const call = calls[0];
      writeContract(
        {
          address: call.address,
          abi: call.abi,
          functionName: call.functionName,
          args: call.args ?? [],
          value: call.value,
          chainId,
        },
        {
          onError: (error) => {
            const isUserRejection =
              error.message?.includes("User rejected") ||
              error.message?.includes("User denied") ||
              error.message?.includes("Request denied");
            const message = isUserRejection
              ? "Request denied."
              : error.message || "Transaction failed";
            updateStatus({ statusName: "error", statusData: { message } });
          },
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Transaction failed";
      updateStatus({ statusName: "error", statusData: { message } });
    }
  }, [isConnected, calls, chainId, currentChainId, switchChainAsync, writeContract, updateStatus]);

  const handleReset = useCallback(() => {
    resetWrite();
    updateStatus({ statusName: "init", statusData: null });
  }, [resetWrite, updateStatus]);

  const isLoading = isWritePending || isWaiting;

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
          {isWritePending && (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
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
                className="me-2"
              />
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