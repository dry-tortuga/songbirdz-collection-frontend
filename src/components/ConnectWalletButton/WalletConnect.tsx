"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  baseAccount,
  coinbaseWallet,
  injected,
  metaMask,
} from "wagmi/connectors";

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

type WalletOption = {
  id: string;
  name: string;
  connect: () => void;
};

function WalletModal({
  onClose,
  appName = "My App",
}: {
  onClose: () => void;
  appName?: string;
}) {
  const { connect } = useConnect();
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const walletOptions: WalletOption[] = [
    {
      id: "base-account",
      name: "Sign in with Base",
      connect: () => {
        connect({ connector: baseAccount({ appName }) });
        onClose();
      },
    },
    {
      id: "coinbase-wallet",
      name: "Coinbase Wallet",
      connect: () => {
        connect({
          connector: coinbaseWallet({ appName, preference: "all" }),
        });
        onClose();
      },
    },
    {
      id: "metamask",
      name: "MetaMask",
      connect: () => {
        connect({
          connector: metaMask({
            dappMetadata: {
              name: appName,
              url: typeof window !== "undefined" ? window.location.origin : "",
            },
          }),
        });
        onClose();
      },
    },
    {
      id: "injected",
      name: "Browser Wallet",
      connect: () => {
        connect({ connector: injected({ target: 'walletName' }) });
        onClose();
      },
    },
  ];

  const [primaryOption, ...otherOptions] = walletOptions;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Connect Wallet"
    >
      <div className="relative w-[22rem] rounded-xl bg-white p-6 pb-4 shadow-xl dark:bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label="Close modal"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L13 13M1 13L13 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="mb-6 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Connect Wallet
        </h2>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={primaryOption.connect}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-left font-medium text-white transition-colors hover:bg-blue-700"
          >
            {primaryOption.name}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500">
                or use another wallet
              </span>
            </div>
          </div>

          {otherOptions.map((wallet) => (
            <button
              key={wallet.id}
              type="button"
              onClick={wallet.connect}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-750"
            >
              {wallet.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WalletConnect({ appName = "My App" }: { appName?: string }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
          {truncateAddress(address)}
        </span>
        <button
          type="button"
          onClick={() => disconnect()}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Connect Wallet
      </button>
      {isModalOpen && (
        <WalletModal
          onClose={() => setIsModalOpen(false)}
          appName={appName}
        />
      )}
    </>
  );
}