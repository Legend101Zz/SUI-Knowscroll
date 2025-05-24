/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useSpring, useTransform, useMotionValue } from 'framer-motion';
import {
    FaUser, FaVideo, FaBell, FaSearch, FaComment, FaShareAlt, FaPlus, FaEllipsisH,
    FaArrowLeft, FaTimes, FaCheck, FaClock, FaPlay, FaPause, FaLightbulb, FaPaperPlane,
    FaLock, FaBookmark, FaHeart, FaInfoCircle, FaRandom, FaMagic, FaGraduationCap,
    FaSpaceShuttle, FaBrain, FaAtom, FaStarHalfAlt, FaFire, FaRocket, FaBook, FaHome, FaCompass
} from 'react-icons/fa';
import Link from 'next/link';

// Mock data for the user profile
const userData = {
    id: "user1",
    name: "Alex Johnson",
    username: "@alex_science",
    bio: "Physics enthusiast | Science communicator | Always curious about the cosmos",
    avatar: "/images/avatar-alex.jpg",
    followers: 1245,
    following: 368,
    joinedDate: "April 2024",
    learningStreak: 12,
    activity: {
        views: 284,
        threads: 12,
        contributions: 47
    },
    interests: ["Astrophysics", "Quantum Physics", "AI", "History"]
};

// Mock data for series the user is watching
const watchingSeries = [
    {
        id: "series1",
        title: "Black Holes",
        description: "A comprehensive exploration of black holes and their properties",
        episodes: 5,
        progress: 3,
        thumbnailUrl: "/images/black-holes-thumb.jpg",
        tags: ["Physics", "Space", "Astronomy"],
        color: "from-[#8f46c1] to-[#a0459b]",
        icon: <FaSpaceShuttle />
    },
    {
        id: "series2",
        title: "Quantum Physics",
        description: "Understanding quantum mechanics and its strange phenomena",
        episodes: 3,
        progress: 1,
        thumbnailUrl: "/images/quantum-physics-thumb.jpg",
        tags: ["Physics", "Quantum Theory"],
        color: "from-[#a0459b] to-[#bd4580]",
        icon: <FaAtom />
    },
    {
        id: "series3",
        title: "AI Revolution",
        description: "How artificial intelligence is changing our world",
        episodes: 4,
        progress: 4,
        thumbnailUrl: "/images/ai-revolution-thumb.jpg",
        tags: ["Technology", "AI", "Computing"],
        color: "from-[#bd4580] to-[#d56f66]",
        icon: <FaBrain />
    }
];

// Mock data for threads
const threadsData = [
    {
        id: "thread1",
        seriesId: "series1",
        title: "Black Holes",
        participants: [
            { id: "user1", name: "Alex", avatar: "/images/avatar-alex.jpg", isOnline: true },
            { id: "user2", name: "Jamie", avatar: "/images/avatar-jamie.jpg", lastActive: "2h ago" },
            { id: "user3", name: "Taylor", avatar: "/images/avatar-taylor.jpg", lastActive: "5m ago" }
        ],
        messages: [
            {
                id: "msg1",
                userId: "user1",
                content: "That part about event horizons was mind-blowing!",
                timestamp: "Today, 12:05 PM",
                episodeRef: { number: 2, timestamp: "01:45", title: "Event Horizons" }
            },
            {
                id: "msg2",
                userId: "user3",
                content: "Check this part!",
                timestamp: "Today, 12:10 PM",
                episodeRef: { number: 1, timestamp: "00:52", title: "Black Holes Explained" }
            },
            {
                id: "msg3",
                userId: "user2",
                content: "Do you think there's any possibility of using black holes for time travel?",
                timestamp: "Today, 12:15 PM"
            },
            {
                id: "msg4",
                userId: "user1",
                content: "Well, theoretically, the extreme gravity near a black hole does slow down time relative to observers further away (time dilation). But actual time travel? That's still in the realm of science fiction.",
                timestamp: "Today, 12:18 PM"
            }
        ],
        whatIfScenarios: [
            {
                id: "what-if-1",
                title: "What if... black holes are portals?",
                description: "Alternative theory generated based on the series content. This could explain disappearing matter.",
                generatedBy: "user1"
            },
            {
                id: "what-if-2",
                title: "What if... black holes contain entire universes?",
                description: "The mass could be powering the creation of new cosmic realms with different physics.",
                generatedBy: "AI"
            }
        ],
        episodes: [
            { number: 1, title: "Black Holes Explained", viewed: true, thumbnailUrl: "/images/black-holes-thumb.jpg", duration: "5:20", icon: <FaRocket /> },
            { number: 2, title: "Event Horizons", viewed: true, current: true, thumbnailUrl: "/images/black-holes-thumb.jpg", duration: "6:15", icon: <FaAtom /> },
            { number: 3, title: "Spaghettification", viewed: true, thumbnailUrl: "/images/black-holes-thumb.jpg", duration: "4:50", icon: <FaStarHalfAlt /> },
            { number: 4, title: "Hawking Radiation", viewed: false, locked: true, thumbnailUrl: "/images/black-holes-thumb.jpg", duration: "7:30", icon: <FaFire /> },
            { number: 5, title: "At the Center of Galaxies", viewed: false, locked: true, thumbnailUrl: "/images/black-holes-thumb.jpg", duration: "6:45", icon: <FaSpaceShuttle /> }
        ]
    },
    {
        id: "thread2",
        seriesId: "series2",
        title: "Quantum Physics",
        participants: [
            { id: "user1", name: "Alex", avatar: "/images/avatar-alex.jpg", isOnline: true },
            { id: "user3", name: "Taylor", avatar: "/images/avatar-taylor.jpg", lastActive: "5m ago" }
        ],
        messages: [
            {
                id: "msg1",
                userId: "user1",
                content: "The double-slit experiment still confuses me sometimes.",
                timestamp: "Yesterday, 15:30 PM"
            },
            {
                id: "msg2",
                userId: "user3",
                content: "Look at this part where they explain wave-particle duality.",
                timestamp: "Yesterday, 15:35 PM",
                episodeRef: { number: 1, timestamp: "03:24", title: "Wave-Particle Duality" }
            }
        ],
        episodes: [
            { number: 1, title: "Wave-Particle Duality", viewed: true, current: true, thumbnailUrl: "/images/quantum-physics-thumb.jpg", duration: "5:10", icon: <FaAtom /> },
            { number: 2, title: "Superposition", viewed: false, locked: true, thumbnailUrl: "/images/quantum-physics-thumb.jpg", duration: "6:20", icon: <FaBrain /> },
            { number: 3, title: "Entanglement", viewed: false, locked: true, thumbnailUrl: "/images/quantum-physics-thumb.jpg", duration: "7:15", icon: <FaRandom /> }
        ]
    }
];

// Automated responses
const autoResponses = [
    "That's a really interesting perspective!",
    "I never thought about it that way before.",
    "That connects really well with what we learned in episode 2.",
    "Have you watched the part about quantum entanglement yet?",
    "The way the instructor explained that concept made it so much clearer.",
    "I'm going to rewatch that section, thanks for pointing it out!",
    "Did you see the visualization they used? It really helped me understand.",
    "I wonder how this applies to other phenomena we've learned about.",
    "That's exactly the point I was trying to make last time!",
    "Do you think this will be covered more in the upcoming episodes?"
];

// Friends data for creating threads
const friendsData = [
    { id: "user2", name: "Jamie Smith", username: "jamie_history", avatar: "/images/avatar-jamie.jpg", isOnline: false, lastActive: "2h ago", interests: ["History", "Science"] },
    { id: "user3", name: "Taylor Wong", username: "taylor_physics", avatar: "/images/avatar-taylor.jpg", isOnline: false, lastActive: "5m ago", interests: ["Physics", "Astronomy"] },
    { id: "user4", name: "Jordan Lee", username: "jordan_math", avatar: "/images/avatar-alex.jpg", isOnline: true, interests: ["Math", "Computer Science"] }
];

// Animation variants
const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Main component
export default function UserProfile() {
    const [viewState, setViewState] = useState("profile"); // profile, thread, create-thread
    const [selectedThread, setSelectedThread] = useState(null);
    const [createThreadState, setCreateThreadState] = useState({ step: 1, seriesId: null, selectedFriends: [] });
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([]);
    const [showWhatIf, setShowWhatIf] = useState(false);
    const [activeEpisodeIndex, setActiveEpisodeIndex] = useState(1);
    const [scrollY, setScrollY] = useState(0);
    const [isNavVisible, setIsNavVisible] = useState(true);

    const y = useMotionValue(0);
    const messagesEndRef = useRef(null);
    const controls = useAnimation();
    const containerRef = useRef(null);

    // Handle scroll for parallax effects
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                setScrollY(window.scrollY);
                if (window.scrollY > 80) {
                    setIsNavVisible(false);
                } else {
                    setIsNavVisible(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle thread selection
    const handleSelectThread = (threadId) => {
        const thread = getThreadById(threadId);
        setSelectedThread(thread);
        setMessages(thread.messages);
        setActiveEpisodeIndex(thread.episodes.findIndex(ep => ep.current) || 0);
        setViewState("thread");
    };

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Helper function to get a thread by ID
    const getThreadById = (threadId) => {
        return threadsData.find(thread => thread.id === threadId);
    };

    // Handle create thread flow
    const handleCreateThread = (seriesId) => {
        setCreateThreadState({ step: 1, seriesId, selectedFriends: [] });
        setViewState("create-thread");
    };

    // Toggle friend selection in create thread flow
    const toggleFriendSelection = (friend) => {
        setCreateThreadState(prev => {
            const friendExists = prev.selectedFriends.some(f => f.id === friend.id);
            return {
                ...prev,
                selectedFriends: friendExists
                    ? prev.selectedFriends.filter(f => f.id !== friend.id)
                    : [...prev.selectedFriends, friend]
            };
        });
    };

    // Handle going back
    const handleBack = () => {
        if (viewState === "thread" || viewState === "create-thread") {
            setViewState("profile");
            setSelectedThread(null);
            setMessages([]);
            setCreateThreadState({ step: 1, seriesId: null, selectedFriends: [] });
        } else if (createThreadState.step > 1) {
            setCreateThreadState(prev => ({ ...prev, step: prev.step - 1 }));
        }
    };

    // Simulate typing response
    const simulateResponse = () => {
        if (!selectedThread) return;

        // Get random participant who isn't the current user
        const otherParticipants = selectedThread.participants.filter(p => p.id !== userData.id);
        if (otherParticipants.length === 0) return;

        const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
        const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];

        // Show typing indicator
        setIsTyping(true);

        // Simulate typing delay (1-3 seconds)
        const typingDelay = 1000 + Math.random() * 2000;

        setTimeout(() => {
            setIsTyping(false);

            // Add new message
            const newMsg = {
                id: `msg-${Date.now()}`,
                userId: randomParticipant.id,
                content: randomResponse,
                timestamp: "Just now"
            };

            setMessages(prev => [...prev, newMsg]);
        }, typingDelay);
    };

    // Handle sending a message
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedThread) return;

        // Create new message
        const newMsg = {
            id: `msg-${Date.now()}`,
            userId: userData.id,
            content: newMessage,
            timestamp: "Just now"
        };

        // Add to messages
        setMessages(prev => [...prev, newMsg]);

        // Clear input
        setNewMessage("");

        // Trigger response after delay
        setTimeout(simulateResponse, 500);
    };

    // Handle keypress in message input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Get series info by ID
    const getSeriesById = (seriesId) => {
        return watchingSeries.find(series => series.id === seriesId);
    };

    // Handle episode selection
    const handleEpisodeSelect = (index) => {
        // Only allow navigating to unlocked episodes
        if (selectedThread?.episodes[index]?.locked) {
            // Play lock animation
            controls.start({
                scale: [1, 1.1, 1],
                transition: { duration: 0.3 }
            });
            return;
        }

        setActiveEpisodeIndex(index);

        // Update UI to show this episode as current
        if (selectedThread) {
            const updatedThread = { ...selectedThread };
            updatedThread.episodes = updatedThread.episodes.map((ep, idx) => ({
                ...ep,
                current: idx === index
            }));
            setSelectedThread(updatedThread);
        }
    };

    // Generate What-If scenario
    const generateWhatIf = () => {
        controls.start({
            scale: [1, 1.05, 1],
            rotateZ: [0, 5, -5, 0],
            transition: { duration: 0.5 }
        });
        setShowWhatIf(true);
    };

    return (
        <div
            className="min-h-screen bg-background text-foreground font-sans antialiased overflow-hidden"
            ref={containerRef}
        >
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-[#0c0612] overflow-hidden">
                    <motion.div
                        className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl"
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: 'center center' }}
                    />
                    <motion.div
                        className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-tr from-primary-secondary/20 to-transparent blur-3xl"
                        animate={{
                            rotate: -360,
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: 'center center' }}
                    />

                    {/* Floating particles */}
                    <motion.div
                        className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-primary/50 blur-sm"
                        animate={{
                            y: [0, -20, 0],
                            x: [0, 10, 0],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-primary-secondary/50 blur-sm"
                        animate={{
                            y: [0, 15, 0],
                            x: [0, -5, 0],
                            opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-primary/40 blur-sm"
                        animate={{
                            y: [0, -30, 0],
                            x: [0, -15, 0],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    />

                    {/* Star field effect */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-white rounded-full"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.5 + 0.2,
                            }}
                            animate={{
                                opacity: [0.2, 0.5, 0.2],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 2 + Math.random() * 3,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Header/Navigation */}
            <motion.header
                className={`sticky top-0 z-30 backdrop-blur-lg bg-gradient-to-b from-background via-background/90 to-background/60 px-6 py-4 transition-all duration-300 ease-in-out ${isNavVisible ? 'h-20' : 'h-16'}`}
                style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}
                animate={{
                    height: isNavVisible ? 80 : 64,
                    opacity: isNavVisible ? 1 : 0.9,
                }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center justify-between h-full">
                    {viewState !== "profile" ? (
                        <motion.button
                            onClick={handleBack}
                            className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                            whileTap={{ scale: 0.9, rotate: -10 }}
                        >
                            <motion.div animate={{ x: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                                <FaArrowLeft />
                            </motion.div>
                        </motion.button>
                    ) : (
                        <motion.div
                            className="flex items-center"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <motion.div
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-secondary flex items-center justify-center shadow-glow"
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: "0 0 25px rgba(143, 70, 193, 0.6)",
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <FaUser />
                            </motion.div>

                            {isNavVisible && (
                                <motion.div
                                    className="ml-3 hidden md:block"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <motion.h1
                                        className="text-xl font-bold gradient-text mb-0.5"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {userData.name}
                                    </motion.h1>
                                    <motion.div
                                        className="flex items-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.8 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <span className="text-sm text-white/60">{userData.username}</span>
                                        <motion.div
                                            className="ml-2 px-2 py-0.5 bg-primary/20 rounded-full text-xs flex items-center"
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(143, 70, 193, 0.3)" }}
                                        >
                                            <FaFire className="mr-1 text-xs text-primary-light" />
                                            <span>{userData.learningStreak} day streak</span>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    <motion.h1
                        className="text-xl font-bold absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, type: "spring" }}
                    >
                        {viewState === "profile" ?
                            <div className="flex flex-col items-center">
                                <motion.div
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-secondary to-primary-500"
                                    animate={{
                                        backgroundPosition: ["0% center", "100% center", "0% center"],
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    style={{
                                        backgroundSize: "200% auto",
                                    }}
                                >
                                    KnowScroll
                                </motion.div>
                                {isNavVisible && (
                                    <motion.div
                                        className="text-xs text-white/50"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        Your Learning Space
                                    </motion.div>
                                )}
                            </div>
                            :
                            viewState === "thread" ?
                                <motion.div
                                    className="flex items-center"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring" }}
                                >
                                    <motion.span
                                        className="gradient-text"
                                        animate={{
                                            backgroundPosition: ["0% center", "100% center", "0% center"],
                                        }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        style={{
                                            backgroundSize: "200% auto",
                                        }}
                                    >
                                        {selectedThread?.title}
                                    </motion.span>
                                    {selectedThread &&
                                        <motion.div
                                            className="ml-2 px-2 py-0.5 bg-primary/20 rounded-full text-xs flex items-center"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3, type: "spring" }}
                                        >
                                            <span>Ep {activeEpisodeIndex + 1}</span>
                                        </motion.div>
                                    }
                                </motion.div> :
                                viewState === "create-thread" ?
                                    <motion.div
                                        className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-secondary to-primary"
                                        animate={{
                                            backgroundPosition: ["0% center", "100% center", "0% center"],
                                        }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                        style={{
                                            backgroundSize: "200% auto",
                                        }}
                                    >
                                        New Thread
                                    </motion.div> : ""}
                    </motion.h1>

                    <div className="flex items-center space-x-3">
                        <motion.button
                            className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 relative"
                            whileHover={{
                                scale: 1.1,
                                backgroundColor: "rgba(255,255,255,0.1)",
                                boxShadow: "0 0 15px rgba(143, 70, 193, 0.3)",
                            }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <FaBell />
                            <motion.div
                                className="absolute -top-1 -right-1 w-3 h-3 bg-primary-secondary rounded-full"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    boxShadow: [
                                        "0 0 0px rgba(213, 111, 102, 0.5)",
                                        "0 0 8px rgba(213, 111, 102, 0.8)",
                                        "0 0 0px rgba(213, 111, 102, 0.5)"
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.button>
                        <motion.button
                            className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10"
                            whileHover={{
                                scale: 1.1,
                                backgroundColor: "rgba(255,255,255,0.1)",
                                boxShadow: "0 0 15px rgba(143, 70, 193, 0.3)",
                            }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <FaSearch />
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence mode="wait">
                <motion.main
                    key={viewState}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="pb-24 px-6"
                >
                    {/* Profile View */}
                    {viewState === "profile" && (
                        <div className="py-6">
                            {/* User Info Card with 3D effect */}
                            <motion.div
                                className="mb-6 neo-brutalism-card p-6 relative overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                                }}
                            >
                                {/* Background patterns */}
                                <div className="absolute inset-0 overflow-hidden opacity-10">
                                    <motion.div
                                        className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-primary/40"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    />
                                    <motion.div
                                        className="absolute -left-10 -bottom-10 w-20 h-20 rounded-full bg-primary-secondary/40"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center relative z-10">
                                    <div className="relative mb-4 md:mb-0">
                                        <motion.div
                                            className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 relative shadow-lg"
                                            whileHover={{ scale: 1.05, borderColor: "rgba(143, 70, 193, 0.5)" }}
                                            animate={{
                                                boxShadow: [
                                                    "0 0 0 rgba(143, 70, 193, 0.5)",
                                                    "0 0 20px rgba(143, 70, 193, 0.5)",
                                                    "0 0 0 rgba(143, 70, 193, 0.5)"
                                                ]
                                            }}
                                            transition={{ duration: 2.5, repeat: Infinity }}
                                        >
                                            <img
                                                src={userData.avatar}
                                                alt={userData.name}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Animated ripple effect */}
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-4 border-primary"
                                                initial={{ scale: 0, opacity: 1 }}
                                                animate={{ scale: 1.5, opacity: 0 }}
                                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                            />
                                        </motion.div>
                                        <motion.div
                                            className="absolute bottom-0 right-0 w-7 h-7 bg-green-500 rounded-full border-3 border-background z-10 flex items-center justify-center"
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                boxShadow: [
                                                    "0 0 0 rgba(74, 222, 128, 0.5)",
                                                    "0 0 10px rgba(74, 222, 128, 0.8)",
                                                    "0 0 0 rgba(74, 222, 128, 0.5)"
                                                ]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <motion.div
                                                animate={{ scale: [1, 0.8, 1] }}
                                                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                            >
                                                <FaCheck className="text-xs" />
                                            </motion.div>
                                        </motion.div>
                                    </div>

                                    <div className="md:ml-6 flex-1">
                                        <motion.h2
                                            className="text-2xl font-bold gradient-text mb-1"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            {userData.name}
                                        </motion.h2>
                                        <motion.p
                                            className="text-white/60 text-sm mb-2"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {userData.username}
                                        </motion.p>
                                        <motion.p
                                            className="text-sm mb-3"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            {userData.bio}
                                        </motion.p>

                                        <motion.div
                                            className="flex flex-wrap gap-2 mt-1"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            {userData.interests.map((interest, idx) => (
                                                <motion.span
                                                    key={idx}
                                                    className="text-xs px-3 py-1 bg-white/10 rounded-full flex items-center"
                                                    whileHover={{
                                                        scale: 1.05,
                                                        backgroundColor: "rgba(255,255,255,0.15)"
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                                >
                                                    <motion.div
                                                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                                                        transition={{ duration: 5, repeat: Infinity, repeatType: "loop", delay: idx }}
                                                    >
                                                        {idx === 0 ? <FaSpaceShuttle className="mr-1 text-primary-light" /> :
                                                            idx === 1 ? <FaAtom className="mr-1 text-primary-light" /> :
                                                                idx === 2 ? <FaBrain className="mr-1 text-primary-light" /> :
                                                                    <FaBook className="mr-1 text-primary-light" />
                                                        }
                                                    </motion.div>
                                                    {interest}
                                                </motion.span>
                                            ))}
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Stats Section */}
                                <motion.div
                                    className="grid grid-cols-3 gap-3 mt-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <motion.div
                                        className="neo-brutalism-card bg-white/5 rounded-xl p-4 text-center relative overflow-hidden"
                                        whileHover={{
                                            y: -5,
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            boxShadow: "0 10px 40px rgba(143, 70, 193, 0.2)"
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-30" />
                                        <motion.p
                                            className="text-primary-light text-2xl font-bold"
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                textShadow: [
                                                    "0 0 0px rgba(143, 70, 193, 0.5)",
                                                    "0 0 10px rgba(143, 70, 193, 0.8)",
                                                    "0 0 0px rgba(143, 70, 193, 0.5)"
                                                ]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                        >
                                            {userData.followers}
                                        </motion.p>
                                        <p className="text-sm text-white/60">Followers</p>
                                    </motion.div>
                                    <motion.div
                                        className="neo-brutalism-card bg-white/5 rounded-xl p-4 text-center relative overflow-hidden"
                                        whileHover={{
                                            y: -5,
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            boxShadow: "0 10px 40px rgba(143, 70, 193, 0.2)"
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-30" />
                                        <p className="text-primary-light text-2xl font-bold">{userData.following}</p>
                                        <p className="text-sm text-white/60">Following</p>
                                    </motion.div>
                                    <motion.div
                                        className="neo-brutalism-card bg-white/5 rounded-xl p-4 text-center relative overflow-hidden"
                                        whileHover={{
                                            y: -5,
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            boxShadow: "0 10px 40px rgba(143, 70, 193, 0.2)"
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-30" />
                                        <p className="text-primary-light text-2xl font-bold">{userData.activity.threads}</p>
                                        <p className="text-sm text-white/60">Threads</p>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* Learning Streak */}
                            <motion.div
                                className="mb-8 neo-brutalism-card p-5 relative overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-secondary/10 opacity-50" />

                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className="flex items-center">
                                        <motion.div
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary-secondary/30 flex items-center justify-center mr-3"
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, 0, -5, 0]
                                            }}
                                            transition={{ duration: 5, repeat: Infinity }}
                                        >
                                            <FaFire className="text-primary-light" />
                                        </motion.div>
                                        <div>
                                            <h3 className="font-bold text-lg">Learning Streak</h3>
                                            <p className="text-sm text-white/60">Keep watching daily to maintain your streak!</p>
                                        </div>
                                    </div>
                                    <div className="bg-primary/30 rounded-full px-3 py-1 text-sm font-semibold flex items-center">
                                        <span>{userData.learningStreak} days</span>
                                    </div>
                                </div>

                                {/* Streak calendar */}
                                <div className="grid grid-cols-7 gap-2 relative z-10">
                                    {[...Array(14)].map((_, i) => {
                                        const isActive = i < userData.learningStreak % 14;
                                        return (
                                            <motion.div
                                                key={i}
                                                className={`h-8 rounded-md flex items-center justify-center text-xs ${isActive ? 'bg-gradient-to-br from-primary to-primary-secondary' : 'bg-white/10'}`}
                                                whileHover={{ scale: 1.1 }}
                                                animate={isActive ? {
                                                    boxShadow: [
                                                        "0 0 0px rgba(143, 70, 193, 0.3)",
                                                        "0 0 10px rgba(143, 70, 193, 0.5)",
                                                        "0 0 0px rgba(143, 70, 193, 0.3)"
                                                    ]
                                                } : {}}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                            >
                                                {isActive && <FaCheck className="text-white text-xs" />}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* User Activity Cards */}
                            <motion.div
                                className="mb-8"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                            >
                                <motion.h3
                                    className="text-xl font-bold mb-4 flex items-center"
                                    variants={staggerItem}
                                >
                                    <motion.div
                                        className="mr-2 text-primary-light"
                                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity }}
                                    >
                                        <FaGraduationCap />
                                    </motion.div>
                                    Recent Activity
                                </motion.h3>

                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                    variants={staggerItem}
                                >
                                    <motion.div
                                        className="neo-brutalism-card bg-white/5 rounded-xl p-4 relative overflow-hidden"
                                        whileHover={{
                                            y: -8,
                                            boxShadow: "0 20px 40px rgba(143, 70, 193, 0.3)",
                                            backgroundColor: "rgba(255,255,255,0.12)",
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary-400/30 flex items-center justify-center mb-3 relative z-10">
                                            <motion.div
                                                animate={{ rotate: [0, 10, 0, -10, 0] }}
                                                transition={{ duration: 5, repeat: Infinity }}
                                            >
                                                <FaVideo className="text-primary-light text-lg" />
                                            </motion.div>
                                        </div>
                                        <p className="text-2xl font-bold relative z-10">{userData.activity.views}</p>
                                        <p className="text-sm text-white/60 relative z-10">Reels Watched</p>

                                        {/* Floating icons */}
                                        <motion.div
                                            className="absolute bottom-3 right-3 text-primary/20 text-2xl"
                                            animate={{
                                                y: [0, -5, 0],
                                                rotate: [0, 5, 0],
                                                opacity: [0.2, 0.3, 0.2]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            <FaRocket />
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        className="neo-brutalism-card bg-white/5 rounded-xl p-4 relative overflow-hidden"
                                        whileHover={{
                                            y: -8,
                                            boxShadow: "0 20px 40px rgba(143, 70, 193, 0.3)",
                                            backgroundColor: "rgba(255,255,255,0.12)",
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary-400/30 flex items-center justify-center mb-3 relative z-10">
                                            <motion.div
                                                animate={{ rotate: [0, 10, 0, -10, 0] }}
                                                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                                            >
                                                <FaComment className="text-primary-light text-lg" />
                                            </motion.div>
                                        </div>
                                        <p className="text-2xl font-bold relative z-10">{userData.activity.threads}</p>
                                        <p className="text-sm text-white/60 relative z-10">Active Threads</p>

                                        {/* Floating icons */}
                                        <motion.div
                                            className="absolute bottom-3 right-3 text-primary/20 text-2xl"
                                            animate={{
                                                y: [0, -5, 0],
                                                rotate: [0, 5, 0],
                                                opacity: [0.2, 0.3, 0.2]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                                        >
                                            <FaComment />
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        className="neo-brutalism-card bg-white/5 rounded-xl p-4 relative overflow-hidden"
                                        whileHover={{
                                            y: -8,
                                            boxShadow: "0 20px 40px rgba(143, 70, 193, 0.3)",
                                            backgroundColor: "rgba(255,255,255,0.12)",
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary-400/30 flex items-center justify-center mb-3 relative z-10">
                                            <motion.div
                                                animate={{ rotate: [0, 10, 0, -10, 0] }}
                                                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                            >
                                                <FaShareAlt className="text-primary-light text-lg" />
                                            </motion.div>
                                        </div>
                                        <p className="text-2xl font-bold relative z-10">{userData.activity.contributions}</p>
                                        <p className="text-sm text-white/60 relative z-10">Contributions</p>

                                        {/* Floating icons */}
                                        <motion.div
                                            className="absolute bottom-3 right-3 text-primary/20 text-2xl"
                                            animate={{
                                                y: [0, -5, 0],
                                                rotate: [0, 5, 0],
                                                opacity: [0.2, 0.3, 0.2]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                                        >
                                            <FaShareAlt />
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* Watching Series Carousel */}
                            <motion.div
                                className="mb-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold flex items-center">
                                        <motion.div
                                            className="mr-2 text-primary-light"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        >
                                            <FaRocket />
                                        </motion.div>
                                        Learning Now
                                    </h3>
                                    <motion.button
                                        className="text-sm text-primary-light flex items-center"
                                        whileHover={{ scale: 1.05, x: 3 }}
                                    >
                                        See All
                                        <motion.div
                                            animate={{ x: [0, 3, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            →
                                        </motion.div>
                                    </motion.button>
                                </div>

                                <div className="relative">
                                    {/* Hidden scroll indicator */}
                                    <motion.div
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 0.8, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />

                                    <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
                                        {watchingSeries.map((series, index) => (
                                            <motion.div
                                                key={series.id}
                                                className="neo-brutalism-card flex-shrink-0 w-80 rounded-2xl overflow-hidden snap-center"
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                    transition: { delay: 0.1 * index + 0.5 }
                                                }}
                                                whileHover={{
                                                    scale: 1.03,
                                                    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)"
                                                }}
                                            >
                                                <div className="h-40 bg-gradient-to-br relative overflow-hidden">
                                                    <img
                                                        src={series.thumbnailUrl}
                                                        alt={series.title}
                                                        className="w-full h-full object-cover opacity-80"
                                                    />
                                                    {/* Animated gradient overlay */}
                                                    <motion.div
                                                        className={`absolute inset-0 bg-gradient-to-br ${series.color}`}
                                                        initial={{ opacity: 0.3 }}
                                                        animate={{ opacity: [0.3, 0.5, 0.3] }}
                                                        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                                                        style={{ mixBlendMode: "overlay" }}
                                                    />

                                                    {/* Lightning bolt pattern */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <motion.div
                                                            className="text-white/10 text-9xl"
                                                            animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.1, 1] }}
                                                            transition={{ duration: 7, repeat: Infinity, delay: index * 0.3 }}
                                                        >
                                                            {series.icon}
                                                        </motion.div>
                                                    </div>

                                                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                                                        <h4 className="text-xl font-bold text-white">{series.title}</h4>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm text-white/80">{series.progress} of {series.episodes} episodes</p>

                                                            <motion.button
                                                                onClick={() => handleCreateThread(series.id)}
                                                                className="w-8 h-8 rounded-full bg-primary/50 hover:bg-primary/70 flex items-center justify-center"
                                                                whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.8)" }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <FaShareAlt className="text-xs" />
                                                            </motion.button>
                                                        </div>
                                                    </div>

                                                    {/* Tag */}
                                                    <motion.div
                                                        className="absolute top-3 right-3 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs"
                                                        initial={{ y: -20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.5 + index * 0.2 }}
                                                    >
                                                        {series.tags[0]}
                                                    </motion.div>
                                                </div>

                                                <div className="p-4">
                                                    <p className="text-sm text-white/80 mb-3 line-clamp-2">{series.description}</p>

                                                    <div className="relative h-2 bg-white/10 rounded-full mb-3 overflow-hidden">
                                                        <motion.div
                                                            className={`h-full bg-gradient-to-r ${series.color}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(series.progress / series.episodes) * 100}%` }}
                                                            transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                                                        />
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {series.tags.map((tag, idx) => (
                                                            <motion.span
                                                                key={idx}
                                                                className="text-xs px-2 py-0.5 bg-white/10 rounded-full"
                                                                initial={{ opacity: 0, scale: 0.5 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 0.8 + idx * 0.1 + index * 0.1 }}
                                                                whileHover={{
                                                                    scale: 1.1,
                                                                    backgroundColor: "rgba(255,255,255,0.2)"
                                                                }}
                                                            >
                                                                {tag}
                                                            </motion.span>
                                                        ))}
                                                    </div>

                                                    <motion.button
                                                        className="mt-3 w-full py-2 bg-gradient-to-r from-primary/80 to-primary-secondary/80 hover:from-primary hover:to-primary-secondary rounded-full text-sm font-medium flex items-center justify-center"
                                                        whileHover={{
                                                            y: -2,
                                                            boxShadow: "0 10px 20px rgba(143, 70, 193, 0.3)"
                                                        }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <motion.div
                                                            animate={{ x: [0, 3, 0] }}
                                                            transition={{ duration: 1, repeat: Infinity }}
                                                        >
                                                            <FaPlay className="mr-2 text-xs" />
                                                        </motion.div>
                                                        Continue Learning
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Threads Section with Card Stack Effect */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold flex items-center">
                                        <motion.div
                                            className="mr-2 text-primary-light"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <FaComment />
                                        </motion.div>
                                        Discussion Threads
                                    </h3>

                                    <motion.div
                                        className="flex items-center space-x-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                    >
                                        <motion.button
                                            className="text-sm bg-primary/20 hover:bg-primary/30 px-3 py-1 rounded-full flex items-center"
                                            whileHover={{
                                                scale: 1.05,
                                                backgroundColor: "rgba(143, 70, 193, 0.3)"
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaPlus className="mr-1 text-xs" /> New
                                        </motion.button>

                                        <motion.button
                                            className="text-sm text-primary-light flex items-center"
                                            whileHover={{ scale: 1.05, x: 3 }}
                                        >
                                            All
                                            <motion.div
                                                animate={{ x: [0, 3, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                →
                                            </motion.div>
                                        </motion.button>
                                    </motion.div>
                                </div>

                                <div className="space-y-6 relative">
                                    {/* Card stack effect with rotation and offset */}
                                    {threadsData.map((thread, index) => (
                                        <motion.div
                                            key={thread.id}
                                            className={`neo-brutalism-card p-5 rounded-2xl relative z-${10 - index}`}
                                            style={{
                                                transformOrigin: index % 2 === 0 ? 'center left' : 'center right',
                                                rotate: index === 0 ? 0 : index % 2 === 0 ? -2 : 2,
                                                translateY: index * 5
                                            }}
                                            initial={{
                                                opacity: 0,
                                                y: 50,
                                                rotate: index === 0 ? 0 : index % 2 === 0 ? -5 : 5
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: index * 5,
                                                rotate: index === 0 ? 0 : index % 2 === 0 ? -2 : 2,
                                                transition: { delay: 0.2 * index + 0.5 }
                                            }}
                                            whileHover={{
                                                scale: 1.05,
                                                rotate: 0,
                                                zIndex: 50,
                                                boxShadow: "0 30px 60px rgba(0, 0, 0, 0.4)"
                                            }}
                                            onClick={() => handleSelectThread(thread.id)}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-secondary/5 rounded-2xl opacity-70" />

                                            {/* Thread header */}
                                            <div className="flex justify-between items-start relative z-10 mb-3">
                                                <div>
                                                    <div className="flex items-center">
                                                        <motion.div
                                                            className="text-primary-light mr-2 text-lg"
                                                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                                                            transition={{ duration: 5, repeat: Infinity, delay: index * 0.5 }}
                                                        >
                                                            {thread.seriesId === "series1" ? <FaSpaceShuttle /> :
                                                                thread.seriesId === "series2" ? <FaAtom /> : <FaBrain />}
                                                        </motion.div>
                                                        <h4 className="text-xl font-bold gradient-text">{thread.title}</h4>
                                                    </div>

                                                    <div className="flex items-center text-sm text-white/60 mt-1">
                                                        <span>{thread.messages.length} messages</span>
                                                        {thread.episodes && (
                                                            <motion.span
                                                                className="ml-2 px-2 py-0.5 bg-primary/20 rounded-full text-xs flex items-center"
                                                                whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.3)" }}
                                                            >
                                                                <FaPlay className="mr-1 text-[8px]" />
                                                                {thread.episodes.filter(ep => ep.viewed).length}/{thread.episodes.length} eps
                                                            </motion.span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex -space-x-3">
                                                    {thread.participants.slice(0, 3).map((participant, pIdx) => (
                                                        <motion.div
                                                            key={participant.id}
                                                            className="w-10 h-10 rounded-full border-2 border-background overflow-hidden relative"
                                                            initial={{ opacity: 0, x: 10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.5 + pIdx * 0.1 + index * 0.1 }}
                                                            whileHover={{ scale: 1.1, zIndex: 10 }}
                                                        >
                                                            <img
                                                                src={participant.avatar}
                                                                alt={participant.name}
                                                                className="w-full h-full object-cover"
                                                            />

                                                            {participant.isOnline && (
                                                                <motion.div
                                                                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
                                                                    animate={{
                                                                        boxShadow: [
                                                                            "0 0 0px rgba(74, 222, 128, 0.5)",
                                                                            "0 0 8px rgba(74, 222, 128, 0.8)",
                                                                            "0 0 0px rgba(74, 222, 128, 0.5)"
                                                                        ]
                                                                    }}
                                                                    transition={{ duration: 2, repeat: Infinity }}
                                                                />
                                                            )}
                                                        </motion.div>
                                                    ))}
                                                    {thread.participants.length > 3 && (
                                                        <motion.div
                                                            className="w-10 h-10 rounded-full bg-primary/30 border-2 border-background flex items-center justify-center text-xs"
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: 0.8 + index * 0.1 }}
                                                        >
                                                            +{thread.participants.length - 3}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Latest message with animated gradient effect */}
                                            <motion.div
                                                className="neo-brutalism-card bg-white/5 rounded-xl p-4 relative overflow-hidden"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 + index * 0.3 }}
                                                whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                                            >
                                                {/* Shimmer effect */}
                                                <motion.div
                                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                                    initial={{ x: -200 }}
                                                    animate={{ x: 400 }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: index * 0.5 }}
                                                />

                                                <div className="flex items-center mb-2 relative z-10">
                                                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                                        <img
                                                            src={thread.participants.find(p => p.id === thread.messages[thread.messages.length - 1].userId)?.avatar}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex items-center text-xs text-white/70">
                                                        <p className="font-medium">
                                                            {thread.participants.find(p => p.id === thread.messages[thread.messages.length - 1].userId)?.name}
                                                        </p>
                                                        <p className="ml-2">
                                                            {thread.messages[thread.messages.length - 1].timestamp}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="text-sm line-clamp-2 relative z-10">
                                                    {thread.messages[thread.messages.length - 1].content}
                                                </p>

                                                {thread.messages[thread.messages.length - 1].episodeRef && (
                                                    <motion.div
                                                        className="mt-2 flex items-center text-xs bg-primary/20 rounded-lg p-2 relative z-10"
                                                        whileHover={{
                                                            backgroundColor: "rgba(143, 70, 193, 0.3)",
                                                            scale: 1.02
                                                        }}
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                                                            <FaPlay className="text-[8px] text-primary-light" />
                                                        </div>
                                                        <span>
                                                            Episode {thread.messages[thread.messages.length - 1].episodeRef.number}: {thread.messages[thread.messages.length - 1].episodeRef.timestamp}
                                                        </span>
                                                    </motion.div>
                                                )}
                                            </motion.div>

                                            {/* Bottom action bar */}
                                            <motion.div
                                                className="flex justify-between items-center mt-3"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.7 + index * 0.3 }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <motion.button
                                                        className="flex items-center text-white/70 text-sm"
                                                        whileHover={{ scale: 1.1, color: "#ffffff" }}
                                                    >
                                                        <FaComment className="mr-1 text-xs" />
                                                        <span>Reply</span>
                                                    </motion.button>

                                                    <motion.button
                                                        className="flex items-center text-white/70 text-sm"
                                                        whileHover={{ scale: 1.1, color: "#ffffff" }}
                                                    >
                                                        <FaBookmark className="mr-1 text-xs" />
                                                        <span>Save</span>
                                                    </motion.button>
                                                </div>

                                                <motion.button
                                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                                                    whileHover={{
                                                        scale: 1.1,
                                                        backgroundColor: "rgba(255,255,255,0.2)",
                                                        rotate: [0, 10, -10, 0]
                                                    }}
                                                    transition={{ duration: 0.5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FaEllipsisH className="text-xs" />
                                                </motion.button>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Thread View */}
                    {viewState === "thread" && selectedThread && (
                        <div className="h-[calc(100vh-136px)] flex flex-col">
                            {/* Episodes Navigation - Enhanced Horizontal Carousel */}
                            <motion.div
                                className="mb-6 pt-2 relative"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-bold flex items-center">
                                        <motion.div
                                            className="text-primary-light mr-2"
                                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                                            transition={{ duration: 5, repeat: Infinity }}
                                        >
                                            {selectedThread.seriesId === "series1" ? <FaSpaceShuttle /> :
                                                selectedThread.seriesId === "series2" ? <FaAtom /> : <FaBrain />}
                                        </motion.div>
                                        {selectedThread.title} Episodes
                                    </h3>
                                    <div className="text-sm text-white/60">
                                        {selectedThread.episodes.filter(ep => ep.viewed).length}/{selectedThread.episodes.length}
                                    </div>
                                </div>

                                {/* Episode indicators */}
                                <div className="w-full h-1 bg-white/10 rounded-full mb-4 relative">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-primary to-primary-secondary rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(selectedThread.episodes.filter(ep => ep.viewed).length / selectedThread.episodes.length) * 100}%` }}
                                        transition={{ duration: 1 }}
                                    />

                                    {/* Episode dots */}
                                    {selectedThread.episodes.map((_, idx) => (
                                        <motion.div
                                            key={idx}
                                            className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${activeEpisodeIndex === idx ? 'bg-primary' : selectedThread.episodes[idx].viewed ? 'bg-white/50' : 'bg-white/20'} border border-background`}
                                            style={{ left: `${(idx / (selectedThread.episodes.length - 1)) * 100}%` }}
                                            whileHover={{ scale: 1.5 }}
                                            animate={activeEpisodeIndex === idx ? {
                                                scale: [1, 1.2, 1],
                                                boxShadow: [
                                                    "0 0 0px rgba(143, 70, 193, 0.3)",
                                                    "0 0 10px rgba(143, 70, 193, 0.8)",
                                                    "0 0 0px rgba(143, 70, 193, 0.3)"
                                                ]
                                            } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            onClick={() => handleEpisodeSelect(idx)}
                                        />
                                    ))}
                                </div>

                                {/* Episodes carousel */}
                                <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory">
                                    {selectedThread.episodes.map((episode, index) => (
                                        <motion.div
                                            key={episode.number}
                                            className={`flex-shrink-0 w-36 rounded-xl overflow-hidden relative ${episode.locked ? 'grayscale' : ''} ${activeEpisodeIndex === index ? 'ring-2 ring-primary' : episode.viewed ? 'opacity-80' : 'opacity-50'} snap-center`}
                                            animate={{
                                                scale: activeEpisodeIndex === index ? 1 : 0.9,
                                                opacity: episode.locked ? 0.5 : 1
                                            }}
                                            whileHover={!episode.locked ? {
                                                scale: 1.05,
                                                boxShadow: "0 10px 25px rgba(143, 70, 193, 0.3)"
                                            } : {}}
                                            whileTap={!episode.locked ? { scale: 0.95 } : {}}
                                            onClick={() => handleEpisodeSelect(index)}
                                            initial={{ opacity: 0, x: 50 }}

                                        >
                                            {/* Thumbnail */}
                                            <div className="aspect-video bg-gray-800 relative">
                                                <img
                                                    src={episode.thumbnailUrl}
                                                    alt={`Episode ${episode.number}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                                                {/* Icon overlay in the center */}
                                                <motion.div
                                                    className="absolute inset-0 flex items-center justify-center text-white/30 text-3xl"
                                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }}
                                                    transition={{ duration: 5, repeat: Infinity, delay: index * 0.5 }}
                                                >
                                                    {episode.icon}
                                                </motion.div>

                                                <div className="absolute bottom-1 left-2 text-xs font-bold flex items-center">
                                                    <motion.div
                                                        className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/70 mr-1"
                                                        animate={activeEpisodeIndex === index ? {
                                                            scale: [1, 1.2, 1],
                                                            backgroundColor: ["rgba(143, 70, 193, 0.7)", "rgba(143, 70, 193, 0.9)", "rgba(143, 70, 193, 0.7)"]
                                                        } : {}}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    >
                                                        {episode.number}
                                                    </motion.div>
                                                </div>

                                                {episode.viewed && (
                                                    <motion.div
                                                        className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.3 + index * 0.1 }}
                                                    >
                                                        <FaCheck className="text-[8px]" />
                                                    </motion.div>
                                                )}

                                                {episode.locked && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0.8 }}
                                                        transition={{ delay: 0.3 + index * 0.1 }}
                                                        whileHover={{ opacity: 0.7 }}
                                                    >
                                                        <motion.div
                                                            animate={controls}
                                                        >
                                                            <FaLock className="text-white/80 text-xl" />
                                                        </motion.div>
                                                    </motion.div>
                                                )}

                                                {!episode.locked && (
                                                    <motion.div
                                                        className="absolute bottom-1 right-1 text-xs font-bold bg-black/60 rounded-sm px-1.5 py-0.5"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.3 }}
                                                    >
                                                        {episode.duration}
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Episode title */}
                                            <div className="p-2 bg-white/5">
                                                <p className="text-xs font-medium line-clamp-1">{episode.title}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Messages Container with 3D Perspective */}
                            <div className="flex-1 overflow-y-auto relative">
                                <div className="space-y-4 p-1">
                                    {messages.map((message, index) => {
                                        const isCurrentUser = message.userId === userData.id;
                                        const sender = selectedThread.participants.find(p => p.id === message.userId);

                                        return (
                                            <motion.div
                                                key={message.id}
                                                className={`flex ${isCurrentUser ? 'justify-end' : ''}`}
                                                initial={{ opacity: 0, y: 20, x: isCurrentUser ? 20 : -20 }}
                                                animate={{ opacity: 1, y: 0, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                {!isCurrentUser && (
                                                    <motion.div
                                                        className="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0"
                                                        whileHover={{ scale: 1.1 }}
                                                    >
                                                        <img
                                                            src={sender?.avatar}
                                                            alt={sender?.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </motion.div>
                                                )}

                                                <motion.div
                                                    className={`max-w-[75%] neo-brutalism-card relative rounded-2xl p-3 ${isCurrentUser ? 'bg-gradient-to-r from-primary/30 to-primary-secondary/30 rounded-tr-none' : 'bg-white/10 rounded-tl-none'}`}
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    {/* Shimmer effect on hover */}
                                                    <motion.div
                                                        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl"
                                                        initial={{ opacity: 0, x: -100 }}
                                                        whileHover={{ opacity: 1, x: 200 }}
                                                        transition={{ duration: 1 }}
                                                    />

                                                    <div className="flex items-center mb-1">
                                                        <p className="text-sm font-semibold">{isCurrentUser ? 'You' : sender?.name}</p>
                                                        <p className="text-xs text-white/40 ml-2">{message.timestamp}</p>
                                                    </div>

                                                    <p className="text-sm">{message.content}</p>

                                                    {message.episodeRef && (
                                                        <motion.div
                                                            className="mt-2 flex items-center text-xs bg-white/10 rounded-lg p-2 cursor-pointer"
                                                            whileHover={{
                                                                scale: 1.05,
                                                                backgroundColor: "rgba(255,255,255,0.15)",
                                                                boxShadow: "0 10px 15px -3px rgba(143, 70, 193, 0.1)"
                                                            }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <motion.div
                                                                className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center mr-2"
                                                                animate={{ rotate: [0, 360] }}
                                                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                                            >
                                                                <FaPlay className="text-[8px]" />
                                                            </motion.div>
                                                            <div>
                                                                <p className="font-semibold">Episode {message.episodeRef.number}: {message.episodeRef.title}</p>
                                                                <p className="text-white/60">{message.episodeRef.timestamp}</p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            </motion.div>
                                        );
                                    })}

                                    {/* Typing indicator */}
                                    <AnimatePresence>
                                        {isTyping && (
                                            <motion.div
                                                className="flex"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <div className="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                                    <img
                                                        src={selectedThread.participants.find(p => p.id !== userData.id)?.avatar}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="neo-brutalism-card bg-white/10 rounded-2xl rounded-tl-none p-4">
                                                    <div className="flex space-x-2">
                                                        <motion.div
                                                            className="w-2 h-2 bg-white/60 rounded-full"
                                                            animate={{ y: [0, -6, 0] }}
                                                            transition={{ duration: 1, repeat: Infinity, delay: 0, repeatType: "loop" }}
                                                        />
                                                        <motion.div
                                                            className="w-2 h-2 bg-white/60 rounded-full"
                                                            animate={{ y: [0, -6, 0] }}
                                                            transition={{ duration: 1, repeat: Infinity, delay: 0.2, repeatType: "loop" }}
                                                        />
                                                        <motion.div
                                                            className="w-2 h-2 bg-white/60 rounded-full"
                                                            animate={{ y: [0, -6, 0] }}
                                                            transition={{ duration: 1, repeat: Infinity, delay: 0.4, repeatType: "loop" }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div ref={messagesEndRef} />

                                    {/* What-If UI */}
                                    {selectedThread.whatIfScenarios && selectedThread.whatIfScenarios.length > 0 && (
                                        <div className="my-6">
                                            <div className="flex justify-center">
                                                <motion.button
                                                    className="neo-brutalism-card bg-gradient-to-r from-primary/20 to-primary-secondary/20 text-white rounded-full px-6 py-3 flex items-center text-sm"
                                                    whileHover={{
                                                        scale: 1.05,
                                                        boxShadow: "0 15px 30px -5px rgba(143, 70, 193, 0.4)"
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={generateWhatIf}
                                                    animate={controls}
                                                >
                                                    <motion.div
                                                        className="text-primary-light mr-2"
                                                        animate={{
                                                            rotate: [0, 10, 0, -10, 0],
                                                            scale: [1, 1.2, 1]
                                                        }}
                                                        transition={{ duration: 3, repeat: Infinity }}
                                                    >
                                                        <FaLightbulb />
                                                    </motion.div>
                                                    <motion.div
                                                        className="text-primary-light mr-2"
                                                        animate={{
                                                            scale: [1, 1.2, 1],
                                                            opacity: [0.7, 1, 0.7]
                                                        }}
                                                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                                    >
                                                        <FaMagic />
                                                    </motion.div>
                                                    Generate What-If Scenario
                                                </motion.button>
                                            </div>

                                            <AnimatePresence>
                                                {showWhatIf && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0, y: 20 }}
                                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                        exit={{ opacity: 0, height: 0, y: -20 }}
                                                        transition={{ type: "spring", damping: 20 }}
                                                        className="mt-6 overflow-hidden"
                                                    >
                                                        <motion.div
                                                            className="neo-brutalism-card bg-gradient-to-r from-primary/20 to-primary-secondary/20 rounded-xl border border-primary/30 relative overflow-hidden"
                                                            initial={{ y: 50, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.2 }}
                                                            whileHover={{
                                                                scale: 1.02,
                                                                boxShadow: "0 15px 30px -5px rgba(143, 70, 193, 0.3)"
                                                            }}
                                                        >
                                                            {/* Abstract background shapes */}
                                                            <div className="absolute inset-0 overflow-hidden opacity-20">
                                                                <motion.div
                                                                    className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-primary/50 to-transparent rounded-full"
                                                                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                                                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                                                />
                                                                <motion.div
                                                                    className="absolute left-1/3 bottom-0 w-16 h-16 bg-gradient-to-tr from-primary-secondary/50 to-transparent rounded-full"
                                                                    animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                                                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                                                />
                                                            </div>

                                                            {/* Content */}
                                                            <div className="p-5 relative z-10">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex items-center">
                                                                        <motion.div
                                                                            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-primary-secondary/40 flex items-center justify-center mr-3"
                                                                            animate={{
                                                                                scale: [1, 1.1, 1],
                                                                                rotate: [0, 5, 0, -5, 0],
                                                                                boxShadow: [
                                                                                    "0 0 0px rgba(143, 70, 193, 0.4)",
                                                                                    "0 0 20px rgba(143, 70, 193, 0.6)",
                                                                                    "0 0 0px rgba(143, 70, 193, 0.4)"
                                                                                ]
                                                                            }}
                                                                            transition={{ duration: 4, repeat: Infinity }}
                                                                        >
                                                                            <FaLightbulb className="text-white text-lg" />
                                                                        </motion.div>
                                                                        <div>
                                                                            <motion.h3
                                                                                className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary-secondary"
                                                                                animate={{
                                                                                    backgroundPosition: ["0% center", "100% center", "0% center"],
                                                                                }}
                                                                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                                                                style={{
                                                                                    backgroundSize: "200% auto",
                                                                                }}
                                                                            >
                                                                                What if... black holes are portals?
                                                                            </motion.h3>
                                                                            <p className="text-sm text-white/70">Alternate reality exploration</p>
                                                                        </div>
                                                                    </div>
                                                                    <motion.button
                                                                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                                                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => setShowWhatIf(false)}
                                                                    >
                                                                        <FaTimes className="text-xs" />
                                                                    </motion.button>
                                                                </div>

                                                                <p className="mt-4 text-base pb-2 border-b border-white/10">Alternative theory generated based on the series content. This could explain disappearing matter.</p>

                                                                {/* Theory details */}
                                                                <div className="mt-4 text-sm space-y-3">
                                                                    <motion.p
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        transition={{ delay: 0.4 }}
                                                                    >
                                                                        Current physics suggests matter falling into black holes is compressed to infinite density at the singularity. But what if instead, black holes connect to other regions of spacetime or even other universes?
                                                                    </motion.p>

                                                                    <motion.p
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        transition={{ delay: 0.6 }}
                                                                    >
                                                                        This theory, while speculative, could potentially explain several anomalies in our astronomical observations and would fundamentally change our understanding of space, time, and gravity.
                                                                    </motion.p>
                                                                </div>

                                                                <div className="mt-5 flex space-x-3">
                                                                    <motion.button
                                                                        className="px-4 py-2 bg-gradient-to-r from-primary/60 to-primary-secondary/60 hover:from-primary/80 hover:to-primary-secondary/80 rounded-full text-sm font-medium flex items-center"
                                                                        whileHover={{
                                                                            scale: 1.05,
                                                                            boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)"
                                                                        }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        <FaRandom className="mr-2" /> Explore this theory
                                                                    </motion.button>

                                                                    <motion.button
                                                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium flex items-center"
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        <FaShareAlt className="mr-2" /> Share
                                                                    </motion.button>
                                                                </div>
                                                            </div>
                                                        </motion.div>

                                                        {/* Alternative scenarios */}
                                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                                            {selectedThread.whatIfScenarios.map((scenario, idx) => (
                                                                <motion.div
                                                                    key={scenario.id}
                                                                    className="neo-brutalism-card bg-white/5 relative overflow-hidden"
                                                                    initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: 0.5 + idx * 0.2 }}
                                                                    whileHover={{
                                                                        backgroundColor: "rgba(255,255,255,0.1)",
                                                                        y: -3,
                                                                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                                                                    }}
                                                                >
                                                                    {/* Abstract background shape */}
                                                                    <div className="absolute inset-0 opacity-20">
                                                                        <motion.div
                                                                            className="absolute -right-10 -bottom-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary/60 to-transparent"
                                                                            animate={{ rotate: 360 }}
                                                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                                        />
                                                                    </div>

                                                                    <div className="p-3 relative z-10">
                                                                        <h4 className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary-secondary mb-1">
                                                                            {scenario.title}
                                                                        </h4>
                                                                        <p className="text-xs text-white/70">{scenario.description}</p>

                                                                        <motion.button
                                                                            className="mt-2 w-full py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium flex items-center justify-center"
                                                                            whileHover={{ scale: 1.05 }}
                                                                            whileTap={{ scale: 0.95 }}
                                                                        >
                                                                            <FaMagic className="mr-1 text-primary-light" /> Generate
                                                                        </motion.button>
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message Input - Floating style */}
                            <motion.div
                                className="p-4 relative"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="neo-brutalism-card flex items-center bg-white/5 backdrop-blur-lg rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="bg-transparent flex-1 focus:outline-none text-base py-2"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <div className="flex items-center space-x-2 ml-2">
                                        <motion.button
                                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary-light"
                                            whileHover={{
                                                scale: 1.1,
                                                backgroundColor: "rgba(255,255,255,0.15)",
                                                rotate: [0, 15, 0]
                                            }}
                                            transition={{ duration: 0.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FaPlay className="text-sm" />
                                        </motion.button>
                                        <motion.button
                                            className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-secondary flex items-center justify-center shadow-glow"
                                            whileHover={{
                                                scale: 1.1,
                                                boxShadow: "0 0 25px rgba(143, 70, 193, 0.6)"
                                            }}
                                            whileTap={{ scale: 0.9, rotate: -10 }}
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                        >
                                            <FaPaperPlane className="text-white" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Smart reply suggestions */}
                                <div className="mt-3 flex space-x-2 overflow-x-auto hide-scrollbar pb-1">
                                    {["Great point!", "I agree!", "Could you explain?", "What about..."].map((phrase, i) => (
                                        <motion.button
                                            key={i}
                                            className="flex-shrink-0 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5 text-sm"
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                            onClick={() => setNewMessage(phrase)}
                                        >
                                            {phrase}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Create Thread Flow */}
                    {viewState === "create-thread" && (
                        <div className="py-6">
                            {/* Step 1: Content Preview */}
                            {createThreadState.step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <motion.h3
                                        className="text-xl font-bold mb-4 flex items-center"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <motion.div
                                            className="text-primary-light mr-2"
                                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                                            transition={{ duration: 5, repeat: Infinity }}
                                        >
                                            <FaShareAlt />
                                        </motion.div>
                                        Create Discussion Thread
                                    </motion.h3>

                                    {/* Series preview */}
                                    <motion.div
                                        className="neo-brutalism-card rounded-2xl overflow-hidden mb-6 relative"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
                                        }}
                                    >
                                        {/* Background patterns */}
                                        <div className="absolute inset-0 overflow-hidden opacity-30">
                                            <motion.div
                                                className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-gradient-to-br from-primary/40 to-transparent"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            />
                                            <motion.div
                                                className="absolute -left-10 -bottom-10 w-20 h-20 rounded-full bg-gradient-to-tr from-primary-secondary/40 to-transparent"
                                                animate={{ rotate: -360 }}
                                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>

                                        <div className="h-48 relative overflow-hidden">
                                            <img
                                                src={getSeriesById(createThreadState.seriesId)?.thumbnailUrl}
                                                alt={getSeriesById(createThreadState.seriesId)?.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-tr opacity-50 ${getSeriesById(createThreadState.seriesId)?.color || 'from-primary to-primary-secondary'}`}></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                                            <div className="absolute bottom-0 left-0 w-full p-5">
                                                <motion.h4
                                                    className="text-2xl font-bold mb-1"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    {getSeriesById(createThreadState.seriesId)?.title}
                                                </motion.h4>
                                                <motion.div
                                                    className="flex items-center"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    <div className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-xs mr-2">
                                                        {getSeriesById(createThreadState.seriesId)?.progress} of {getSeriesById(createThreadState.seriesId)?.episodes} episodes
                                                    </div>

                                                    <div className="flex space-x-1">
                                                        {getSeriesById(createThreadState.seriesId)?.tags.slice(0, 2).map((tag, idx) => (
                                                            <motion.span
                                                                key={idx}
                                                                className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-xs"
                                                                initial={{ opacity: 0, scale: 0.5 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 0.6 + idx * 0.1 }}
                                                            >
                                                                {tag}
                                                            </motion.span>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </div>

                                            {/* Animated icon */}
                                            <motion.div
                                                className="absolute top-5 right-5 text-4xl text-white/30"
                                                animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 1] }}
                                                transition={{ duration: 6, repeat: Infinity }}
                                            >
                                                {getSeriesById(createThreadState.seriesId)?.id === "series1" ? <FaSpaceShuttle /> :
                                                    getSeriesById(createThreadState.seriesId)?.id === "series2" ? <FaAtom /> : <FaBrain />}
                                            </motion.div>
                                        </div>

                                        <div className="p-5 relative z-10">
                                            <motion.p
                                                className="text-base text-white/80 mb-5"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                {getSeriesById(createThreadState.seriesId)?.description}
                                            </motion.p>

                                            <div className="mb-6">
                                                <motion.h5
                                                    className="font-semibold text-lg mb-3 flex items-center"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.7 }}
                                                >
                                                    <motion.div
                                                        className="text-primary-light mr-2"
                                                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                                                        transition={{ duration: 5, repeat: Infinity }}
                                                    >
                                                        <FaRandom />
                                                    </motion.div>
                                                    Share Options
                                                </motion.h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <motion.button
                                                        className="neo-brutalism-card bg-gradient-to-r from-primary/20 to-primary-secondary/20 p-4 rounded-xl flex flex-col items-center justify-center border-2 border-primary/50 relative overflow-hidden"
                                                        whileHover={{
                                                            scale: 1.03,
                                                            boxShadow: "0 25px 50px -12px rgba(143, 70, 193, 0.3)"
                                                        }}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.8 }}
                                                    >
                                                        {/* Animated background effect */}
                                                        <motion.div
                                                            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary-secondary/10 to-primary/10"
                                                            animate={{
                                                                backgroundPosition: ["0% center", "100% center", "0% center"],
                                                            }}
                                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                                            style={{
                                                                backgroundSize: "200% auto",
                                                            }}
                                                        />

                                                        <motion.div
                                                            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary-secondary/30 flex items-center justify-center mb-3 relative z-10"
                                                            animate={{
                                                                scale: [1, 1.1, 1],
                                                                boxShadow: [
                                                                    "0 0 0px rgba(143, 70, 193, 0.3)",
                                                                    "0 0 25px rgba(143, 70, 193, 0.6)",
                                                                    "0 0 0px rgba(143, 70, 193, 0.3)"
                                                                ]
                                                            }}
                                                            transition={{ duration: 3, repeat: Infinity }}
                                                        >
                                                            <FaComment className="text-2xl text-white" />
                                                        </motion.div>
                                                        <h6 className="text-lg font-bold z-10">Create Thread</h6>
                                                        <p className="text-sm text-white/70 text-center z-10">Discuss with friends in a private group</p>
                                                    </motion.button>

                                                    <motion.button
                                                        className="neo-brutalism-card bg-white/5 p-4 rounded-xl flex flex-col items-center justify-center"
                                                        whileHover={{
                                                            scale: 1.03,
                                                            backgroundColor: "rgba(255,255,255,0.1)"
                                                        }}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.9 }}
                                                    >
                                                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
                                                            <FaShareAlt className="text-2xl text-white/80" />
                                                        </div>
                                                        <h6 className="text-lg font-bold">Share Link</h6>
                                                        <p className="text-sm text-white/70 text-center">Copy or send to anyone</p>
                                                    </motion.button>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <motion.button
                                                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary-secondary hover:from-primary-dark hover:to-primary-secondary rounded-full text-base font-medium flex items-center shadow-glow"
                                                    whileHover={{
                                                        scale: 1.05,
                                                        boxShadow: "0 20px 40px -10px rgba(143, 70, 193, 0.5)"
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setCreateThreadState(prev => ({ ...prev, step: 2 }))}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 1 }}
                                                >
                                                    <span className="mr-2">Continue</span>
                                                    <motion.div
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                                    >
                                                        →
                                                    </motion.div>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Step 2: Friend Selection */}
                            {createThreadState.step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <motion.h3
                                        className="text-xl font-bold mb-6 flex items-center"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <motion.div
                                            className="text-primary-light mr-2"
                                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                                            transition={{ duration: 5, repeat: Infinity }}
                                        >
                                            <FaUser />
                                        </motion.div>
                                        Add Participants
                                    </motion.h3>

                                    {/* Series badge */}
                                    <motion.div
                                        className="flex justify-between items-center mb-6 neo-brutalism-card py-2 px-4 rounded-full"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                                <img
                                                    src={getSeriesById(createThreadState.seriesId)?.thumbnailUrl}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="font-medium">{getSeriesById(createThreadState.seriesId)?.title}</span>
                                        </div>
                                        <div className="bg-primary/20 rounded-full px-2 py-0.5 text-xs">
                                            {getSeriesById(createThreadState.seriesId)?.progress}/{getSeriesById(createThreadState.seriesId)?.episodes} ep
                                        </div>
                                    </motion.div>

                                    {/* Search bar */}
                                    <motion.div
                                        className="relative mb-6"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaSearch className="text-white/40" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search friends by name..."
                                            className="w-full neo-brutalism-card bg-white/5 rounded-full px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                                        />
                                    </motion.div>

                                    {/* Selected Friends */}
                                    <AnimatePresence>
                                        {createThreadState.selectedFriends.length > 0 && (
                                            <motion.div
                                                className="mb-6"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                            >
                                                <motion.div
                                                    className="flex justify-between items-center mb-3"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    <p className="text-base text-white/80 font-medium">Selected ({createThreadState.selectedFriends.length})</p>

                                                    {createThreadState.selectedFriends.length > 1 && (
                                                        <motion.button
                                                            className="text-sm text-primary-light"
                                                            whileHover={{ scale: 1.05 }}

                                                        >
                                                            Clear all
                                                        </motion.button>
                                                    )}
                                                </motion.div>

                                                <div className="flex flex-wrap gap-2">
                                                    {createThreadState.selectedFriends.map((friend, index) => (
                                                        <motion.div
                                                            key={friend.id}
                                                            className="neo-brutalism-card bg-primary/20 rounded-full pl-2 pr-3 py-1.5 flex items-center"
                                                            onClick={() => toggleFriendSelection(friend)}
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5, x: -20 }}
                                                            transition={{ delay: 0.5 + index * 0.05 }}
                                                            whileHover={{
                                                                backgroundColor: "rgba(143, 70, 193, 0.3)",
                                                                scale: 1.05
                                                            }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-white/20">
                                                                <img
                                                                    src={friend.avatar}
                                                                    alt={friend.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium">{friend.name}</span>
                                                            <motion.div
                                                                className="ml-2 text-white/80"
                                                                whileHover={{ rotate: 90, color: "#ffffff" }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <FaTimes className="text-xs" />
                                                            </motion.div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Friends list */}
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        <motion.p
                                            className="text-base text-white/80 font-medium mb-3"
                                            variants={staggerItem}
                                        >
                                            Suggested Friends
                                        </motion.p>
                                        <div className="space-y-3">
                                            {friendsData.map((friend, index) => (
                                                <motion.div
                                                    key={friend.id}
                                                    className="neo-brutalism-card rounded-xl p-4 relative overflow-hidden"
                                                    variants={staggerItem}
                                                    whileHover={{
                                                        scale: 1.02,
                                                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)"
                                                    }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => toggleFriendSelection(friend)}
                                                >
                                                    {/* Background pattern */}
                                                    <div className="absolute inset-0 opacity-5">
                                                        <motion.div
                                                            className="absolute -right-20 top-0 w-40 h-40 rounded-full bg-gradient-to-br from-primary to-transparent"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                                        />
                                                    </div>

                                                    <div className="flex justify-between items-center relative z-10">
                                                        <div className="flex items-center">
                                                            <div className="relative">
                                                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                                                                    <img
                                                                        src={friend.avatar}
                                                                        alt={friend.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                {friend.isOnline && (
                                                                    <motion.div
                                                                        className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
                                                                        animate={{
                                                                            boxShadow: [
                                                                                "0 0 0px rgba(74, 222, 128, 0.5)",
                                                                                "0 0 8px rgba(74, 222, 128, 0.8)",
                                                                                "0 0 0px rgba(74, 222, 128, 0.5)"
                                                                            ]
                                                                        }}
                                                                        transition={{ duration: 2, repeat: Infinity }}
                                                                    />
                                                                )}
                                                            </div>

                                                            <div className="ml-3">
                                                                <p className="font-medium text-base">{friend.name}</p>
                                                                <div className="flex items-center text-sm text-white/60">
                                                                    <span>{friend.username}</span>
                                                                    {!friend.isOnline && friend.lastActive && (
                                                                        <span className="ml-2 text-xs bg-white/10 px-1.5 py-0.5 rounded">
                                                                            {friend.lastActive}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="flex mt-1 flex-wrap">
                                                                    {friend.interests.slice(0, 2).map((interest, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className="text-xs bg-white/10 rounded-full px-2 py-0.5 mr-1"
                                                                        >
                                                                            {interest}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <motion.div
                                                            className={`w-8 h-8 rounded-full ${createThreadState.selectedFriends.some(f => f.id === friend.id) ? 'bg-primary' : 'bg-white/10'} flex items-center justify-center`}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            animate={createThreadState.selectedFriends.some(f => f.id === friend.id) ? {
                                                                scale: [1, 1.1, 1],
                                                                boxShadow: [
                                                                    "0 0 0px rgba(143, 70, 193, 0.3)",
                                                                    "0 0 10px rgba(143, 70, 193, 0.5)",
                                                                    "0 0 0px rgba(143, 70, 193, 0.3)"
                                                                ]
                                                            } : {}}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                        >
                                                            {createThreadState.selectedFriends.some(f => f.id === friend.id) && (
                                                                <FaCheck className="text-xs" />
                                                            )}
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Create button */}
                                    <motion.div
                                        className="mt-8 flex justify-end"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <motion.button
                                            className={`rounded-full px-8 py-4 flex items-center ${createThreadState.selectedFriends.length > 0 ? 'bg-gradient-to-r from-primary to-primary-secondary shadow-glow' : 'bg-white/10'}`}
                                            whileHover={createThreadState.selectedFriends.length > 0 ? {
                                                scale: 1.05,
                                                boxShadow: "0 20px 40px -10px rgba(143, 70, 193, 0.5)"
                                            } : {}}
                                            whileTap={createThreadState.selectedFriends.length > 0 ? { scale: 0.95 } : {}}
                                            disabled={createThreadState.selectedFriends.length === 0}
                                            onClick={() => setViewState("profile")}
                                        >
                                            <span className="mr-2 text-base font-medium">Start Thread</span>
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                →
                                            </motion.div>
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.main>
            </AnimatePresence>

            {/* Mobile Bottom Navigation */}
            <motion.nav
                className="fixed bottom-0 inset-x-0 h-16 bg-background/80 backdrop-blur-md border-t border-white/10 flex items-center justify-around z-30"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
            >
                <Link href="/">
                    <motion.div
                        className="flex flex-col items-center text-white/70"
                        whileHover={{ scale: 1.1, color: "#d56f66" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaHome className="text-xl mb-1" />
                        <span className="text-xs">Home</span>
                    </motion.div>
                </Link>

                <Link href="/feed">
                    <motion.div
                        className="flex flex-col items-center text-white/70"
                        whileHover={{ scale: 1.1, color: "#d56f66" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPlay className="text-xl mb-1" />
                        <span className="text-xs">Feed</span>
                    </motion.div>
                </Link>

                <Link href="/create">
                    <motion.div
                        className="w-12 h-12 bg-gradient-to-r from-primary to-primary-secondary rounded-full flex items-center justify-center -mt-4 shadow-lg"
                        whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPlus className="text-lg" />
                    </motion.div>
                </Link>

                <Link href="/explore">
                    <motion.div
                        className="flex flex-col items-center text-white"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="relative">
                            <FaCompass className="text-xl mb-1 text-primary" />
                            <motion.div
                                className="absolute -top-1 -right-1 w-2 h-2 bg-primary-secondary rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <span className="text-xs text-primary-light">Explore</span>
                    </motion.div>
                </Link>

                <Link href="/profile">
                    <motion.div
                        className="flex flex-col items-center text-white/70"
                        whileHover={{ scale: 1.1, color: "#d56f66" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaUser className="text-xl mb-1" />
                        <span className="text-xs">Profile</span>
                    </motion.div>
                </Link>
            </motion.nav>

            {/* CSS Styles */}
            <style jsx global>{`
        .neo-brutalism-card {
          background: rgba(36, 27, 46, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .gradient-text {
          background: linear-gradient(to right, var(--primary), var(--primary-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .shadow-glow {
          box-shadow: 0 0 15px rgba(143, 70, 193, 0.3);
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
        </div>
    );
}