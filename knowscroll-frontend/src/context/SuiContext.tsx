"use client";

import { createContext, useContext, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();

const networks = {
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};

interface SuiContextType {
  packageId: string;
  registryId: string;
  marketplaceId: string;
}

const SuiContext = createContext<SuiContextType | undefined>(undefined);

export function SuiProvider({ children }: { children: ReactNode }) {
  const contextValue: SuiContextType = {
    packageId: process.env.NEXT_PUBLIC_PACKAGE_ID || "",
    registryId: process.env.NEXT_PUBLIC_REGISTRY_ID || "",
    marketplaceId: process.env.NEXT_PUBLIC_MARKETPLACE_ID || "",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="devnet">
        <WalletProvider>
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
