"use client";

import { createContext, useContext, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();

// Configure networks
const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

interface SuiContextType {
  packageId: string;
  channelRegistryId: string;
  marketplaceId: string;
  governanceRegistryId: string;
}

const SuiContext = createContext<SuiContextType | undefined>(undefined);

export function SuiProvider({ children }: { children: ReactNode }) {
  const contextValue: SuiContextType = {
    packageId: process.env.NEXT_PUBLIC_PACKAGE_ID || "",
    channelRegistryId: process.env.NEXT_PUBLIC_CHANNEL_REGISTRY || "",
    marketplaceId: process.env.NEXT_PUBLIC_MARKETPLACE || "",
    governanceRegistryId: process.env.NEXT_PUBLIC_GOVERNANCE_REGISTRY || "",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <SuiContext.Provider value={contextValue}>
            {children}
          </SuiContext.Provider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export const useSui = () => {
  const context = useContext(SuiContext);
  if (context === undefined) {
    throw new Error("useSui must be used within a SuiProvider");
  }
  return context;
};
