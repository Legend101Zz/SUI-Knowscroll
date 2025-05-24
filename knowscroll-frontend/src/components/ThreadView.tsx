/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, } from 'framer-motion';
import { FaSearch, FaTimes, FaCheck, FaPlay, FaUsers, FaArrowLeft, FaUserPlus, FaPaperPlane, } from 'react-icons/fa';
import { Thread, User } from '@/types';
import { threads } from '@/data/threads';
import { users } from '@/data/users';
import { reels } from '@/data/reels';

interface ThreadViewProps {
    threadId?: string;
    initialParticipants?: User[];
    onClose: () => void;
    onCreateThread?: (participants: User[]) => void;
}

export default function ThreadView({
    threadId,
    initialParticipants = [],
    onClose,
    onCreateThread
}: ThreadViewProps) {
    // Core state
    const [thread, setThread] = useState<Thread | null>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedFriends, setSelectedFriends] = useState<User[]>(initialParticipants);
    const [step, setStep] = useState<'select' | 'view' | 'episodes'>(
        threadId ? 'view' : 'select'
    );
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Refs
    const messageEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Find thread from mock data
    useEffect(() => {
        if (threadId) {
            setIsLoading(true);

            // Simulate API fetch
            setTimeout(() => {
                const foundThread = threads.find(t => t.id === threadId);
                if (foundThread) {
                    setThread(foundThread);
                }
                setIsLoading(false);
            }, 1000);
        }
    }, [threadId]);

    // Filter users based on search
    useEffect(() => {
        if (searchText) {
            const filtered = users.filter(user =>
                !selectedFriends.some(f => f.id === user.id) && (
                    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    user.username.toLowerCase().includes(searchText.toLowerCase())
                )
            );
            setFilteredUsers(filtered);
        } else {
            // Show all users except those already selected
            setFilteredUsers(users.filter(user =>
                !selectedFriends.some(f => f.id === user.id)
            ));
        }
    }, [searchText, selectedFriends]);

    // Scroll to bottom of messages when thread changes or messages are added
    useEffect(() => {
        if (step === 'view' && messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [step, thread]);

    // Focus input when switching to view step
    useEffect(() => {
        if (step === 'view' && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [step]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const toggleFriendSelection = (user: User) => {
        if (selectedFriends.some(f => f.id === user.id)) {
            setSelectedFriends(selectedFriends.filter(f => f.id !== user.id));
        } else {
            setSelectedFriends([...selectedFriends, user]);
        }
    };

    const handleCreateThread = () => {
        if (onCreateThread) {
            onCreateThread(selectedFriends);
        }

        // Create a mock thread
        const newThread: Thread = {
            id: `thread-${Date.now()}`,
            title: "New Discussion",
            createdAt: new Date().toISOString(),
            creatorId: "user1", // Assuming current user is user1
            participantIds: selectedFriends.map(f => f.id),
            reelIds: [],
            messages: []
        };

        setThread(newThread);
        setStep('view');
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !thread) return;

        // Create a new message
        const message = {
            id: `msg-${Date.now()}`,
            userId: "user1", // Assuming current user is user1
            content: newMessage,
            timestamp: new Date().toISOString()
        };

        // Update the thread with the new message
        setThread({
            ...thread,
            messages: [...thread.messages, message]
        });

        // Clear the input
        setNewMessage('');
    };

    // Get user by ID
    const getUserById = (userId: string): User | undefined => {
        return users.find(user => user.id === userId);
    };

    // Get series episodes
    const getSeriesEpisodes = () => {
        if (!thread || !thread.seriesId) return [];

        return reels.filter(reel => reel.seriesId === thread.seriesId)
            .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));
    };

    // Get suggested friends
    const getSuggestedFriends = () => {
        // In a real app, this would use an algorithm to find relevant friends
        // For now, just return a subset of users who aren't already selected
        return users
            .filter(user => !selectedFriends.some(f => f.id === user.id))
            .slice(0, 3);
    };

    // Handle Enter key in message input
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="absolute inset-x-0 bottom-0 top-16 bg-background rounded-t-3xl overflow-hidden"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
                {/* Header */}
                <div className="relative h-14 flex items-center justify-center border-b border-white/10">
                    {step === 'select' && (
                        <h2 className="text-lg font-semibold">New Thread</h2>
                    )}

                    {step === 'view' && thread && (
                        <div className="flex items-center">
                            <h2 className="text-lg font-semibold">
                                {thread.title || "Discussion"}
                            </h2>
                            {thread.participantIds.length > 0 && (
                                <div className="ml-2 px-2 py-0.5 bg-primary/20 rounded-full text-xs flex items-center">
                                    <FaUsers className="mr-1 text-primary-light" />
                                    <span>{thread.participantIds.length + 1}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'view' && !thread && (
                        <h2 className="text-lg font-semibold">Thread</h2>
                    )}

                    {step === 'episodes' && (
                        <h2 className="text-lg font-semibold">Episodes</h2>
                    )}

                    <motion.button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                    >
                        <FaTimes />
                    </motion.button>

                    {step === 'select' && (
                        <motion.button
                            className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full ${selectedFriends.length > 0 ? 'bg-primary' : 'bg-white/10'}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleCreateThread}
                            disabled={selectedFriends.length === 0}
                        >
                            <FaCheck />
                        </motion.button>
                    )}

                    {step === 'view' && (
                        <motion.button
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm bg-primary/20 hover:bg-primary/30 px-3 py-1 rounded-full flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setStep('episodes')}
                        >
                            <FaPlay className="mr-1 text-xs" /> Episodes
                        </motion.button>
                    )}

                    {step === 'episodes' && (
                        <motion.button
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm bg-primary/20 hover:bg-primary/30 px-3 py-1 rounded-full flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setStep('view')}
                        >
                            <FaArrowLeft className="mr-1 text-xs" /> Back to Thread
                        </motion.button>
                    )}
                </div>

                {/* Content */}
                <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <motion.div
                                className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    )}

                    {/* Friend Selection */}
                    {step === 'select' && !isLoading && (
                        <div className="p-4">
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Search friends..."
                                    className="w-full bg-white/5 rounded-full py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-primary"
                                    value={searchText}
                                    onChange={handleSearchChange}
                                    autoFocus
                                />
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                            </div>

                            {/* Selected Friends */}
                            {selectedFriends.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-white/60 text-sm mb-2">Selected ({selectedFriends.length})</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedFriends.map(friend => (
                                            <motion.div
                                                key={friend.id}
                                                className="px-3 py-1 bg-primary/20 rounded-full flex items-center"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleFriendSelection(friend)}
                                            >
                                                <div className="w-6 h-6 rounded-full bg-primary/30 mr-2 flex items-center justify-center text-xs font-bold">
                                                    {friend.name.charAt(0)}
                                                </div>
                                                <span className="text-sm">{friend.name}</span>
                                                <FaTimes className="ml-2 text-xs text-white/70" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggested */}
                            <h3 className="text-white/60 text-sm mb-2">Suggested</h3>
                            <div className="space-y-2 mb-4">
                                {getSuggestedFriends().map(user => (
                                    <motion.div
                                        key={user.id}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => toggleFriendSelection(user)}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 mr-3 flex items-center justify-center text-sm font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-white/60">
                                                    {user.isOnline ? 'Online now' : user.lastActive ? `Last active: ${user.lastActive}` : ''}
                                                </p>
                                            </div>
                                        </div>

                                        <motion.div
                                            className={`w-6 h-6 rounded-full border ${selectedFriends.some(f => f.id === user.id)
                                                ? 'bg-primary border-primary'
                                                : 'border-white/30'
                                                } flex items-center justify-center`}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {selectedFriends.some(f => f.id === user.id) && (
                                                <FaCheck className="text-xs" />
                                            )}
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* All Friends */}
                            <h3 className="text-white/60 text-sm mb-2">All Friends</h3>
                            <div className="space-y-2">
                                {filteredUsers.map(user => (
                                    <motion.div
                                        key={user.id}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => toggleFriendSelection(user)}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 mr-3 flex items-center justify-center text-sm font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-white/60">
                                                    {user.isOnline ? 'Online now' : user.lastActive ? `Last active: ${user.lastActive}` : ''}
                                                </p>
                                            </div>
                                        </div>

                                        <motion.div
                                            className={`w-6 h-6 rounded-full border ${selectedFriends.some(f => f.id === user.id)
                                                ? 'bg-primary border-primary'
                                                : 'border-white/30'
                                                } flex items-center justify-center`}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {selectedFriends.some(f => f.id === user.id) && (
                                                <FaCheck className="text-xs" />
                                            )}
                                        </motion.div>
                                    </motion.div>
                                ))}

                                {filteredUsers.length === 0 && (
                                    <div className="text-center py-8 text-white/50">
                                        {searchText ? 'No users found matching your search' : 'No more users to add'}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Thread View */}
                    {step === 'view' && !isLoading && (
                        <div className="flex flex-col h-full">
                            {thread ? (
                                <div className="flex-1 p-4 overflow-y-auto">
                                    <div className="space-y-4">
                                        {thread.messages.length > 0 ? (
                                            thread.messages.map(message => {
                                                const user = getUserById(message.userId);
                                                const isCurrentUser = message.userId === 'user1'; // Assuming current user

                                                return (
                                                    <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : ''}`}>
                                                        {!isCurrentUser && (
                                                            <div className="flex-shrink-0 mr-3">
                                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                                                                    {user ? user.name.charAt(0) : '?'}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className={`flex-1 ${isCurrentUser ? 'max-w-[80%] ml-12' : 'max-w-[80%] mr-12'}`}>
                                                            <div className="flex items-center mb-1">
                                                                <p className="font-medium text-sm">
                                                                    {isCurrentUser ? 'You' : (user ? user.name : 'Unknown User')}
                                                                </p>
                                                                <p className="text-xs text-white/50 ml-2">
                                                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>

                                                            <div className={`p-3 rounded-2xl ${isCurrentUser
                                                                ? 'bg-primary/30 rounded-tr-none text-white'
                                                                : 'bg-white/10 rounded-tl-none text-white'
                                                                }`}>
                                                                <p className="text-sm">{message.content}</p>
                                                            </div>

                                                            {message.reelId && message.timeInReel && (
                                                                <div className="mt-2 rounded-lg bg-white/5 p-2 text-xs flex items-center">
                                                                    <div className="bg-primary/30 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                                                                        <FaPlay className="text-primary text-xs" />
                                                                    </div>
                                                                    <span>From Episode {reels.find(r => r.id === message.reelId)?.episodeNumber || '?'}</span>
                                                                    <span className="ml-2 text-white/50">{message.timeInReel}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8">
                                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                                    <FaUsers className="text-2xl text-primary-light" />
                                                </div>
                                                <p className="text-white/70 text-center mb-2">Start a conversation about this content</p>
                                                <p className="text-white/50 text-sm text-center">Share your thoughts, questions, or insights with the group</p>
                                            </div>
                                        )}
                                        <div ref={messageEndRef} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <p className="text-white/70 mb-4">Start a new conversation about this content</p>
                                    <motion.button
                                        className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-full text-sm font-medium flex items-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setStep('select')}
                                    >
                                        <FaUserPlus className="mr-2" /> Add Participants
                                    </motion.button>
                                </div>
                            )}

                            {/* Message Input */}
                            {thread && (
                                <div className="p-4 border-t border-white/10">
                                    <div className="relative">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder="Message..."
                                            className="w-full bg-white/5 rounded-full py-3 px-4 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-primary"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                        <motion.button
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                        >
                                            <FaPaperPlane className="text-sm" />
                                        </motion.button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Episodes View */}
                    {step === 'episodes' && !isLoading && (
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-4">Episodes in this Thread</h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {getSeriesEpisodes().map((episode, index) => (
                                    <motion.div
                                        key={episode.id}
                                        className="relative"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className={`aspect-square rounded-lg overflow-hidden ${thread?.reelIds.includes(episode.id) ? 'border-2 border-primary' : 'border border-white/10'}`}>
                                            <div className="w-full h-full bg-black/50 relative">
                                                {/* Thumbnail Image */}
                                                <img
                                                    src={episode.thumbnailUrl}
                                                    alt={episode.title}
                                                    className="w-full h-full object-cover opacity-40"
                                                />

                                                {/* Episode number overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-lg font-bold">
                                                        {episode.episodeNumber}
                                                    </div>
                                                </div>

                                                {/* Title overlay */}
                                                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                    <p className="text-xs font-medium truncate">{episode.title}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {thread?.reelIds.includes(episode.id) && (
                                            <div className="absolute -top-2 -right-2 bg-primary rounded-full w-6 h-6 flex items-center justify-center">
                                                <FaCheck className="text-xs" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {/* Empty state */}
                                {getSeriesEpisodes().length === 0 && (
                                    <div className="col-span-2 md:col-span-3 py-8 flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                                            <FaPlay className="text-white/50" />
                                        </div>
                                        <p className="text-white/70 text-center mb-1">No episodes available</p>
                                        <p className="text-white/50 text-sm text-center">This thread isn&apos;t associated with a series</p>
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            {getSeriesEpisodes().length > 0 && (
                                <div className="mt-6 flex justify-center">
                                    <motion.button
                                        className="px-4 py-2 bg-primary/30 hover:bg-primary/40 rounded-full text-sm font-medium"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Watch Selected Episodes
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}