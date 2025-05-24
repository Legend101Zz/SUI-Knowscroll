"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiContract } from '@/hooks/useSuiContract';
import WalletConnect from '@/components/WalletConnect';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import {
    FaHome,
    FaCompass,
    FaUser,
    FaPlay,
    FaPlus,
    FaWallet,
    FaShoppingCart,
    FaTimes,
    FaExternalLinkAlt,
    FaChevronRight,
    FaTag,
    FaUsers,
    FaPercent,
    FaCoins,
    FaArrowRight,
    FaArrowLeft
} from 'react-icons/fa';

// Background animation component
const BackgroundAnimation = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) - 0.5,
                y: (e.clientY / window.innerHeight) - 0.5
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
            <div
                className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-primary-500 to-primary-800 blur-3xl -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out"
                style={{
                    transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
                }}
            />
            <div
                className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-tr from-primary-secondary to-primary-800 blur-3xl translate-x-1/3 translate-y-1/3 transition-transform duration-500 ease-out"
                style={{
                    transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`
                }}
            />
            <div
                className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 blur-2xl transition-transform duration-500 ease-out"
                style={{
                    transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`
                }}
            />
        </div>
    );
};

// Types
interface Channel {
    id: string;
    name: string;
    description: string;
    category: string;
    totalShares: number;
    userShares?: number;
    userSharePercentage?: number;
}

interface Listing {
    id: string;
    seller: string;
    channelId: string;
    channelName: string;
    amount: number;
    pricePerShare: number;
    totalPrice: number;
    listedAt: number;
    category: string;
}

interface MarketStats {
    totalListings: number;
    totalVolume: string;
    averagePrice: string;
}

// Channel Selector Component
const ChannelSelector = ({
    channels,
    onSelect,
    loading
}: {
    channels: Channel[];
    onSelect: (channelId: string) => void;
    loading: boolean;
}) => {
    const [showAll, setShowAll] = useState(false);

    const userOwnedChannels = channels.filter(c => (c.userShares || 0) > 0);
    const displayedChannels = showAll ? userOwnedChannels : userOwnedChannels.slice(0, 3);

    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-2"></div>
                <div className="text-white/70 text-sm">Loading your channels...</div>
            </div>
        );
    }

    if (userOwnedChannels.length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-white/70 mb-4">You don&apos;t own shares in any channels yet.</p>
                <Link
                    href="/channels"
                    className="inline-flex items-center px-4 py-2 bg-background-lighter border border-white/10 rounded-lg hover:border-primary/30 transition-all"
                >
                    <FaChevronRight className="w-4 h-4 mr-2" />
                    Browse Channels
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {displayedChannels.map(channel => (
                <button
                    key={channel.id}
                    onClick={() => onSelect(channel.id)}
                    className="w-full flex items-center p-3 rounded-lg bg-background-dark hover:bg-background-lighter transition-all border border-white/5 hover:border-primary/30 text-left"
                >
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary/20 to-primary-secondary/20 flex items-center justify-center mr-3">
                        <span className="text-white/90 font-medium">#{channel.id}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="font-medium truncate">{channel.name}</div>
                        <div className="text-xs text-white/50">You own {channel.userSharePercentage?.toFixed(2) || 0}%</div>
                    </div>
                    <div className="ml-2 text-sm bg-primary/20 text-primary-light rounded-full px-2 py-0.5">
                        {channel.userShares} shares
                    </div>
                </button>
            ))}

            {userOwnedChannels.length > 3 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full text-sm text-center text-white/60 hover:text-white/80 transition-colors py-2"
                >
                    {showAll ? 'Show Less' : `Show ${userOwnedChannels.length - 3} More`}
                </button>
            )}
        </div>
    );
};

// Listing Card Component
const ListingCard = ({
    listing,
    onPurchase,
    isPurchasing,
    currentUserAddress
}: {
    listing: Listing;
    onPurchase: (listingId: string, amount: number) => void;
    isPurchasing: boolean;
    currentUserAddress?: string;
}) => {
    const [purchaseAmount, setPurchaseAmount] = useState(1);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    const isOwnListing = listing.seller === currentUserAddress;
    const maxPurchase = listing.amount;
    const totalCost = (purchaseAmount * listing.pricePerShare).toFixed(4);

    const formatSuiAmount = (amount: number) => {
        return (amount / 1_000_000_000).toFixed(4);
    };

    const timeAgo = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return `${minutes}m ago`;
    };

    const handlePurchaseSubmit = () => {
        onPurchase(listing.id, purchaseAmount);
        setShowPurchaseModal(false);
        setPurchaseAmount(1);
    };

    return (
        <>
            <motion.div
                className="bg-background-card border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all transform hover:translate-y-[-2px] duration-300"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary-secondary/20 flex items-center justify-center mr-3">
                                <span className="text-primary-light font-bold">#{listing.channelId}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{listing.channelName}</h3>
                                <div className="flex items-center text-sm text-white/70">
                                    <FaTag className="w-3 h-3 mr-1" />
                                    {listing.category}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-white/50">{timeAgo(listing.listedAt)}</div>
                            {isOwnListing && (
                                <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full mt-1">
                                    Your Listing
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-background-dark rounded-lg p-3">
                            <div className="text-white/60 text-xs mb-1">Available Shares</div>
                            <div className="font-bold text-lg flex items-center">
                                <FaUsers className="w-4 h-4 mr-2 text-primary-light" />
                                {listing.amount}
                            </div>
                        </div>
                        <div className="bg-background-dark rounded-lg p-3">
                            <div className="text-white/60 text-xs mb-1">Price per Share</div>
                            <div className="font-bold text-lg flex items-center">
                                <FaCoins className="w-4 h-4 mr-2 text-primary-secondary" />
                                {formatSuiAmount(listing.pricePerShare)} SUI
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 to-primary-secondary/10 rounded-lg p-3 mb-4">
                        <div className="text-white/60 text-xs mb-1">Total Value</div>
                        <div className="font-bold text-xl text-primary-light">
                            {formatSuiAmount(listing.totalPrice)} SUI
                        </div>
                    </div>

                    <div className="text-xs text-white/50 mb-4">
                        Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                    </div>

                    <button
                        onClick={() => setShowPurchaseModal(true)}
                        disabled={isOwnListing || isPurchasing}
                        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center ${isOwnListing
                            ? 'bg-white/10 text-white/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary to-primary-secondary text-white hover:shadow-glow'
                            }`}
                    >
                        {isOwnListing ? (
                            'Your Listing'
                        ) : isPurchasing ? (
                            <>
                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                Purchasing...
                            </>
                        ) : (
                            <>
                                <FaShoppingCart className="w-4 h-4 mr-2" />
                                Purchase Shares
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Purchase Modal */}
            <AnimatePresence>
                {showPurchaseModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPurchaseModal(false)}
                    >
                        <motion.div
                            className="bg-background-card border border-white/10 rounded-2xl p-6 w-full max-w-md"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Purchase Shares</h2>
                                <button
                                    onClick={() => setShowPurchaseModal(false)}
                                    className="text-white/50 hover:text-white"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Channel</label>
                                    <div className="bg-background-dark rounded-lg p-3">
                                        <div className="font-medium">{listing.channelName}</div>
                                        <div className="text-sm text-white/60">Channel #{listing.channelId}</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">
                                        Amount to Purchase (max: {maxPurchase})
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={maxPurchase}
                                        value={purchaseAmount}
                                        onChange={(e) => setPurchaseAmount(Math.min(maxPurchase, Math.max(1, parseInt(e.target.value) || 1)))}
                                        className="w-full px-4 py-2 bg-background-dark border border-white/20 rounded-lg focus:border-primary/50 focus:outline-none"
                                    />
                                </div>

                                <div className="bg-gradient-to-r from-primary/10 to-primary-secondary/10 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white/70">Price per share:</span>
                                        <span className="font-medium">{formatSuiAmount(listing.pricePerShare)} SUI</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Total cost:</span>
                                        <span className="font-bold text-lg text-primary-light">{totalCost} SUI</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePurchaseSubmit}
                                    disabled={purchaseAmount < 1 || purchaseAmount > maxPurchase}
                                    className="w-full py-3 bg-gradient-to-r from-primary to-primary-secondary text-white rounded-lg font-medium hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm Purchase
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// Create Listing Component
const CreateListing = ({
    channelId,
    onSuccess
}: {
    channelId: string;
    onSuccess: () => void;
}) => {
    const [pricePerShare, setPricePerShare] = useState('');
    const [amount, setAmount] = useState('');
    const { createListing, isLoading } = useSuiContract();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!pricePerShare || !amount) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            // Convert price to MIST (1 SUI = 1,000,000,000 MIST)
            const priceInMist = Math.floor(parseFloat(pricePerShare) * 1_000_000_000);

            await createListing(channelId, priceInMist);
            setPricePerShare('');
            setAmount('');
            onSuccess();
        } catch (error) {
            console.error('Failed to create listing:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-white/70 text-sm mb-2">Price per Share (SUI)</label>
                <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={pricePerShare}
                    onChange={(e) => setPricePerShare(e.target.value)}
                    placeholder="0.0000"
                    className="w-full px-4 py-2 bg-background-dark border border-white/20 rounded-lg focus:border-primary/50 focus:outline-none"
                    required
                />
            </div>

            <div>
                <label className="block text-white/70 text-sm mb-2">Number of Shares</label>
                <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1"
                    className="w-full px-4 py-2 bg-background-dark border border-white/20 rounded-lg focus:border-primary/50 focus:outline-none"
                    required
                />
            </div>

            {pricePerShare && amount && (
                <div className="bg-gradient-to-r from-primary/10 to-primary-secondary/10 rounded-lg p-3">
                    <div className="text-white/70 text-sm mb-1">Total listing value</div>
                    <div className="font-bold text-lg text-primary-light">
                        {(parseFloat(pricePerShare) * parseInt(amount || '0')).toFixed(4)} SUI
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !pricePerShare || !amount}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary-secondary text-white rounded-lg font-medium hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                        Creating Listing...
                    </>
                ) : (
                    <>
                        <FaPlus className="w-4 h-4 mr-2" />
                        Create Listing
                    </>
                )}
            </button>
        </form>
    );
};

// Main Marketplace Page Component
export default function MarketplacePage() {
    const currentAccount = useCurrentAccount();
    const searchParams = useSearchParams();
    const channelParam = searchParams.get('channel');

    const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>(
        channelParam || undefined
    );
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loadingChannels, setLoadingChannels] = useState(true);
    const [loadingListings, setLoadingListings] = useState(true);
    const [marketStats, setMarketStats] = useState<MarketStats>({
        totalListings: 0,
        totalVolume: '0',
        averagePrice: '0'
    });
    const [purchasingListing, setPurchasingListing] = useState<string | null>(null);

    const {
        getOwnedChannels,
        getMarketplaceListings,
        purchaseShares,
        getSuiBalance
    } = useSuiContract();

    // Fetch user channels
    useEffect(() => {
        const fetchUserChannels = async () => {
            if (!currentAccount) {
                setLoadingChannels(false);
                return;
            }

            try {
                setLoadingChannels(true);
                const ownedChannels = await getOwnedChannels();

                // Transform the data to match our Channel interface
                const channelsData: Channel[] = ownedChannels.map((channel: any, index) => ({
                    id: channel.data?.objectId || `channel-${index}`,
                    name: channel.data?.content?.fields?.name || `Channel #${index + 1}`,
                    description: channel.data?.content?.fields?.description || '',
                    category: channel.data?.content?.fields?.category || 'General',
                    totalShares: parseInt(channel.data?.content?.fields?.total_shares || '1000'),
                    userShares: parseInt(channel.data?.content?.fields?.user_shares || '100'),
                    userSharePercentage: 10 // This would be calculated based on actual shares
                }));

                setChannels(channelsData);
            } catch (error) {
                console.error("Error fetching user channels:", error);
            } finally {
                setLoadingChannels(false);
            }
        };

        fetchUserChannels();
    }, [currentAccount, getOwnedChannels, refreshCounter]);

    // Fetch marketplace listings
    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoadingListings(true);
                const marketplaceListings = await getMarketplaceListings();

                // Transform the data to match our Listing interface
                const listingsData: Listing[] = marketplaceListings.map((listing: any, index) => ({
                    id: listing.data?.objectId || `listing-${index}`,
                    seller: listing.data?.content?.fields?.seller || '',
                    channelId: listing.data?.content?.fields?.channel_id || `${index + 1}`,
                    channelName: `Channel #${listing.data?.content?.fields?.channel_id || index + 1}`,
                    amount: parseInt(listing.data?.content?.fields?.amount || '100'),
                    pricePerShare: parseInt(listing.data?.content?.fields?.price_per_share || '1000000000'),
                    totalPrice: parseInt(listing.data?.content?.fields?.total_price || '100000000000'),
                    listedAt: parseInt(listing.data?.content?.fields?.listed_at || Date.now().toString()),
                    category: 'General'
                }));

                // Filter by selected channel if one is selected
                const filteredListings = selectedChannelId
                    ? listingsData.filter(listing => listing.channelId === selectedChannelId)
                    : listingsData;

                setListings(filteredListings);

                // Calculate market stats
                const stats: MarketStats = {
                    totalListings: listingsData.length,
                    totalVolume: '0', // Would need to track historical data
                    averagePrice: listingsData.length > 0
                        ? (listingsData.reduce((sum, listing) => sum + listing.pricePerShare, 0) / listingsData.length / 1_000_000_000).toFixed(4)
                        : '0'
                };
                setMarketStats(stats);

            } catch (error) {
                console.error("Error fetching marketplace listings:", error);
            } finally {
                setLoadingListings(false);
            }
        };

        fetchListings();
    }, [getMarketplaceListings, selectedChannelId, refreshCounter]);

    // Handle channel selection
    const handleChannelSelect = (channelId: string) => {
        setSelectedChannelId(channelId);
    };

    // Handle listing creation success
    const handleListingCreated = () => {
        setRefreshCounter(prev => prev + 1);
        toast.success('Listing created successfully!');
    };

    // Handle share purchase
    const handlePurchaseShares = async (listingId: string, amount: number) => {
        if (!currentAccount) {
            toast.error('Please connect your wallet');
            return;
        }

        try {
            setPurchasingListing(listingId);

            // Get user's SUI balance for payment
            const balance = await getSuiBalance();

            // In a real implementation, you'd need to select the correct coin object
            // For now, we'll use a placeholder
            await purchaseShares(listingId, amount, 'payment-coin-object-id');

            setRefreshCounter(prev => prev + 1);
        } catch (error) {
            console.error('Failed to purchase shares:', error);
        } finally {
            setPurchasingListing(null);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            <BackgroundAnimation />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1a1522',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                }}
            />

            {/* Header */}
            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <Link href="/">
                        <div className="flex items-center">
                            <motion.div
                                className="w-10 h-10 bg-gradient-to-tr from-primary to-primary-secondary rounded-full flex items-center justify-center shadow-lg mr-3"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-xl font-bold">K</span>
                            </motion.div>
                            <motion.h1
                                className="text-xl font-bold hidden md:block"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                KnowScroll
                            </motion.h1>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold mr-2 hidden sm:block">Marketplace</h2>
                        <WalletConnect />
                    </div>
                </div>
            </header>

            <main className="relative z-10 py-8 px-6 max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="relative z-10 mb-12">
                    <div className="flex flex-col md:flex-row gap-2 mb-4">
                        <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-background-lighter/80 backdrop-blur-sm border border-primary/20">
                            <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></div>
                            <span className="text-white/80">SUI Blockchain Marketplace</span>
                        </div>

                        <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30">
                            <span className="text-yellow-500 font-medium">TESTNET MODE</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary">
                                    Channel Marketplace
                                </span>
                            </h1>

                            <p className="text-white/70 text-lg max-w-2xl">
                                {selectedChannelId
                                    ? `Trading shares for Channel #${selectedChannelId} — Acquire ownership and earn revenue as content grows.`
                                    : 'Discover, buy and sell channel shares. Own a piece of your favorite educational content creators.'
                                }
                            </p>
                        </div>

                        {selectedChannelId && (
                            <div>
                                <button
                                    onClick={() => setSelectedChannelId(undefined)}
                                    className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all"
                                >
                                    <FaArrowLeft className="h-4 w-4 mr-2" />
                                    All Channels
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Market Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-background-card/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-all">
                            <div className="text-white/60 text-sm mb-1">Active Listings</div>
                            <div className="flex items-end">
                                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary">
                                    {loadingListings ? (
                                        <div className="h-8 w-20 bg-gradient-to-r from-background-lighter to-background-dark animate-pulse rounded"></div>
                                    ) : (
                                        marketStats.totalListings
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-background-card/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-primary-secondary/30 transition-all">
                            <div className="text-white/60 text-sm mb-1">Average Price</div>
                            <div className="flex items-end">
                                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-secondary to-primary">
                                    {loadingListings ? (
                                        <div className="h-8 w-20 bg-gradient-to-r from-background-lighter to-background-dark animate-pulse rounded"></div>
                                    ) : (
                                        marketStats.averagePrice
                                    )}
                                </div>
                                <div className="ml-1 text-white/60 text-sm">SUI per share</div>
                            </div>
                        </div>

                        <div className="bg-background-card/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-all">
                            <div className="text-white/60 text-sm mb-1">Network</div>
                            <div className="flex items-center">
                                <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                                    SUI Testnet
                                </div>
                                <div className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        {/* Marketplace Listings */}
                        <div className="bg-background-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary">
                                    {selectedChannelId
                                        ? `Channel #${selectedChannelId} Listings`
                                        : 'Available Listings'}
                                </span>
                                <div className="ml-3 h-px flex-grow bg-gradient-to-r from-primary/50 to-transparent"></div>
                            </h2>

                            {loadingListings ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin mb-4"></div>
                                    <p className="text-white/70">Loading listings...</p>
                                </div>
                            ) : listings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {listings.map(listing => (
                                        <ListingCard
                                            key={listing.id}
                                            listing={listing}
                                            onPurchase={handlePurchaseShares}
                                            isPurchasing={purchasingListing === listing.id}
                                            currentUserAddress={currentAccount?.address}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-background-dark/30 rounded-xl p-8 text-center border border-white/5">
                                    <div className="w-16 h-16 rounded-full bg-background-lighter border border-white/10 flex items-center justify-center mx-auto mb-4">
                                        <FaShoppingCart className="w-8 h-8 text-white/50" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No Listings Available</h3>
                                    <p className="text-white/70 mb-6 max-w-md mx-auto">
                                        {selectedChannelId
                                            ? `No listings found for Channel #${selectedChannelId}. Be the first to create one!`
                                            : 'No listings available at the moment. Check back later or create your own listing.'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        {currentAccount && selectedChannelId && (
                            <div className="bg-background-card/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary-secondary/20 transition-all mb-6">
                                <div className="mb-5">
                                    <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-secondary to-primary">
                                        Create a Listing
                                    </h3>
                                    <p className="text-white/70 text-sm mb-4">
                                        Set the price and amount of shares you want to sell for Channel #{selectedChannelId}.
                                    </p>
                                </div>

                                <CreateListing
                                    channelId={selectedChannelId}
                                    onSuccess={handleListingCreated}
                                />
                            </div>
                        )}

                        {currentAccount && !selectedChannelId && (
                            <div className="bg-background-card/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/20 transition-all mb-6">
                                <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                                    Your Shares
                                </h3>
                                <p className="text-white/70 mb-4">
                                    Select a channel to create a listing and sell your shares.
                                </p>

                                <div className="mb-6">
                                    <ChannelSelector
                                        channels={channels}
                                        onSelect={handleChannelSelect}
                                        loading={loadingChannels}
                                    />
                                </div>

                                <div className="relative mt-4">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-secondary rounded-full blur opacity-30"></div>
                                    <Link
                                        href="/channels"
                                        className="relative block w-full py-3 px-4 bg-background-lighter text-white text-center rounded-full hover:shadow-glow transition-all border border-white/10 font-medium"
                                    >
                                        Browse All Channels
                                    </Link>
                                </div>
                            </div>
                        )}

                        {!currentAccount && (
                            <div className="bg-background-card/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/20 transition-all mb-6">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-background-lighter border border-white/10 flex items-center justify-center mb-4">
                                        <FaWallet className="h-8 w-8 text-white/50" />
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary">
                                        Connect Wallet
                                    </h3>

                                    <p className="text-white/70 text-center mb-6">
                                        Connect your wallet to buy shares or create listings.
                                    </p>
                                </div>

                                <WalletConnect />
                            </div>
                        )}

                        {/* Market Insights */}
                        <div className="bg-background-card/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-primary">
                                Market Insights
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Active Listings</span>
                                    <span className="font-medium">{marketStats.totalListings}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Avg Price Per Share</span>
                                    <span className="font-medium">{marketStats.averagePrice} SUI</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Network</span>
                                    <span className="font-medium text-primary-light">SUI Testnet</span>
                                </div>

                                <div className="h-px w-full bg-white/10 my-4"></div>

                                <div className="bg-background-dark/80 rounded-lg p-3">
                                    <div className="text-sm font-medium mb-2">How It Works</div>
                                    <ul className="text-white/70 text-xs space-y-1">
                                        <li>• Buy shares to gain ownership in channels</li>
                                        <li>• Earn revenue as content grows</li>
                                        <li>• Vote on governance proposals</li>
                                        <li>• Trade shares anytime on the marketplace</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Navigation */}
            <motion.div
                className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-t border-white/5 flex items-center justify-around z-30"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 100,
                    delay: 0.3
                }}
            >
                <Link href="/">
                    <motion.div
                        className="flex flex-col items-center justify-center w-16"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaHome className="text-xl mb-1 text-white/80" />
                        <span className="text-xs text-white/60">Home</span>
                    </motion.div>
                </Link>

                <Link href="/explore">
                    <motion.div
                        className="flex flex-col items-center justify-center w-16"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaCompass className="text-xl mb-1 text-white/80" />
                        <span className="text-xs text-white/60">Explore</span>
                    </motion.div>
                </Link>

                <Link href="/create">
                    <motion.div
                        className="flex flex-col items-center justify-center -mt-8 relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary-secondary flex items-center justify-center shadow-lg"
                            animate={{
                                boxShadow: [
                                    "0 0 0px rgba(143, 70, 193, 0.3)",
                                    "0 0 20px rgba(143, 70, 193, 0.5)",
                                    "0 0 0px rgba(143, 70, 193, 0.3)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <FaPlus className="text-xl" />
                        </motion.div>
                        <span className="text-xs text-primary-light mt-1">Create</span>
                    </motion.div>
                </Link>

                <Link href="/feed">
                    <motion.div
                        className="flex flex-col items-center justify-center w-16"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPlay className="text-xl mb-1 text-white/80" />
                        <span className="text-xs text-white/60">Feed</span>
                    </motion.div>
                </Link>

                <Link href="/profile">
                    <motion.div
                        className="flex flex-col items-center justify-center w-16"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaUser className="text-xl mb-1 text-white/80" />
                        <span className="text-xs text-white/60">Profile</span>
                    </motion.div>
                </Link>
            </motion.div>
        </div>
    );
}