/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaPlay, FaPlus, FaUser, FaCompass, FaQuestion, FaSpinner, FaArrowLeft, FaArrowRight, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import Link from 'next/link';
import ReelPlayer from '@/components/ReelPlayer';
import ThreadView from '@/components/ThreadView';
import NavigationGuide from '@/components/NavigationGuide';
import SwipeIndicators from '@/components/ui/SwipeIndicators';
import EpisodeIndicator from '@/components/EpisodeIndicator';
import { reels } from '@/data/reels';
import { users } from '@/data/users';

export default function FeedPage() {
    // Core state
    const [currentReelId, setCurrentReelId] = useState<string>('');
    const [showThread, setShowThread] = useState(false);
    const [threadId, setThreadId] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [showNavigationGuide, setShowNavigationGuide] = useState(false);
    const [showDirectionHints, setShowDirectionHints] = useState(true);
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [appReady, setAppReady] = useState(false);

    // Refs for timeouts and video preloading
    const initialLoadTimer = useRef<NodeJS.Timeout | null>(null);
    const directionsTimeout = useRef<NodeJS.Timeout | null>(null);
    const videoPreloadMap = useRef<Map<string, boolean>>(new Map());

    // Check if we're on desktop
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Preload videos before showing the UI
    const preloadInitialVideos = async () => {
        // Function to preload a video and return a promise
        const preloadVideo = (videoUrl: string): Promise<boolean> => {
            return new Promise((resolve) => {
                // Skip if already preloaded
                if (videoPreloadMap.current.get(videoUrl)) {
                    resolve(true);
                    return;
                }

                // Create a temporary video element for preloading
                const videoEl = document.createElement('video');
                videoEl.src = videoUrl;
                videoEl.muted = true;
                videoEl.preload = 'auto';
                videoEl.playsInline = true;

                // Set up event listeners
                const handleLoaded = () => {
                    videoPreloadMap.current.set(videoUrl, true);
                    resolve(true);
                };

                const handleError = () => {
                    console.warn(`Failed to preload video: ${videoUrl}`);
                    resolve(false);
                };

                // Attach listeners
                videoEl.addEventListener('canplaythrough', handleLoaded, { once: true });
                videoEl.addEventListener('error', handleError, { once: true });

                // Force loading
                videoEl.load();

                // Set a timeout to resolve anyway after 3 seconds
                setTimeout(() => {
                    if (!videoPreloadMap.current.get(videoUrl)) {
                        videoPreloadMap.current.set(videoUrl, true);
                        resolve(true);
                    }
                }, 3000);
            });
        };

        // Start with a series first episode as default
        const seriesReels = reels.filter(reel => reel.seriesId && reel.episodeNumber === 1);

        // Try to use a quality reel with videos and thumbnails
        let selectedReel;
        if (seriesReels.length > 0) {
            // Choose a random quality reel from series
            selectedReel = seriesReels[Math.floor(Math.random() * seriesReels.length)];
        } else if (reels.length > 0) {
            // Fallback to any reel
            selectedReel = reels[0];
        }

        if (selectedReel) {
            setCurrentReelId(selectedReel.id);

            // Preload the selected reel and related reels
            try {
                // Start preloading the main reel
                await preloadVideo(selectedReel.videoUrl);

                // Find adjacent reels for preloading
                if (selectedReel.seriesId) {
                    // Get first 2 episodes in the series
                    const seriesReels = reels
                        .filter(r => r.seriesId === selectedReel.seriesId)
                        .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0))
                        .slice(0, 2);

                    // Preload these in parallel 
                    seriesReels.forEach(reel => {
                        if (reel.id !== selectedReel.id) {
                            preloadVideo(reel.videoUrl); // Don't await, let it happen in background
                        }
                    });
                }
            } catch (error) {
                console.error("Error preloading videos:", error);
            }
        }

        // Show the UI after a minimum loading time of 1.5 seconds
        setTimeout(() => {
            setIsLoading(false);

            // Delay showing UI elements slightly to ensure smooth animation
            setTimeout(() => {
                setAppReady(true);

                // Show direction hints briefly at startup
                setShowDirectionHints(true);
                directionsTimeout.current = setTimeout(() => {
                    setShowDirectionHints(false);
                }, 4000);
            }, 300);
        }, 1500);
    };

    // Initial load effect
    useEffect(() => {
        // Start preloading videos
        preloadInitialVideos();

        return () => {
            if (initialLoadTimer.current) clearTimeout(initialLoadTimer.current);
            if (directionsTimeout.current) clearTimeout(directionsTimeout.current);
        };
    }, []);

    // Check for first visit using localStorage (if available)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const visited = localStorage.getItem('knowscroll_visited');
            if (visited) {
                setIsFirstVisit(false);
            } else {
                // Mark as visited
                localStorage.setItem('knowscroll_visited', 'true');
            }
        }
    }, []);

    const handleThreadOpen = (reelId: string) => {
        setThreadId(undefined);
        setShowThread(true);
        setShowDirectionHints(false);
    };

    const handleThreadClose = () => {
        setShowThread(false);
        setThreadId(undefined);
    };

    const handleCreateThread = (participants: typeof users) => {
        // In a real app, we'd create a thread in the backend
        setShowThread(false);
    };

    const handleReelChange = (reelId: string) => {
        setCurrentReelId(reelId);

        // Reset video completion state
        setVideoCompleted(false);
    };

    const handleNavigationGuideOpen = () => {
        setShowNavigationGuide(true);
        setShowDirectionHints(false);
    };

    const handleNavigationGuideClose = () => {
        setShowNavigationGuide(false);
    };

    const handleVideoComplete = () => {
        setVideoCompleted(true);

        // Show direction hints when video completes
        setShowDirectionHints(true);

        // On mobile, keep the hints visible longer
        if (!isDesktop) {
            if (directionsTimeout.current) {
                clearTimeout(directionsTimeout.current);
            }
            directionsTimeout.current = setTimeout(() => {
                setShowDirectionHints(false);
            }, 5000);
        }
    };

    // Navigation button styling classes
    const navButtonClasses = "flex flex-col items-center justify-center w-16";
    const navButtonActiveClasses = "text-primary-light";
    const navButtonInactiveClasses = "text-white/80";
    const navTextClasses = "text-xs mt-1";

    return (
        <div className="h-screen w-full bg-background relative overflow-hidden">
            {/* Enhanced Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="absolute inset-0 z-50 bg-gradient-to-br from-background to-background-lighter flex flex-col items-center justify-center"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="relative w-24 h-24"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Animated rings around the logo */}
                            <motion.div
                                className="absolute inset-0 border-4 border-primary/30 rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="absolute inset-0 border-4 border-primary-secondary/30 rounded-full"
                                animate={{
                                    scale: [1, 1.8, 1],
                                    opacity: [0.3, 0, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.5,
                                    ease: "easeInOut"
                                }}
                            />

                            {/* Logo */}
                            <div className="w-24 h-24 bg-gradient-to-r from-primary to-primary-secondary rounded-full flex items-center justify-center text-white z-10 relative">
                                <motion.span
                                    className="text-3xl font-bold"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    K
                                </motion.span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="mt-8 relative h-1.5 w-48 bg-white/10 rounded-full overflow-hidden"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.div
                                className="absolute h-full bg-gradient-to-r from-primary to-primary-secondary rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </motion.div>

                        <motion.p
                            className="text-white/70 mt-6 text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Loading educational content...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Reel Player with Fade-in Animation */}
            <AnimatePresence>
                {!isLoading && currentReelId && (
                    <motion.div
                        className="w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: appReady ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ReelPlayer
                            initialReelId={currentReelId}
                            onThreadOpen={handleThreadOpen}
                            onReelChange={handleReelChange}
                            onVideoComplete={handleVideoComplete}
                            showArrows={isDesktop}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced Navigation Direction Indicators */}
            {appReady && currentReelId && (
                <SwipeIndicators
                    currentReelId={currentReelId}
                    isDesktop={isDesktop}
                    isVisible={showDirectionHints || videoCompleted}
                />
            )}

            {/* Navigation Help Button - Only on desktop */}
            {appReady && !showThread && isDesktop && (
                <motion.button
                    className="absolute top-4 right-4 z-30 w-10 h-10 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-lg shadow-black/30"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.3)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNavigationGuideOpen}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    <FaQuestion className="text-lg" />
                </motion.button>
            )}

            {/* Enhanced Bottom Navigation */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/95 to-background/50 backdrop-blur-md border-t border-white/5 flex items-center justify-around z-30 px-2"
                initial={{ y: 100 }}
                animate={{ y: appReady ? 0 : 100 }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 100,
                    delay: 0.5
                }}
            >
                <Link href="/" className="block">
                    <motion.div
                        className={navButtonClasses}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaHome className={`text-xl mb-1 ${navButtonInactiveClasses}`} />
                        <span className={`${navTextClasses} text-white/60`}>Home</span>
                    </motion.div>
                </Link>

                <Link href="/explore" className="block">
                    <motion.div
                        className={navButtonClasses}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaCompass className={`text-xl mb-1 ${navButtonInactiveClasses}`} />
                        <span className={`${navTextClasses} text-white/60`}>Explore</span>
                    </motion.div>
                </Link>

                <Link href="/create" className="block">
                    <motion.div
                        className="flex flex-col items-center justify-center -mt-8 relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary-secondary flex items-center justify-center shadow-lg shadow-black/30"
                            whileHover={{
                                boxShadow: "0 0 20px rgba(143, 70, 193, 0.4)",
                                scale: 1.05
                            }}
                        >
                            <FaPlus className="text-xl" />
                        </motion.div>

                        {/* Pulsing effect around the button */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary/50"
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop",
                            }}
                        />
                    </motion.div>
                </Link>

                <Link href="/feed" className="block">
                    <motion.div
                        className={navButtonClasses}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="relative">
                            <FaPlay className={`text-xl mb-1 ${navButtonActiveClasses}`} />
                            <motion.div
                                className="absolute -top-1 -right-1 w-2 h-2 bg-primary-secondary rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <span className={`${navTextClasses} ${navButtonActiveClasses}`}>Feed</span>
                    </motion.div>
                </Link>

                <Link href="/profile" className="block">
                    <motion.div
                        className={navButtonClasses}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="relative">
                            <FaUser className={`text-xl mb-1 ${navButtonInactiveClasses}`} />
                            <motion.div
                                className="absolute -top-1 -right-1 w-2 h-2 bg-primary-secondary rounded-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2 }}
                            />
                        </div>
                        <span className={`${navTextClasses} text-white/60`}>Profile</span>
                    </motion.div>
                </Link>
            </motion.div>

            {/* Thread Modal */}
            <AnimatePresence>
                {showThread && (
                    <ThreadView
                        threadId={threadId}
                        initialParticipants={[users[0]]} // Add the first user from our mock data
                        onClose={handleThreadClose}
                        onCreateThread={handleCreateThread}
                    />
                )}
            </AnimatePresence>

            {/* Enhanced First-time User Guide */}
            <AnimatePresence>
                {appReady && isFirstVisit && !showNavigationGuide && (
                    <motion.div
                        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-40"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ delay: 1 }}
                    >
                        <motion.div
                            className="bg-black/70 backdrop-blur-lg rounded-xl px-5 py-4 text-center max-w-xs shadow-xl shadow-black/30 border border-white/10"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-base font-semibold mb-2 text-primary-light">Welcome to KnowScroll!</h3>
                            <p className="text-sm mb-3">Discover multi-dimensional content navigation. Swipe in different directions to explore:</p>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center bg-white/5 rounded-lg p-2 border border-white/10">
                                    <motion.div
                                        animate={{ y: [-3, 0, -3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2"
                                    >
                                        <FaArrowUp className="text-sm" />
                                    </motion.div>
                                    <span className="text-xs text-left">Next episode in series</span>
                                </div>
                                <div className="flex items-center bg-white/5 rounded-lg p-2 border border-white/10">
                                    <motion.div
                                        animate={{ y: [3, 0, 3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2"
                                    >
                                        <FaArrowDown className="text-sm" />
                                    </motion.div>
                                    <span className="text-xs text-left">Previous episode</span>
                                </div>
                                <div className="flex items-center bg-white/5 rounded-lg p-2 border border-white/10">
                                    <motion.div
                                        animate={{ x: [-3, 0, -3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2"
                                    >
                                        <FaArrowLeft className="text-sm" />
                                    </motion.div>
                                    <span className="text-xs text-left">Alternative views</span>
                                </div>
                                <div className="flex items-center bg-white/5 rounded-lg p-2 border border-white/10">
                                    <motion.div
                                        animate={{ x: [3, 0, 3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2"
                                    >
                                        <FaArrowRight className="text-sm" />
                                    </motion.div>
                                    <span className="text-xs text-left">Related content</span>
                                </div>
                            </div>

                            <motion.button
                                className="px-4 py-2 bg-gradient-to-r from-primary to-primary-secondary rounded-full text-sm font-medium shadow-lg shadow-primary/20"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(143, 70, 193, 0.6)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsFirstVisit(false)}
                            >
                                Got it
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Guide Modal */}
            {showNavigationGuide && (
                <NavigationGuide
                    currentReelId={currentReelId}
                    onClose={handleNavigationGuideClose}
                />
            )}
        </div>
    );
}