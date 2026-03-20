"use client";
import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from "wagmi";
import type { Abi, Address } from "viem";

type ContractCall = {
  address: Address;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  value?: bigint;
};

type LifecycleStatus =
  | { statusName: "init"; statusData: null }
  | { statusName: "pending"; statusData: null }
  | { statusName: "confirmed"; statusData: { transactionHash: string } }
  | {
      statusName: "success";
      statusData: { transactionHash: string; blockNumber: bigint };
    }
  | { statusName: "error"; statusData: { message: string } };

type TransactionFormProps = {
  calls: ContractCall[];
  chainId?: number;
  buttonText?: string;
  onStatus?: (status: LifecycleStatus) => void;
  disabled?: boolean;
  className?: string;
};

export function TransactionForm({
  calls,
  chainId,
  buttonText = "Transact",
  onStatus,
  disabled = false,
  className,
}: TransactionFormProps) {
  const { isConnected, chainId: currentChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const [status, setStatus] = useState<LifecycleStatus>({
    statusName: "init",
    statusData: null,
  });

  const updateStatus = useCallback(
    (newStatus: LifecycleStatus) => {
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

  // CRITICAL: Always pass chainId so wagmi polls the correct chain's RPC.
  // Without this, if the user's wallet is on a different chain than the
  // transaction target, wagmi has no transport to poll and the receipt
  // is never found -- the UI hangs in "pending" forever.
  const { data: receipt, isLoading: isWaiting } =
    useWaitForTransactionReceipt({
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
      const message =
        error instanceof Error ? error.message : "Transaction failed";
      updateStatus({ statusName: "error", statusData: { message } });
    }
  }, [
    isConnected,
    calls,
    chainId,
    currentChainId,
    switchChainAsync,
    writeContract,
    updateStatus,
  ]);

  const handleReset = useCallback(() => {
    resetWrite();
    updateStatus({ statusName: "init", statusData: null });
  }, [resetWrite, updateStatus]);

  const isLoading = isWritePending || isWaiting;

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      {status.statusName === "success" ? (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              const hash = status.statusData.transactionHash;
              const explorerBase = chainId === 84532
                ? "https://sepolia.basescan.org"
                : "https://basescan.org";
              window.open(`${explorerBase}/tx/${hash}`, "_blank");
            }}
            className="rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            View transaction
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Send another
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={status.statusName === "error" ? handleReset : handleSubmit}
          disabled={disabled || !isConnected || isLoading}
          className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            status.statusName === "error"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isWritePending && (
            <span className="inline-flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Confirm in wallet...
            </span>
          )}
          {isWaiting && (
            <span className="inline-flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Transaction in progress...
            </span>
          )}
          {status.statusName === "error" && "Try again"}
          {status.statusName === "init" && buttonText}
          {status.statusName === "confirmed" && !isWaiting && buttonText}
        </button>
      )}

      <TransactionStatusDisplay status={status} chainId={chainId} />
    </div>
  );
}

function TransactionStatusDisplay({
  status,
  chainId,
}: {
  status: LifecycleStatus;
  chainId?: number;
}) {
  if (status.statusName === "init") return null;

  const explorerBase =
    chainId === 84532
      ? "https://sepolia.basescan.org"
      : "https://basescan.org";

  return (
    <div className="text-sm">
      {status.statusName === "pending" && (
        <p className="text-yellow-600 dark:text-yellow-400">
          Confirm in wallet.
        </p>
      )}
      {status.statusName === "confirmed" && (
        <p className="text-blue-600 dark:text-blue-400">
          Transaction in progress...
        </p>
      )}
      {status.statusName === "success" && (
        <div className="flex items-center gap-2">
          <p className="text-green-600 dark:text-green-400">Successful!</p>
          <a
            href={`${explorerBase}/tx/${status.statusData.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
          >
            View on explorer
          </a>
        </div>
      )}
      {status.statusName === "error" && (
        <p className="text-red-600 dark:text-red-400">
          {status.statusData.message}
        </p>
      )}
    </div>
  );
}
