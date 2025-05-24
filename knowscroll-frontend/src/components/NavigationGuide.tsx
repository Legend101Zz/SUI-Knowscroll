/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaInfoCircle, FaTimes, FaVideo, FaStreetView, FaGlobe, FaArrowsAlt, FaCheckCircle, FaLightbulb, FaComment, FaStar } from 'react-icons/fa';
import { Reel } from '@/types';
import { reels } from '@/data/reels';

interface NavigationGuideProps {
    currentReelId: string;
    onClose: () => void;
}

export default function NavigationGuide({ currentReelId, onClose }: NavigationGuideProps) {
    const [currentReel, setCurrentReel] = useState<Reel | null>(null);
    const [showFullGuide, setShowFullGuide] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'examples' | 'advanced'>('overview');
    const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
    const [activeTutorialStep, setActiveTutorialStep] = useState(0);

    // Determine navigation possibilities
    const [canNavigateUp, setCanNavigateUp] = useState(false);
    const [canNavigateDown, setCanNavigateDown] = useState(false);
    const [canNavigateLeft, setCanNavigateLeft] = useState(false);
    const [canNavigateRight, setCanNavigateRight] = useState(false);

    useEffect(() => {
        const reel = reels.find(r => r.id === currentReelId);
        if (reel) {
            setCurrentReel(reel);

            // Check if we can navigate up (next episode in series)
            setCanNavigateUp(Boolean(
                reel.seriesId && reel.episodeNumber &&
                reels.some(r => r.seriesId === reel.seriesId && r.episodeNumber === (reel.episodeNumber! + 1))
            ));

            // Check if we can navigate down (previous episode in series)
            setCanNavigateDown(Boolean(
                reel.seriesId && reel.episodeNumber && reel.episodeNumber > 1 &&
                reels.some(r => r.seriesId === reel.seriesId && r.episodeNumber === (reel.episodeNumber! - 1))
            ));

            // Check if we can navigate left (alternateVersions or related content)
            setCanNavigateLeft(Boolean(
                (reel.alternateVersions && reel.alternateVersions.length > 0) ||
                (reel.tags && reel.tags.length > 0 &&
                    reels.some(r => r.id !== reel.id && r.tags.some(tag => reel.tags.includes(tag))))
            ));

            // Check if we can navigate right (alternateVersions or related content)
            setCanNavigateRight(Boolean(
                (reel.alternateVersions && reel.alternateVersions.length > 0) ||
                (reel.tags && reel.tags.length > 0 &&
                    reels.some(r => r.id !== reel.id && r.tags.some(tag => reel.tags.includes(tag))))
            ));
        }
    }, [currentReelId]);

    // Check local storage for tutorial completion
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const tutorialCompleted = localStorage.getItem('knowscroll_tutorial_completed');
            if (tutorialCompleted) {
                setHasCompletedTutorial(true);
            }
        }
    }, []);

    // Mark tutorial as completed
    const completeTutorial = () => {
        setHasCompletedTutorial(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('knowscroll_tutorial_completed', 'true');
        }
    };

    if (!currentReel) return null;

    // Determine navigation labels
    const getNavigationLabels = () => {
        return {
            up: currentReel.seriesId ? "Next Episode" : "Related Content",
            down: currentReel.seriesId ? "Previous Episode" : "Related Content",
            left: currentReel.alternateVersions ? "Alternate View" : "Related Content",
            right: currentReel.alternateVersions ? "Alternate View" : "Related Content"
        };
    };

    const navigationLabels = getNavigationLabels();

    // Tutorial steps
    const tutorialSteps = [
        {
            title: "Welcome to Multi-Dimensional Navigation!",
            description: "KnowScroll lets you explore content in new ways. Let's learn how it works.",
            icon: <FaGlobe className="text-2xl" />
        },
        {
            title: "Vertical Navigation",
            description: "Swipe UP to move to the next episode in a series. Swipe DOWN to go to the previous episode.",
            icon: <FaArrowUp className="text-2xl" />
        },
        {
            title: "Horizontal Navigation",
            description: "Swipe LEFT to see alternate perspectives on the same topic. Swipe RIGHT to explore related content.",
            icon: <FaArrowLeft className="text-2xl" />
        },
        {
            title: "Keyboard Controls",
            description: "On desktop, use arrow keys to navigate. Space to play/pause, M to mute, and I for info.",
            icon: <FaArrowsAlt className="text-2xl" />
        },
        {
            title: "You're All Set!",
            description: "Now you can navigate content like never before. Enjoy your learning journey!",
            icon: <FaCheckCircle className="text-2xl" />
        }
    ];

    return (
        <AnimatePresence mode="wait">
            {showFullGuide ? (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-full max-w-4xl mx-auto bg-background/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                    >
                        {/* Header */}
                        <div className="relative px-6 py-4 border-b border-white/10 flex items-center justify-center">
                            <div className="absolute left-4">
                                <motion.button
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                >
                                    <FaTimes />
                                </motion.button>
                            </div>

                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary mx-auto">
                                Multi-Dimensional Content Navigation
                            </h2>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-white/10">
                            <motion.button
                                className={`flex-1 py-3 px-4 text-center text-sm font-medium ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-white/70 hover:text-white'}`}
                                whileHover={{ backgroundColor: activeTab !== 'overview' ? "rgba(255,255,255,0.05)" : undefined }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </motion.button>
                            <motion.button
                                className={`flex-1 py-3 px-4 text-center text-sm font-medium ${activeTab === 'examples' ? 'text-primary border-b-2 border-primary' : 'text-white/70 hover:text-white'}`}
                                whileHover={{ backgroundColor: activeTab !== 'examples' ? "rgba(255,255,255,0.05)" : undefined }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab('examples')}
                            >
                                Examples
                            </motion.button>
                            <motion.button
                                className={`flex-1 py-3 px-4 text-center text-sm font-medium ${activeTab === 'advanced' ? 'text-primary border-b-2 border-primary' : 'text-white/70 hover:text-white'}`}
                                whileHover={{ backgroundColor: activeTab !== 'advanced' ? "rgba(255,255,255,0.05)" : undefined }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab('advanced')}
                            >
                                Advanced Tips
                            </motion.button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <p className="text-white/80 mb-6 text-center max-w-2xl mx-auto">
                                            KnowScroll introduces a revolutionary way to explore content - in multiple dimensions.
                                            Navigate seamlessly between episodes, alternate perspectives, and related topics.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            {/* Vertical Navigation */}
                                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 relative overflow-hidden">
                                                {/* Decorative gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                                                <div className="flex items-start">
                                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border border-primary/30">
                                                        <FaArrowUp className="text-primary-light text-lg" />
                                                        <FaArrowDown className="text-primary-light text-lg ml-1" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg mb-1">Vertical Navigation</h3>
                                                        <p className="text-white/70 text-sm mb-3">
                                                            Move through sequential content like episodes in a series:
                                                        </p>
                                                        <ul className="space-y-2">
                                                            <li className="flex items-center">
                                                                <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center mr-2">
                                                                    <FaArrowUp className="text-xs" />
                                                                </div>
                                                                <span className="text-sm">Swipe up for next episode</span>
                                                            </li>
                                                            <li className="flex items-center">
                                                                <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center mr-2">
                                                                    <FaArrowDown className="text-xs" />
                                                                </div>
                                                                <span className="text-sm">Swipe down for previous episode</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Horizontal Navigation */}
                                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 relative overflow-hidden">
                                                {/* Decorative gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary-secondary/5 to-transparent pointer-events-none" />

                                                <div className="flex items-start">
                                                    <div className="w-12 h-12 bg-primary-secondary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 border border-primary-secondary/30">
                                                        <FaArrowLeft className="text-primary-secondary text-lg" />
                                                        <FaArrowRight className="text-primary-secondary text-lg ml-1" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg mb-1">Horizontal Navigation</h3>
                                                        <p className="text-white/70 text-sm mb-3">
                                                            Explore different perspectives or related topics:
                                                        </p>
                                                        <ul className="space-y-2">
                                                            <li className="flex items-center">
                                                                <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center mr-2">
                                                                    <FaArrowLeft className="text-xs" />
                                                                </div>
                                                                <span className="text-sm">Swipe left for alternate perspectives</span>
                                                            </li>
                                                            <li className="flex items-center">
                                                                <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center mr-2">
                                                                    <FaArrowRight className="text-xs" />
                                                                </div>
                                                                <span className="text-sm">Swipe right for related topics</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Device-specific controls */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10">
                                                <h3 className="font-bold mb-3 flex items-center">
                                                    <FaStreetView className="mr-2" /> Mobile Controls
                                                </h3>
                                                <ul className="space-y-2 text-sm text-white/80">
                                                    <li>• Swipe in any direction to navigate</li>
                                                    <li>• Tap once to show/hide controls</li>
                                                    <li>• Double tap to play/pause</li>
                                                    <li>• Pinch to access more options</li>
                                                </ul>
                                            </div>

                                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10">
                                                <h3 className="font-bold mb-3 flex items-center">
                                                    <FaVideo className="mr-2" /> Desktop Controls
                                                </h3>
                                                <ul className="space-y-2 text-sm text-white/80">
                                                    <li>• Arrow keys to navigate dimensions</li>
                                                    <li>• Space to play/pause</li>
                                                    <li>• M to mute/unmute</li>
                                                    <li>• I to show video information</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Interactive tutorial button */}
                                        <div className="mt-8 text-center">
                                            <motion.button
                                                className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-secondary rounded-full shadow-lg shadow-primary/20 font-medium text-sm"
                                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)" }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setShowFullGuide(false);
                                                    // Launch tutorial (in a real app)
                                                }}
                                            >
                                                Start Interactive Tutorial
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'examples' && (
                                    <motion.div
                                        key="examples"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <p className="text-white/80 mb-6">
                                            Here are some real-world examples of how multi-dimensional navigation enhances your learning experience:
                                        </p>

                                        <div className="space-y-6">
                                            {/* Example 1 */}
                                            <div className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
                                                <div className="p-5">
                                                    <h3 className="font-bold text-lg mb-2">Physics Series Example</h3>
                                                    <p className="text-white/70 text-sm mb-4">
                                                        Imagine watching a video about black holes and wanting to dive deeper:
                                                    </p>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div className="bg-white/10 rounded-lg p-3 text-center flex flex-col items-center">
                                                            <FaArrowUp className="text-primary-light text-lg mb-2" />
                                                            <p className="text-sm">Next episode: &quot;Event Horizons&quot;</p>
                                                            <p className="text-xs text-white/60 mt-1">Builds on current knowledge</p>
                                                        </div>

                                                        <div className="bg-white/10 rounded-lg p-3 text-center flex flex-col items-center">
                                                            <FaArrowLeft className="text-primary-secondary text-lg mb-2" />
                                                            <p className="text-sm">Alternative: &quot;Quantum Black Holes&quot;</p>
                                                            <p className="text-xs text-white/60 mt-1">Different perspective</p>
                                                        </div>

                                                        <div className="bg-white/10 rounded-lg p-3 text-center flex flex-col items-center">
                                                            <FaArrowRight className="text-primary-secondary text-lg mb-2" />
                                                            <p className="text-sm">Related: &quot;Neutron Stars&quot;</p>
                                                            <p className="text-xs text-white/60 mt-1">Connected topic</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-black/20 px-5 py-3 border-t border-white/10">
                                                    <p className="text-xs text-white/60 italic">
                                                        This navigation structure helps you build a complete mental model of complex physics concepts.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Example 2 */}
                                            <div className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
                                                <div className="p-5">
                                                    <h3 className="font-bold text-lg mb-2">Learning Languages Example</h3>
                                                    <p className="text-white/70 text-sm mb-4">
                                                        When learning languages, multi-dimensional navigation could work like this:
                                                    </p>

                                                    <div className="space-y-3">
                                                        <div className="flex items-center bg-white/10 rounded-lg p-3">
                                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                                                                <FaArrowUp className="text-primary-light" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">Progress to more advanced lessons</p>
                                                                <p className="text-xs text-white/60">Beginner → Intermediate → Advanced</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center bg-white/10 rounded-lg p-3">
                                                            <div className="w-10 h-10 rounded-full bg-primary-secondary/20 flex items-center justify-center mr-3">
                                                                <FaArrowLeft className="text-primary-secondary" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">View different contexts for the same vocabulary</p>
                                                                <p className="text-xs text-white/60">Business setting → Casual conversation → Travel</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center bg-white/10 rounded-lg p-3">
                                                            <div className="w-10 h-10 rounded-full bg-primary-secondary/20 flex items-center justify-center mr-3">
                                                                <FaArrowRight className="text-primary-secondary" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">Access grammar explanations related to current phrases</p>
                                                                <p className="text-xs text-white/60">See examples of the grammar rule in practice</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'advanced' && (
                                    <motion.div
                                        key="advanced"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <p className="text-white/80 mb-6">
                                            Master KnowScroll with these advanced navigation techniques and features:
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10">
                                                <h3 className="font-bold mb-3">Keyboard Shortcuts</h3>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-white/70">Arrow keys</span>
                                                        <span className="text-xs bg-white/10 px-2 py-1 rounded">Navigation</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-white/70">Space</span>
                                                        <span className="text-xs bg-white/10 px-2 py-1 rounded">Play/Pause</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-white/70">M</span>
                                                        <span className="text-xs bg-white/10 px-2 py-1 rounded">Mute/Unmute</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-white/70">I</span>
                                                        <span className="text-xs bg-white/10 px-2 py-1 rounded">Info Panel</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-white/70">L</span>
                                                        <span className="text-xs bg-white/10 px-2 py-1 rounded">Like</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-white/70">B</span>
                                                        <span className="text-xs bg-white/10 px-2 py-1 rounded">Bookmark</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-white/70">W</span>
                                                        <span className="text-xs bg-white/10 px-2 py-1 rounded">What-If Scenarios</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-white/70">Esc</span>
                                                        <span className="text-xs bg-white/10 px-2 py-1 rounded">Close Panels</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10">
                                                <h3 className="font-bold mb-3">Special Features</h3>
                                                <ul className="space-y-3">
                                                    <li className="flex items-start">
                                                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                                                            <FaLightbulb className="text-primary-light text-xs" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">What-If Scenarios</p>
                                                            <p className="text-xs text-white/70">Explore alternative learning paths that challenge your thinking or present different perspectives.</p>
                                                        </div>
                                                    </li>

                                                    <li className="flex items-start">
                                                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                                                            <FaComment className="text-primary-light text-xs" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">Discussion Threads</p>
                                                            <p className="text-xs text-white/70">Join conversations about specific points in videos, linking directly to moments in content.</p>
                                                        </div>
                                                    </li>

                                                    <li className="flex items-start">
                                                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                                                            <FaStar className="text-primary-light text-xs" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">Smart Recommendations</p>
                                                            <p className="text-xs text-white/70">The system learns your preferences and suggests optimal navigation paths based on your learning style.</p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 mb-6">
                                            <h3 className="font-bold mb-3">Pro Tips</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-white/10 rounded-lg p-3">
                                                    <p className="text-sm font-medium mb-1">Create Custom Learning Paths</p>
                                                    <p className="text-xs text-white/70">Bookmark videos in a specific order to create your own curriculum.</p>
                                                </div>

                                                <div className="bg-white/10 rounded-lg p-3">
                                                    <p className="text-sm font-medium mb-1">Time-Synced Notes</p>
                                                    <p className="text-xs text-white/70">Take notes that are linked to specific timestamps in videos.</p>
                                                </div>

                                                <div className="bg-white/10 rounded-lg p-3">
                                                    <p className="text-sm font-medium mb-1">Multi-Speed Learning</p>
                                                    <p className="text-xs text-white/70">Adjust playback speed without affecting pitch for faster consumption.</p>
                                                </div>

                                                <div className="bg-white/10 rounded-lg p-3">
                                                    <p className="text-sm font-medium mb-1">Knowledge Gaps</p>
                                                    <p className="text-xs text-white/70">The system identifies and suggests content to fill gaps in your knowledge.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <motion.button
                                                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-full text-sm font-medium"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={onClose}
                                            >
                                                Got it, let me explore!
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            ) : !hasCompletedTutorial ? (
                <motion.div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Interactive Tutorial Mode */}
                    <motion.div
                        className="w-full max-w-md mx-auto bg-background/95 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                    >
                        {/* Progress indicator */}
                        <div className="relative h-1 bg-white/10">
                            <motion.div
                                className="absolute h-full bg-gradient-to-r from-primary to-primary-secondary"
                                initial={{ width: '0%' }}
                                animate={{ width: `${(activeTutorialStep / (tutorialSteps.length - 1)) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`tutorial-step-${activeTutorialStep}`}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="min-h-[280px] flex flex-col"
                                >
                                    {/* Icon */}
                                    <motion.div
                                        className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary-secondary/30 flex items-center justify-center mx-auto mb-4"
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            boxShadow: [
                                                "0 0 0px rgba(143, 70, 193, 0)",
                                                "0 0 20px rgba(143, 70, 193, 0.4)",
                                                "0 0 0px rgba(143, 70, 193, 0)"
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        {tutorialSteps[activeTutorialStep].icon}
                                    </motion.div>

                                    <h3 className="text-xl font-bold text-center mb-3">
                                        {tutorialSteps[activeTutorialStep].title}
                                    </h3>

                                    <p className="text-white/80 text-center mb-6 flex-grow">
                                        {tutorialSteps[activeTutorialStep].description}
                                    </p>

                                    {/* Tutorial visualization based on step */}
                                    <div className="w-full flex justify-center mb-8">
                                        {activeTutorialStep === 1 && (
                                            <div className="relative w-32 h-32">
                                                <motion.div
                                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30"
                                                    animate={{ y: [-10, 0, -10] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <FaArrowUp className="text-primary-light" />
                                                </motion.div>

                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                                    <FaVideo />
                                                </div>

                                                <motion.div
                                                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30"
                                                    animate={{ y: [10, 0, 10] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                                >
                                                    <FaArrowDown className="text-primary-light" />
                                                </motion.div>
                                            </div>
                                        )}

                                        {activeTutorialStep === 2 && (
                                            <div className="relative w-32 h-32">
                                                <motion.div
                                                    className="absolute top-1/2 left-0 transform -translate-y-1/2 w-10 h-10 rounded-full bg-primary-secondary/20 flex items-center justify-center border border-primary-secondary/30"
                                                    animate={{ x: [-10, 0, -10] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <FaArrowLeft className="text-primary-secondary" />
                                                </motion.div>

                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                                    <FaVideo />
                                                </div>

                                                <motion.div
                                                    className="absolute top-1/2 right-0 transform -translate-y-1/2 w-10 h-10 rounded-full bg-primary-secondary/20 flex items-center justify-center border border-primary-secondary/30"
                                                    animate={{ x: [10, 0, 10] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                                >
                                                    <FaArrowRight className="text-primary-secondary" />
                                                </motion.div>
                                            </div>
                                        )}

                                        {activeTutorialStep === 3 && (
                                            <div className="relative w-32 h-32">
                                                <div className="absolute inset-0 border-2 border-white/20 rounded-lg flex items-center justify-center">
                                                    <div className="grid grid-cols-3 gap-1">
                                                        <div className="w-8 h-6 bg-transparent" />
                                                        <div className="w-8 h-6 bg-white/10 rounded flex items-center justify-center">
                                                            <FaArrowUp className="text-xs" />
                                                        </div>
                                                        <div className="w-8 h-6 bg-transparent" />
                                                        <div className="w-8 h-6 bg-white/10 rounded flex items-center justify-center">
                                                            <FaArrowLeft className="text-xs" />
                                                        </div>
                                                        <div className="w-8 h-6 bg-white/10 rounded flex items-center justify-center">
                                                            <FaArrowDown className="text-xs" />
                                                        </div>
                                                        <div className="w-8 h-6 bg-white/10 rounded flex items-center justify-center">
                                                            <FaArrowRight className="text-xs" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <motion.div
                                                    className="absolute inset-0 border-2 border-primary/30 rounded-lg opacity-0"
                                                    animate={{ opacity: [0, 0.5, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between items-center">
                                        {activeTutorialStep > 0 ? (
                                            <motion.button
                                                className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-full text-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setActiveTutorialStep(prev => Math.max(0, prev - 1))}
                                            >
                                                Previous
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-full text-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setShowFullGuide(true);
                                                }}
                                            >
                                                Full Guide
                                            </motion.button>
                                        )}

                                        {activeTutorialStep < tutorialSteps.length - 1 ? (
                                            <motion.button
                                                className="px-4 py-2 bg-gradient-to-r from-primary to-primary-secondary rounded-full text-sm font-medium shadow-lg shadow-primary/20"
                                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)" }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setActiveTutorialStep(prev => Math.min(tutorialSteps.length - 1, prev + 1))}
                                            >
                                                Next
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                className="px-4 py-2 bg-gradient-to-r from-primary to-primary-secondary rounded-full text-sm font-medium shadow-lg shadow-primary/20"
                                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)" }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    completeTutorial();
                                                    onClose();
                                                }}
                                            >
                                                Start Exploring
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div
                    className="fixed bottom-24 right-4 z-40"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                >
                    <motion.button
                        className="w-12 h-12 bg-primary/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.9)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowFullGuide(true)}
                    >
                        <FaInfoCircle className="text-xl" />
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}