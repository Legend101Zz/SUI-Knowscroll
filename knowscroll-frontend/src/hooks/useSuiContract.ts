import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { useSui } from "@/context/SuiContext";

export const useSuiContract = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { packageId, registryId } = useSui();
  const [isLoading, setIsLoading] = useState(false);

  const createChannel = async (
    name: string,
    description: string,
    category: string,
    initialShares: number,
    imageUrl?: string,
  ) => {
    if (!currentAccount) throw new Error("Wallet not connected");

    setIsLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::channel_nft::create_channel`,
        arguments: [
          tx.object(registryId),
          tx.pure.string(name),
          tx.pure.string(description),
          tx.pure.string(category),
          tx.pure.u64(initialShares),
          tx.pure.option("string", imageUrl || null),
        ],
      });

      const result = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: currentAccount,
      });

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const transferShares = async (shareObjectId: string, recipient: string) => {
    if (!currentAccount) throw new Error("Wallet not connected");

    setIsLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::channel_nft::transfer_shares`,
        arguments: [tx.object(shareObjectId), tx.pure.address(recipient)],
      });

      const result = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: currentAccount,
      });

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createChannel,
    transferShares,
    isLoading,
  };
};
