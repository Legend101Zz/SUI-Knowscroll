/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import {
  useCurrentAccount,
  useSuiClient,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { useSui } from "@/context/SuiContext";
import { toast } from "react-hot-toast"; // You'll need to install this: npm install react-hot-toast

export const useSuiContract = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { packageId, channelRegistryId, marketplaceId, governanceRegistryId } =
    useSui();
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const executeTransaction = async (transaction: Transaction): Promise<any> => {
    return new Promise((resolve, reject) => {
      signAndExecuteTransaction(
        {
          transaction,
          options: {
            showEvents: true,
            showEffects: true,
            showObjectChanges: true,
          },
        },
        {
          onSuccess: (result) => {
            console.log("Transaction successful:", result);
            resolve(result);
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
            reject(error);
          },
        }
      );
    });
  };

  const createChannel = async (
    name: string,
    description: string,
    category: string,
    initialShares: number,
    imageUrl?: string
  ) => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    if (!packageId || !channelRegistryId) {
      toast.error("Contract addresses not configured");
      throw new Error("Contract addresses not configured");
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();

      // Convert image URL to bytes if provided
      const imageUrlBytes = imageUrl
        ? Array.from(new TextEncoder().encode(imageUrl))
        : null;

      tx.moveCall({
        target: `${packageId}::channel_nft::create_channel`,
        arguments: [
          tx.object(channelRegistryId),
          tx.pure.string(name),
          tx.pure.string(description),
          tx.pure.string(category),
          tx.pure.u64(initialShares),
          tx.pure.option("vector<u8>", imageUrlBytes),
        ],
      });

      const result = await executeTransaction(tx);

      // Extract the created channel from the transaction effects
      const createdObjects = result.effects?.created || [];
      const channelObject = createdObjects.find(
        (obj: any) =>
          obj.owner &&
          typeof obj.owner === "object" &&
          "AddressOwner" in obj.owner
      );

      toast.success("Channel created successfully!");
      return {
        ...result,
        channelId: channelObject?.reference?.objectId,
      };
    } catch (error: any) {
      toast.error(`Failed to create channel: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const transferShares = async (shareObjectId: string, recipient: string) => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::channel_nft::transfer_shares`,
        arguments: [tx.object(shareObjectId), tx.pure.address(recipient)],
      });

      const result = await executeTransaction(tx);
      toast.success("Shares transferred successfully!");
      return result;
    } catch (error: any) {
      toast.error(`Failed to transfer shares: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const splitShares = async (shareObjectId: string, amount: number) => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::channel_nft::split_shares`,
        arguments: [tx.object(shareObjectId), tx.pure.u64(amount)],
      });

      const result = await executeTransaction(tx);
      toast.success("Shares split successfully!");
      return result;
    } catch (error: any) {
      toast.error(`Failed to split shares: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createListing = async (
    shareObjectId: string,
    pricePerShare: number
  ) => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    if (!marketplaceId) {
      toast.error("Marketplace not configured");
      throw new Error("Marketplace not configured");
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::marketplace::create_listing`,
        arguments: [
          tx.object(marketplaceId),
          tx.object(shareObjectId),
          tx.pure.u64(pricePerShare),
        ],
      });

      const result = await executeTransaction(tx);
      toast.success("Listing created successfully!");
      return result;
    } catch (error: any) {
      toast.error(`Failed to create listing: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createProposal = async (
    channelId: string,
    title: string,
    description: string,
    contentUri: string,
    votingPeriod: number
  ) => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    if (!governanceRegistryId) {
      toast.error("Governance registry not configured");
      throw new Error("Governance registry not configured");
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::governance::create_proposal`,
        arguments: [
          tx.object(governanceRegistryId),
          tx.pure.string(channelId),
          tx.pure.string(title),
          tx.pure.string(description),
          tx.pure.string(contentUri),
          tx.pure.u64(votingPeriod),
        ],
      });

      const result = await executeTransaction(tx);
      toast.success("Proposal created successfully!");
      return result;
    } catch (error: any) {
      toast.error(`Failed to create proposal: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseShares = async (
    listingObjectId: string,
    amountToBuy: number,
    paymentCoin: string
  ) => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    if (!marketplaceId) {
      toast.error("Marketplace not configured");
      throw new Error("Marketplace not configured");
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::marketplace::purchase_shares`,
        arguments: [
          tx.object(marketplaceId),
          tx.object(listingObjectId),
          tx.object(paymentCoin),
          tx.pure.u64(amountToBuy),
        ],
      });

      const result = await executeTransaction(tx);
      toast.success("Shares purchased successfully!");
      return result;
    } catch (error: any) {
      toast.error(`Failed to purchase shares: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelListing = async (listingObjectId: string) => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::marketplace::cancel_listing`,
        arguments: [tx.object(listingObjectId)],
      });

      const result = await executeTransaction(tx);
      toast.success("Listing cancelled successfully!");
      return result;
    } catch (error: any) {
      toast.error(`Failed to cancel listing: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const castVote = async (
    proposalObjectId: string,
    shareObjectId: string,
    support: boolean
  ) => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::governance::cast_vote`,
        arguments: [
          tx.object(proposalObjectId),
          tx.object(shareObjectId),
          tx.pure.bool(support),
        ],
      });

      const result = await executeTransaction(tx);
      toast.success(
        `Vote cast successfully! You voted ${
          support ? "for" : "against"
        } the proposal.`
      );
      return result;
    } catch (error: any) {
      toast.error(`Failed to cast vote: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const executeProposal = async (proposalObjectId: string) => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${packageId}::governance::execute_proposal`,
        arguments: [tx.object(proposalObjectId)],
      });

      const result = await executeTransaction(tx);
      toast.success("Proposal executed successfully!");
      return result;
    } catch (error: any) {
      toast.error(`Failed to execute proposal: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Query functions
  const getOwnedChannels = async () => {
    if (!currentAccount) return [];

    try {
      const objects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${packageId}::channel_nft::Channel`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      return objects.data;
    } catch (error) {
      console.error("Error fetching owned channels:", error);
      return [];
    }
  };

  const getOwnedShares = async () => {
    if (!currentAccount) return [];

    try {
      const objects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${packageId}::channel_nft::ChannelShare`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      return objects.data;
    } catch (error) {
      console.error("Error fetching owned shares:", error);
      return [];
    }
  };

  const getMarketplaceListings = async () => {
    try {
      const objects = await suiClient.getOwnedObjects({
        owner: marketplaceId,
        filter: {
          StructType: `${packageId}::marketplace::Listing`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      return objects.data;
    } catch (error) {
      console.error("Error fetching marketplace listings:", error);
      return [];
    }
  };

  const getChannelProposals = async (channelId: string) => {
    try {
      // Get all proposal objects
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${packageId}::governance::ProposalCreated`,
        },
        order: "descending",
      });

      // Filter proposals for the specific channel
      const channelProposals = events.data.filter((event: any) => {
        return event.parsedJson?.channel_id === channelId;
      });

      return channelProposals;
    } catch (error) {
      console.error("Error fetching channel proposals:", error);
      return [];
    }
  };

  const getProposalObjects = async () => {
    try {
      // This would get all proposal objects from the blockchain
      // In a real implementation, you might want to use events or a different query method
      const objects = await suiClient.getOwnedObjects({
        owner: governanceRegistryId,
        filter: {
          StructType: `${packageId}::governance::Proposal`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      return objects.data;
    } catch (error) {
      console.error("Error fetching proposal objects:", error);
      return [];
    }
  };

  const getSuiBalance = async () => {
    if (!currentAccount) return "0";

    try {
      const balance = await suiClient.getBalance({
        owner: currentAccount.address,
      });
      return balance.totalBalance;
    } catch (error) {
      console.error("Error fetching SUI balance:", error);
      return "0";
    }
  };

  return {
    // State
    isLoading,
    isConnected: !!currentAccount,
    address: currentAccount?.address,

    // Channel operations
    createChannel,
    transferShares,
    splitShares,

    // Marketplace operations
    createListing,
    purchaseShares,
    cancelListing,

    // Governance operations
    createProposal,
    castVote,
    executeProposal,

    // Query operations
    getOwnedChannels,
    getOwnedShares,
    getMarketplaceListings,
    getChannelProposals,
    getProposalObjects,
    getSuiBalance,

    // Utils
    executeTransaction,
  };
};
