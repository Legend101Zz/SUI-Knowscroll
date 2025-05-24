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
    FaTimes,
    FaChevronRight,
    FaVoteYea,
    FaCheck,
    FaClock,
    FaUsers,
    FaPercent,
    FaFileAlt,
    FaExternalLinkAlt,
    FaGavel,
    FaThumbsUp,
    FaThumbsDown,
    FaArrowLeft,
    FaLightbulb,
    FaHistory,
    FaChartBar
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
    creator: string;
    totalShares: number;
    userShares?: number;
    userSharePercentage?: number;
    votingPower?: number;
}

interface Proposal {
    id: string;
    channelId: string;
    title: string;
    description: string;
    contentUri: string;
    startTime: number;
    endTime: number;
    proposer: string;
    forVotes: number;
    againstVotes: number;
    executed: boolean;
    passed: boolean;
    hasVoted?: boolean;
    status: 'active' | 'ended' | 'executed';
    forPercentage: number;
    againstPercentage: number;
}

// Channel Selector Component
const ChannelSelector = ({
    channels,
    selectedChannelId,
    onSelect,
    loading
}: {
    channels: Channel[];
    selectedChannelId?: string;
    onSelect: (channelId: string) => void;
    loading: boolean;
}) => {
    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-2"></div>
                <div className="text-white/70 text-sm">Loading your channels...</div>
            </div>
        );
    }

    if (channels.length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-white/70 mb-4">You don&apos;t own shares in any channels.</p>
                <Link
                    href="/create"
                    className="inline-flex items-center px-4 py-2 bg-background-lighter border border-white/10 rounded-lg hover:border-primary/30 transition-all"
                >
                    <FaChevronRight className="w-4 h-4 mr-2" />
                    Create Channel
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {channels.map(channel => (
                <button
                    key={channel.id}
                    onClick={() => onSelect(channel.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-all border text-left ${selectedChannelId === channel.id
                            ? 'bg-background-lighter border-primary/30'
                            : 'bg-background-dark/80 border-white/5 hover:border-white/20'
                        }`}
                >
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary/20 to-primary-secondary/20 flex items-center justify-center mr-3">
                        <span className="text-white/90 font-medium">#{channel.id.slice(0, 4)}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="font-medium truncate">{channel.name}</div>
                        <div className="text-xs text-white/50">Voting Power: {channel.votingPower?.toFixed(2) || 0}%</div>
                    </div>
                </button>
            ))}
        </div>
    );
};

// Proposal Card Component
const ProposalCard = ({
    proposal,
    onVote,
    onExecute,
    isVoting,
    isExecuting,
    votedProposalId
}: {
    proposal: Proposal;
    onVote: (proposalId: string, support: boolean) => void;
    onExecute: (proposalId: string) => void;
    isVoting: boolean;
    isExecuting: boolean;
    votedProposalId: string | null;
}) => {
    const [showVoteButtons, setShowVoteButtons] = useState(false);

    // Format time remaining
    const formatTimeRemaining = () => {
        if (proposal.status !== 'active') return null;

        const now = Math.floor(Date.now() / 1000);
        const timeLeft = proposal.endTime - now;

        if (timeLeft <= 0) return 'Ended';

        const days = Math.floor(timeLeft / 86400);
        const hours = Math.floor((timeLeft % 86400) / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h left`;
        if (hours > 0) return `${hours}h ${minutes}m left`;
        return `${minutes}m left`;
    };

    // Get status badge color and text
    const getStatusBadge = () => {
        switch (proposal.status) {
            case 'active':
                return {
                    bg: 'bg-primary/20',
                    text: 'text-primary',
                    label: 'Active'
                };
            case 'ended':
                return {
                    bg: 'bg-yellow-500/20',
                    text: 'text-yellow-500',
                    label: 'Ended (Unexecuted)'
                };
            case 'executed':
                return proposal.passed
                    ? { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Passed' }
                    : { bg: 'bg-red-500/20', text: 'text-red-500', label: 'Failed' };
            default:
                return {
                    bg: 'bg-white/20',
                    text: 'text-white',
                    label: 'Unknown'
                };
        }
    };

    const statusBadge = getStatusBadge();
    const timeRemaining = formatTimeRemaining();
    const isThisProposalVoting = isVoting && votedProposalId === proposal.id;
    const isThisProposalExecuting = isExecuting && votedProposalId === proposal.id;

    return (
        <motion.div
            className="bg-background-card/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all transform hover:translate-y-[-2px] duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className={`px-2 py-1 rounded-full ${statusBadge.bg} ${statusBadge.text} text-xs`}>
                        {statusBadge.label}
                    </div>

                    {timeRemaining && (
                        <div className="text-xs text-white/70 flex items-center">
                            <FaClock className="w-3 h-3 mr-1" />
                            {timeRemaining}
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-lg text-white mb-2">{proposal.title}</h3>

                <p className="text-white/70 text-sm mb-4">
                    {proposal.description}
                    {proposal.contentUri && (
                        <a
                            href={proposal.contentUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-primary hover:underline inline-flex items-center"
                        >
                            View details
                            <FaExternalLinkAlt className="w-3 h-3 ml-1" />
                        </a>
                    )}
                </p>

                {/* Voting progress bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/70 flex items-center">
                            <FaThumbsUp className="w-3 h-3 mr-1 text-green-500" />
                            For: {proposal.forVotes}
                        </span>
                        <span className="text-white/70 flex items-center">
                            <FaThumbsDown className="w-3 h-3 mr-1 text-red-500" />
                            Against: {proposal.againstVotes}
                        </span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="flex h-full">
                            <div
                                className="h-full bg-green-500/70"
                                style={{ width: `${proposal.forPercentage}%` }}
                            ></div>
                            <div
                                className="h-full bg-red-500/70"
                                style={{ width: `${proposal.againstPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-white/50">
                        <span>{proposal.forPercentage.toFixed(1)}%</span>
                        <span>{proposal.againstPercentage.toFixed(1)}%</span>
                    </div>
                </div>

                {/* Voting buttons or execution button */}
                {proposal.status === 'active' && !proposal.hasVoted && (
                    showVoteButtons ? (
                        <div className="flex space-x-2 items-center">
                            <button
                                onClick={() => {
                                    onVote(proposal.id, true);
                                    setShowVoteButtons(false);
                                }}
                                disabled={isVoting}
                                className="flex-1 py-2 bg-green-500/20 text-green-500 rounded-lg font-medium text-sm hover:bg-green-500/30 transition-all disabled:opacity-50 flex justify-center items-center"
                            >
                                {isThisProposalVoting ? (
                                    <>
                                        <div className="w-4 h-4 border-t-2 border-green-500 rounded-full animate-spin mr-2"></div>
                                        Voting...
                                    </>
                                ) : (
                                    <>
                                        <FaThumbsUp className="w-4 h-4 mr-2" />
                                        Vote For
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    onVote(proposal.id, false);
                                    setShowVoteButtons(false);
                                }}
                                disabled={isVoting}
                                className="flex-1 py-2 bg-red-500/20 text-red-500 rounded-lg font-medium text-sm hover:bg-red-500/30 transition-all disabled:opacity-50 flex justify-center items-center"
                            >
                                {isThisProposalVoting ? (
                                    <>
                                        <div className="w-4 h-4 border-t-2 border-red-500 rounded-full animate-spin mr-2"></div>
                                        Voting...
                                    </>
                                ) : (
                                    <>
                                        <FaThumbsDown className="w-4 h-4 mr-2" />
                                        Vote Against
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setShowVoteButtons(false)}
                                disabled={isVoting}
                                className="py-2 px-2 bg-background-dark border border-white/10 text-white rounded-lg hover:border-white/30 transition-all disabled:opacity-50"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowVoteButtons(true)}
                            className="w-full py-2 bg-gradient-to-r from-primary to-primary-secondary text-white rounded-lg font-medium text-sm hover:shadow-glow transition-all flex items-center justify-center"
                        >
                            <FaVoteYea className="w-4 h-4 mr-2" />
                            Cast Your Vote
                        </button>
                    )
                )}

                {proposal.status === 'active' && proposal.hasVoted && (
                    <div className="text-center py-2 px-4 bg-background-dark border border-white/10 rounded-lg text-sm flex items-center justify-center">
                        <FaCheck className="w-4 h-4 mr-2 text-green-500" />
                        You&apos;ve already voted on this proposal
                    </div>
                )}

                {proposal.status === 'ended' && !proposal.executed && (
                    <button
                        onClick={() => onExecute(proposal.id)}
                        disabled={isExecuting}
                        className="w-full py-2 bg-primary text-white rounded-lg font-medium text-sm hover:shadow-glow transition-all disabled:opacity-50 flex justify-center items-center"
                    >
                        {isThisProposalExecuting ? (
                            <>
                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                Executing...
                            </>
                        ) : (
                            <>
                                <FaGavel className="w-4 h-4 mr-2" />
                                Execute Proposal
                            </>
                        )}
                    </button>
                )}

                {proposal.status === 'executed' && (
                    <div className={`text-center py-2 px-4 rounded-lg text-sm flex items-center justify-center ${proposal.passed
                            ? 'bg-green-500/20 border border-green-500/30 text-green-500'
                            : 'bg-red-500/20 border border-red-500/30 text-red-500'
                        }`}>
                        <FaCheck className="w-4 h-4 mr-2" />
                        {proposal.passed ? 'Proposal passed' : 'Proposal failed'}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Create Proposal Modal Component
const CreateProposalModal = ({
    channelId,
    onClose,
    onCreateProposal,
    isCreating,
    minVotingPeriod = 86400 // Default 24 hours
}: {
    channelId: string;
    onClose: () => void;
    onCreateProposal: (proposalData: { title: string; description: string; contentUri: string; votingPeriod: number }) => Promise<void>;
    isCreating: boolean;
    minVotingPeriod?: number;
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [contentUri, setContentUri] = useState('');
    const [votingPeriod, setVotingPeriod] = useState(86400); // 24 hours in seconds

    // Voting period options
    const votingPeriodOptions = [
        { label: '1 day', value: 86400 },
        { label: '3 days', value: 259200 },
        { label: '1 week', value: 604800 },
        { label: '2 weeks', value: 1209600 }
    ];

    // Check if form is valid
    const isValid = title.trim().length > 0 && description.trim().length > 0 && contentUri.trim().length > 0 && votingPeriod >= minVotingPeriod;

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || isCreating) return;

        await onCreateProposal({
            title,
            description,
            contentUri,
            votingPeriod
        });
    };

    // Calculate min voting period in a readable format
    const formatMinVotingPeriod = () => {
        const hours = Math.floor(minVotingPeriod / 3600);
        if (hours < 24) return `${hours} hours`;

        const days = Math.floor(hours / 24);
        return `${days} day${days !== 1 ? 's' : ''}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <motion.div
                className="relative bg-background-card rounded-2xl border border-white/10 shadow-xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                >
                    <FaTimes className="w-5 h-5 text-white" />
                </button>

                <h2 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary">
                    Create New Proposal
                </h2>

                <p className="text-white/70 text-center mb-6">
                    For Channel #{channelId.slice(0, 8)}
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-white/70 text-sm mb-1">Proposal Title</label>
                        <input
                            type="text"
                            placeholder="Enter proposal title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 bg-background-dark rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-1">Description</label>
                        <textarea
                            placeholder="Describe your proposal in detail"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 bg-background-dark rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none text-white resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-1">Content URI (IPFS or other content link)</label>
                        <input
                            type="text"
                            placeholder="ipfs://... or https://..."
                            value={contentUri}
                            onChange={(e) => setContentUri(e.target.value)}
                            className="w-full px-4 py-2 bg-background-dark rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none text-white"
                            required
                        />
                        <p className="text-white/50 text-xs mt-1">
                            This should point to a document describing the proposed content direction.
                        </p>
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-1">Voting Period</label>
                        <select
                            value={votingPeriod}
                            onChange={(e) => setVotingPeriod(parseInt(e.target.value))}
                            className="w-full px-4 py-2 bg-background-dark rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none text-white"
                            required
                        >
                            {votingPeriodOptions.map(option => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.value < minVotingPeriod}
                                >
                                    {option.label} {option.value < minVotingPeriod ? `(min: ${formatMinVotingPeriod()})` : ''}
                                </option>
                            ))}
                        </select>
                        <p className="text-white/50 text-xs mt-1">
                            Minimum voting period is {formatMinVotingPeriod()}.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!isValid || isCreating}
                            className="w-full py-3 bg-gradient-to-r from-primary to-primary-secondary text-white rounded-lg font-medium hover:shadow-glow transition-all disabled:opacity-50 flex justify-center items-center"
                        >
                            {isCreating ? (
                                <>
                                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                    Creating Proposal...
                                </>
                            ) : (
                                <>
                                    <FaPlus className="w-5 h-5 mr-2" />
                                    Create Proposal
                                </>
                            )}
                        </button>
                    </div>

                    <div className="bg-background-dark rounded-lg p-4 border border-white/10">
                        <h4 className="font-medium text-white mb-2 flex items-center">
                            <FaLightbulb className="w-4 h-4 mr-2 text-primary" />
                            What makes a good proposal?
                        </h4>
                        <ul className="text-white/70 text-sm space-y-2">
                            <li className="flex items-start">
                                <FaCheck className="w-4 h-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                                <span>Clear description of the proposed content direction</span>
                            </li>
                            <li className="flex items-start">
                                <FaCheck className="w-4 h-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                                <span>Link to comprehensive content plan with examples</span>
                            </li>
                            <li className="flex items-start">
                                <FaCheck className="w-4 h-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                                <span>Explanation of how the proposal benefits the channel</span>
                            </li>
                            <li className="flex items-start">
                                <FaCheck className="w-4 h-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                                <span>Specific guidance for the AI content generator</span>
                            </li>
                        </ul>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// Main Governance Page Component
export default function GovernancePage() {
    const currentAccount = useCurrentAccount();
    const searchParams = useSearchParams();
    const channelParam = searchParams.get('channel');

    const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>(
        channelParam || undefined
    );

    const [channels, setChannels] = useState<Channel[]>([]);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creatingProposal, setCreatingProposal] = useState(false);
    const [minVotingPeriod, setMinVotingPeriod] = useState(3600); // Default 1 hour
    const [votingState, setVotingState] = useState({
        isVoting: false,
        proposalId: null as string | null
    });
    const [executingState, setExecutingState] = useState({
        isExecuting: false,
        proposalId: null as string | null
    });
    const [refreshCounter, setRefreshCounter] = useState(0);

    const {
        getOwnedChannels,
        getChannelProposals,
        createProposal,
        castVote,
        executeProposal
    } = useSuiContract();

    // Fetch user's channels with voting power
    useEffect(() => {
        const fetchUserChannels = async () => {
            if (!currentAccount) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const ownedChannels = await getOwnedChannels();

                // Transform the data to match our Channel interface
                const channelsData: Channel[] = ownedChannels.map((channel: any, index) => {
                    const totalShares = parseInt(channel.data?.content?.fields?.total_shares || '1000');
                    const userShares = parseInt(channel.data?.content?.fields?.user_shares || '100');
                    const votingPower = (userShares / totalShares) * 100;

                    return {
                        id: channel.data?.objectId || `channel-${index}`,
                        name: channel.data?.content?.fields?.name || `Channel #${index + 1}`,
                        description: channel.data?.content?.fields?.description || '',
                        category: channel.data?.content?.fields?.category || 'General',
                        creator: channel.data?.content?.fields?.creator || '',
                        totalShares,
                        userShares,
                        userSharePercentage: (userShares / totalShares) * 100,
                        votingPower
                    };
                });

                setChannels(channelsData);

                // If we have a selectedChannelId and it's not in the fetched channels, reset it
                if (selectedChannelId && !channelsData.some(c => c.id === selectedChannelId)) {
                    setSelectedChannelId(undefined);
                }
            } catch (error) {
                console.error("Error fetching user channels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserChannels();
    }, [currentAccount, getOwnedChannels, refreshCounter]);

    // Fetch proposals for selected channel
    useEffect(() => {
        const fetchProposals = async () => {
            if (!selectedChannelId) {
                setProposals([]);
                return;
            }

            try {
                setLoading(true);

                // For demo purposes, create some mock proposals
                // In a real implementation, this would fetch from the blockchain
                const mockProposals: Proposal[] = [
                    {
                        id: 'proposal-1',
                        channelId: selectedChannelId,
                        title: 'Focus on Quantum Computing Content',
                        description: 'Propose to shift the channel focus towards quantum computing topics, including quantum algorithms, quantum cryptography, and quantum hardware.',
                        contentUri: 'https://ipfs.io/ipfs/QmExample...',
                        startTime: Math.floor(Date.now() / 1000) - 86400, // Started 1 day ago
                        endTime: Math.floor(Date.now() / 1000) + 172800, // Ends in 2 days
                        proposer: '0x1234...5678',
                        forVotes: 150,
                        againstVotes: 75,
                        executed: false,
                        passed: false,
                        hasVoted: false,
                        status: 'active',
                        forPercentage: 66.7,
                        againstPercentage: 33.3
                    },
                    {
                        id: 'proposal-2',
                        channelId: selectedChannelId,
                        title: 'Introduce Interactive Coding Exercises',
                        description: 'Add interactive coding exercises to complement the video content, allowing viewers to practice what they learn.',
                        contentUri: 'https://ipfs.io/ipfs/QmExample2...',
                        startTime: Math.floor(Date.now() / 1000) - 259200, // Started 3 days ago
                        endTime: Math.floor(Date.now() / 1000) - 86400, // Ended 1 day ago
                        proposer: '0x9876...5432',
                        forVotes: 200,
                        againstVotes: 50,
                        executed: true,
                        passed: true,
                        hasVoted: true,
                        status: 'executed',
                        forPercentage: 80,
                        againstPercentage: 20
                    }
                ];

                // Sort proposals: active first, then ended unexecuted, then executed
                mockProposals.sort((a, b) => {
                    if (a.status !== b.status) {
                        if (a.status === 'active') return -1;
                        if (b.status === 'active') return 1;
                        if (a.status === 'ended') return -1;
                        if (b.status === 'ended') return 1;
                    }
                    return b.endTime - a.endTime;
                });

                setProposals(mockProposals);
            } catch (error) {
                console.error("Error fetching proposals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, [selectedChannelId, refreshCounter]);

    // Handle channel selection
    const handleChannelSelect = (channelId: string) => {
        setSelectedChannelId(channelId);
    };

    // Handle proposal creation
    const handleCreateProposal = async (proposalData: { title: string; description: string; contentUri: string; votingPeriod: number }) => {
        if (!currentAccount || !selectedChannelId) return;

        try {
            setCreatingProposal(true);

            await createProposal(
                selectedChannelId,
                proposalData.title,
                proposalData.description,
                proposalData.contentUri,
                proposalData.votingPeriod
            );

            setShowCreateModal(false);
            setRefreshCounter(prev => prev + 1);
        } catch (error) {
            console.error("Error creating proposal:", error);
        } finally {
            setCreatingProposal(false);
        }
    };

    // Handle voting on a proposal
    const handleVoteOnProposal = async (proposalId: string, support: boolean) => {
        if (!currentAccount) return;

        try {
            setVotingState({
                isVoting: true,
                proposalId
            });

            // In a real implementation, you'd need to select the correct share object
            await castVote(proposalId, 'share-object-id', support);

            setRefreshCounter(prev => prev + 1);
        } catch (error) {
            console.error("Error voting on proposal:", error);
        } finally {
            setVotingState({
                isVoting: false,
                proposalId: null
            });
        }
    };

    // Handle executing a proposal
    const handleExecuteProposal = async (proposalId: string) => {
        if (!currentAccount) return;

        try {
            setExecutingState({
                isExecuting: true,
                proposalId
            });

            await executeProposal(proposalId);
            setRefreshCounter(prev => prev + 1);
        } catch (error) {
            console.error("Error executing proposal:", error);
        } finally {
            setExecutingState({
                isExecuting: false,
                proposalId: null
            });
        }
    };

    // Count proposal stats
    const proposalStats = {
        total: proposals.length,
        active: proposals.filter(p => p.status === 'active').length,
        passed: proposals.filter(p => p.status === 'executed' && p.passed).length,
        failed: proposals.filter(p => p.status === 'executed' && !p.passed).length
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
                        <h2 className="text-xl font-semibold mr-2 hidden sm:block">Governance</h2>
                        <WalletConnect />
                    </div>
                </div>
            </header>

            <main className="relative z-10 py-8 px-6 max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="relative z-10 mb-10">
                    <div className="flex flex-col md:flex-row gap-2 mb-4">
                        <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-background-lighter/80 backdrop-blur-sm border border-primary/20">
                            <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></div>
                            <span className="text-white/80">Channel Governance</span>
                        </div>

                        <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30">
                            <span className="text-yellow-500 font-medium">TESTNET MODE</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary">
                                    Channel Governance
                                </span>
                            </h1>

                            <p className="text-white/70 text-lg max-w-2xl">
                                Shape the future of content through democratic decision making. Create and vote on proposals to direct channel content.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Governance introduction for non-connected users */}
                {!currentAccount && (
                    <div className="mb-10 bg-background-card/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                                Decentralized Content Governance Explained
                            </h2>

                            <div className="mb-8">
                                <p className="text-white/80 mb-4">
                                    KnowScroll&apos;s governance system allows channel stakeholders to collectively decide on content direction.
                                    As a token holder, your voting power is proportional to your share ownership.
                                </p>

                                <p className="text-white/80 mb-6">
                                    <span className="text-primary font-medium">Approved proposals directly guide our AI agents</span> to automatically
                                    generate educational videos and content. After a proposal passes, the AI will create draft content based on
                                    the approved direction, which stakeholders can review before public release.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                    <div className="bg-background-dark/80 rounded-xl p-5 border border-white/10 flex flex-col">
                                        <div className="mb-4 flex justify-center">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <FaFileAlt className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium mb-2 text-center">Propose</h3>
                                        <p className="text-white/70 text-sm text-center">
                                            Any member with at least 5% ownership can create a proposal with a content direction plan.
                                        </p>
                                    </div>

                                    <div className="bg-background-dark/80 rounded-xl p-5 border border-white/10 flex flex-col">
                                        <div className="mb-4 flex justify-center">
                                            <div className="w-12 h-12 rounded-lg bg-primary-secondary/10 flex items-center justify-center">
                                                <FaVoteYea className="w-6 h-6 text-primary-secondary" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium mb-2 text-center">Vote</h3>
                                        <p className="text-white/70 text-sm text-center">
                                            Shareholders vote for or against proposals during the voting period.
                                        </p>
                                    </div>

                                    <div className="bg-background-dark/80 rounded-xl p-5 border border-white/10 flex flex-col">
                                        <div className="mb-4 flex justify-center">
                                            <div className="w-12 h-12 rounded-lg bg-primary-light/10 flex items-center justify-center">
                                                <FaGavel className="w-6 h-6 text-primary-light" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium mb-2 text-center">Execute</h3>
                                        <p className="text-white/70 text-sm text-center">
                                            After voting ends, passed proposals automatically direct the AI to create new content.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <WalletConnect />
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Grid Layout */}
                {currentAccount && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div>
                            <div className="bg-background-card/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
                                <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                                    Your Channels
                                </h2>

                                <p className="text-white/70 text-sm mb-4">
                                    Select a channel to view and create proposals.
                                </p>

                                <div className="mb-6">
                                    <ChannelSelector
                                        channels={channels}
                                        selectedChannelId={selectedChannelId}
                                        onSelect={handleChannelSelect}
                                        loading={loading}
                                    />
                                </div>

                                {selectedChannelId && (
                                    <div className="mt-6">
                                        <button
                                            onClick={() => setShowCreateModal(true)}
                                            className="w-full py-3 bg-gradient-to-r from-primary to-primary-secondary text-white rounded-lg font-medium hover:shadow-glow transition-all flex items-center justify-center"
                                        >
                                            <FaPlus className="w-5 h-5 mr-2" />
                                            Create New Proposal
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Governance Info */}
                            <div className="bg-background-card/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-secondary to-primary-light">
                                    Governance Stats
                                </h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Total Proposals</span>
                                        <span className="font-medium">{proposalStats.total}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Active Voting</span>
                                        <span className="font-medium">{proposalStats.active}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Passed Proposals</span>
                                        <span className="font-medium">{proposalStats.passed}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Failed Proposals</span>
                                        <span className="font-medium">{proposalStats.failed}</span>
                                    </div>
                                </div>

                                <div className="bg-background-dark p-4 rounded-lg border border-white/10">
                                    <h4 className="font-medium mb-2 flex items-center">
                                        <FaLightbulb className="w-4 h-4 mr-2 text-primary" />
                                        How It Works
                                    </h4>
                                    <ul className="text-white/70 text-sm space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-primary mr-2">1.</span>
                                            <span>Propose content direction with a clear plan</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-primary mr-2">2.</span>
                                            <span>Shareholders vote with weight based on shares</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-primary mr-2">3.</span>
                                            <span>Majority vote determines content strategy</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-primary mr-2">4.</span>
                                            <span>AI generates draft videos based on approved proposals</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-primary mr-2">5.</span>
                                            <span>Stakeholders review drafts before public release</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {selectedChannelId ? (
                                <>
                                    <div className="bg-background-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                        <h2 className="text-xl font-bold mb-6 flex items-center">
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary">
                                                Channel #{selectedChannelId.slice(0, 8)} Proposals
                                            </span>
                                            <div className="ml-3 h-px flex-grow bg-gradient-to-r from-primary/50 to-transparent"></div>
                                        </h2>

                                        {loading ? (
                                            <div className="flex flex-col items-center justify-center py-12">
                                                <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin mb-4"></div>
                                                <p className="text-white/70">Loading proposals...</p>
                                            </div>
                                        ) : proposals.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {proposals.map(proposal => (
                                                    <ProposalCard
                                                        key={proposal.id}
                                                        proposal={proposal}
                                                        onVote={handleVoteOnProposal}
                                                        onExecute={handleExecuteProposal}
                                                        isVoting={votingState.isVoting}
                                                        isExecuting={executingState.isExecuting}
                                                        votedProposalId={votingState.proposalId || executingState.proposalId}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-background-dark/30 rounded-xl p-8 text-center border border-white/5">
                                                <div className="w-16 h-16 rounded-full bg-background-lighter border border-white/10 flex items-center justify-center mx-auto mb-4">
                                                    <FaFileAlt className="w-8 h-8 text-white/50" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">No Proposals Yet</h3>
                                                <p className="text-white/70 mb-6 max-w-md mx-auto">
                                                    Be the first to propose a new content direction for this channel.
                                                </p>
                                                <button
                                                    onClick={() => setShowCreateModal(true)}
                                                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary-secondary text-white rounded-full font-medium hover:shadow-glow transition-all inline-flex items-center"
                                                >
                                                    <FaPlus className="w-5 h-5 mr-2" />
                                                    Create First Proposal
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="bg-background-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                                    <div className="max-w-md mx-auto">
                                        <div className="w-20 h-20 rounded-full bg-background-dark border border-white/10 flex items-center justify-center mx-auto mb-6">
                                            <FaGavel className="w-10 h-10 text-white/50" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary">
                                            Select a Channel
                                        </h2>
                                        <p className="text-white/70 mb-6">
                                            Choose a channel from the sidebar to view and create governance proposals.
                                        </p>

                                        {channels.length === 0 && !loading && (
                                            <Link
                                                href="/create"
                                                className="px-6 py-3 bg-gradient-to-r from-primary to-primary-secondary text-white rounded-full font-medium hover:shadow-glow transition-all inline-flex items-center"
                                            >
                                                <FaUsers className="w-5 h-5 mr-2" />
                                                Create Your First Channel
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Create Proposal Modal */}
            <AnimatePresence>
                {showCreateModal && selectedChannelId && (
                    <CreateProposalModal
                        channelId={selectedChannelId}
                        onClose={() => setShowCreateModal(false)}
                        onCreateProposal={handleCreateProposal}
                        isCreating={creatingProposal}
                        minVotingPeriod={minVotingPeriod}
                    />
                )}
            </AnimatePresence>

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