"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useCurrentAccount,
  useConnectWallet,
  useDisconnectWallet,
  useWallets
} from "@mysten/dapp-kit";
import {
  FaWallet,
  FaTimes,
  FaCheck,
  FaExternalLinkAlt,
  FaCopy,
  FaSignOutAlt
} from 'react-icons/fa';

interface WalletConnectProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const currentAccount = useCurrentAccount();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const wallets = useWallets();

  const handleConnect = (walletName: string) => {
    connect(
      { wallet: wallets.find(w => w.name === walletName)! },
      {
        onSuccess: () => {
          setShowWalletModal(false);
          onConnect?.();
        },
      }
    );
  };

  const handleDisconnect = () => {
    disconnect();
    setShowAccountDetails(false);
    onDisconnect?.();
  };

  const copyAddress = async () => {
    if (currentAccount?.address) {
      await navigator.clipboard.writeText(currentAccount.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (currentAccount) {
    return (
      <div className="relative">
        <motion.button
          className="flex items-center bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-full px-4 py-2 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAccountDetails(!showAccountDetails)}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-secondary rounded-full flex items-center justify-center mr-3">
            <FaWallet className="text-sm" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-medium">Connected</div>
            <div className="text-xs text-white/70">{formatAddress(currentAccount.address)}</div>
          </div>
          <FaCheck className="text-green-400 ml-2" size={12} />
        </motion.button>

        <AnimatePresence>
          {showAccountDetails && (
            <motion.div
              className="absolute right-0 top-full mt-2 w-80 bg-background-lighter border border-white/10 rounded-xl shadow-xl z-50"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Wallet Details</h3>
                  <button
                    onClick={() => setShowAccountDetails(false)}
                    className="text-white/50 hover:text-white"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Address */}
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Address</label>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <span className="text-sm font-mono">{formatAddress(currentAccount.address)}</span>
                      <div className="flex items-center gap-2">
                        <motion.button
                          className="text-white/50 hover:text-white"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={copyAddress}
                        >
                          {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                        </motion.button>
                        <motion.button
                          className="text-white/50 hover:text-white"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => window.open(`https://suiscan.xyz/testnet/account/${currentAccount.address}`, '_blank')}
                        >
                          <FaExternalLinkAlt />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Network Info */}
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Network</label>
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-sm font-medium">SUI Testnet</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-white/10">
                    <motion.button
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg py-2 px-4 text-sm font-medium flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDisconnect}
                    >
                      <FaSignOutAlt className="mr-2" />
                      Disconnect
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <motion.button
        className="flex items-center bg-gradient-to-r from-primary to-primary-secondary hover:from-primary-600 hover:to-primary-secondary-600 rounded-full px-6 py-2 font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowWalletModal(true)}
      >
        <FaWallet className="mr-2" />
        Connect Wallet
      </motion.button>

      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWalletModal(false)}
          >
            <motion.div
              className="bg-background-lighter border border-white/10 rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Connect Wallet</h2>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="text-white/50 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <p className="text-white/70 mb-6 text-sm">
                Connect your SUI wallet to start creating and sharing educational content on KnowScroll.
              </p>

              <div className="space-y-3">
                {wallets.map((wallet) => (
                  <motion.button
                    key={wallet.name}
                    className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConnect(wallet.name)}
                  >
                    <div className="flex items-center">
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className="w-8 h-8 mr-3 rounded-lg"
                      />
                      <div className="text-left">
                        <div className="font-medium">{wallet.name}</div>
                        <div className="text-xs text-white/50">
                          {wallet.name.includes('Sui') ? 'Official Sui Wallet' : 'Popular Choice'}
                        </div>
                      </div>
                    </div>
                    <FaExternalLinkAlt className="text-white/30" />
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">New to SUI?</h4>
                    <p className="text-xs text-white/70">
                      You'll need a SUI wallet to interact with the blockchain.
                      We recommend starting with the official Sui Wallet.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}