"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaInfo } from 'react-icons/fa';
import { Reel } from '@/types';
import { reels } from '@/data/reels';

interface SwipeIndicatorsProps {
    currentReelId: string;
    isDesktop: boolean;
    isVisible: boolean;
}

export default function SwipeIndicators({ currentReelId, isDesktop, isVisible }: SwipeIndicatorsProps) {
    const [currentReel, setCurrentReel] = useState<Reel | null>(null);
    const [indicators, setIndicators] = useState({
        up: false,
        down: false,
        left: false,
        right: false
    });

    // Detect available navigation directions
    useEffect(() => {
        const reel = reels.find(r => r.id === currentReelId);
        if (!reel) return;

        setCurrentReel(reel);

        // Get adjacent reels
        const adjacentReels: { up?: Reel; down?: Reel; left?: Reel; right?: Reel } = {};

        // VERTICAL NAVIGATION - SERIES
        if (reel.seriesId && reel.episodeNumber) {
            // Get all reels in this series, sorted by episode number
            const seriesReels = reels
                .filter(r => r.seriesId === reel.seriesId)
                .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));

            if (seriesReels.length > 1) {
                // Find current index in the series
                const currentIndex = seriesReels.findIndex(r => r.id === reel.id);

                // Next episode exists (up)
                if (currentIndex < seriesReels.length - 1) {
                    adjacentReels.up = seriesReels[currentIndex + 1];
                }

                // Previous episode exists (down)
                if (currentIndex > 0) {
                    adjacentReels.down = seriesReels[currentIndex - 1];
                }
            }
        }

        // HORIZONTAL NAVIGATION
        // For alternate versions
        if (reel.alternateVersions && reel.alternateVersions.length > 0) {
            // Find current index in alternates
            const currentIndex = reel.alternateVersions.findIndex(id => id === reel.id);

            if (currentIndex < reel.alternateVersions.length - 1) {
                const nextVersionId = reel.alternateVersions[currentIndex + 1];
                adjacentReels.left = reels.find(r => r.id === nextVersionId);
            }

            if (currentIndex > 0) {
                const prevVersionId = reel.alternateVersions[currentIndex - 1];
                adjacentReels.right = reels.find(r => r.id === prevVersionId);
            }
        }
        // For related content by tags
        else if (reel.tags && reel.tags.length > 0) {
            // Find related reels by tags
            const relatedReels = reels.filter(
                r => r.id !== reel.id && r.tags.some(tag => reel.tags.includes(tag))
            );

            if (relatedReels.length > 0) {
                // Use first two related reels
                if (relatedReels.length >= 1) {
                    adjacentReels.left = relatedReels[0];
                }
                if (relatedReels.length >= 2) {
                    adjacentReels.right = relatedReels[1];
                }
            }
        }

        // Set which indicators should be shown
        setIndicators({
            up: !!adjacentReels.up,
            down: !!adjacentReels.down,
            left: !!adjacentReels.left,
            right: !!adjacentReels.right
        });
    }, [currentReelId]);

    if (!currentReel) return null;

    // Get descriptive labels for each direction
    const getLabel = (direction: 'up' | 'down' | 'left' | 'right') => {
        const isSeriesNavigation = currentReel.seriesId && (direction === 'up' || direction === 'down');
        const isAlternateNavigation = currentReel.alternateVersions && (direction === 'left' || direction === 'right');

        switch (direction) {
            case 'up':
                return isSeriesNavigation ? "Next Episode" : "Related";
            case 'down':
                return isSeriesNavigation ? "Previous Episode" : "Related";
            case 'left':
                return isAlternateNavigation ? "Alternate View" : "Related";
            case 'right':
                return isAlternateNavigation ? "Alternate View" : "Related";
        }
    };

    // Mobile-optimized swipe indicators with better UI
    if (!isDesktop) {
        return (
            <AnimatePresence>
                {isVisible && (
                    <>
                        {/* Primary mobile swipe guide - centered card with arrows */}
                        <motion.div
                            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="bg-black/70 backdrop-blur-md rounded-2xl shadow-xl shadow-black/20 p-1 max-w-[280px]"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="text-center p-2 pb-0">
                                    <motion.div
                                        className="inline-flex items-center px-3 py-1 bg-primary/20 rounded-full mb-2"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <FaInfo className="mr-1 text-xs text-primary-light" />
                                        <span className="text-xs">Swipe to explore more content</span>
                                    </motion.div>
                                </div>
                                <div className="relative w-64 h-64">
                                    {/* Center reel indicator */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center"
                                            animate={{
                                                boxShadow: ["0 0 0px rgba(143, 70, 193, 0)", "0 0 20px rgba(143, 70, 193, 0.5)", "0 0 0px rgba(143, 70, 193, 0)"]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <div className="text-center">
                                                <div className="text-xs text-white/80">Current</div>
                                                <div className="text-sm font-medium">{currentReel.type === 'hyper' ? 'HyperReel' : 'Episode'}</div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Up Direction */}
                                    {indicators.up && (
                                        <motion.div
                                            className="absolute top-4 left-1/2 transform -translate-x-1/2"
                                            animate={{ y: [-5, 0, -5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <div className="flex flex-col items-center">
                                                <motion.div
                                                    className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mb-1 shadow-md shadow-black/20"
                                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.3)" }}
                                                >
                                                    <FaArrowUp className="text-lg" />
                                                </motion.div>
                                                <motion.div
                                                    className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    {getLabel('up')}
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Down Direction */}
                                    {indicators.down && (
                                        <motion.div
                                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                                            animate={{ y: [5, 0, 5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <div className="flex flex-col items-center">
                                                <motion.div
                                                    className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs mb-1"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    {getLabel('down')}
                                                </motion.div>
                                                <motion.div
                                                    className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shadow-md shadow-black/20"
                                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.3)" }}
                                                >
                                                    <FaArrowDown className="text-lg" />
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Left Direction */}
                                    {indicators.left && (
                                        <motion.div
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                            animate={{ x: [-5, 0, -5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <div className="flex items-center">
                                                <motion.div
                                                    className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mr-1 shadow-md shadow-black/20"
                                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.3)" }}
                                                >
                                                    <FaArrowLeft className="text-lg" />
                                                </motion.div>
                                                <motion.div
                                                    className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    {getLabel('left')}
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Right Direction */}
                                    {indicators.right && (
                                        <motion.div
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                            animate={{ x: [5, 0, 5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <div className="flex items-center">
                                                <motion.div
                                                    className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-xs mr-1"
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    {getLabel('right')}
                                                </motion.div>
                                                <motion.div
                                                    className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shadow-md shadow-black/20"
                                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.3)" }}
                                                >
                                                    <FaArrowRight className="text-lg" />
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Swipe gesture visualization */}
                                <div className="p-2 pt-0">
                                    <motion.div
                                        className="h-1 w-10 mx-auto bg-white/30 rounded-full overflow-hidden mt-1"
                                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <motion.div
                                            className="h-full bg-primary rounded-full"
                                            animate={{ x: [-30, 30, -30] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Hand swipe gesture animations - more intuitive than just arrows */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                        >
                            {indicators.up && (
                                <motion.div
                                    className="absolute w-12 h-24 top-16"
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 1.5, repeat: 2, repeatDelay: 1 }}
                                >
                                    <svg viewBox="0 0 24 48" width="100%" height="100%">
                                        <motion.path
                                            d="M12,48 C16,48 20,44 20,36 C20,28 16,24 12,24"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            fill="none"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 0.8 }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                        />
                                        <motion.circle
                                            cx="12"
                                            cy="24"
                                            r="3"
                                            fill="rgba(143, 70, 193, 0.7)"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3, delay: 0.8 }}
                                        />
                                    </svg>
                                </motion.div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    }

    // Desktop version with subtle indicators
    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Only show on hover or when explicitly visible */}
            <AnimatePresence>
                {isVisible && (
                    <>
                        {/* Up Direction */}
                        {indicators.up && (
                            <motion.div
                                className="absolute top-16 left-1/2 transform -translate-x-1/2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center mb-2 border border-primary/30 shadow-lg shadow-black/30"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
                                    >
                                        <FaArrowUp className="text-sm text-white" />
                                    </motion.div>
                                    <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs shadow-md shadow-black/30">
                                        {getLabel('up')}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Down Direction */}
                        {indicators.down && (
                            <motion.div
                                className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs mb-2 shadow-md shadow-black/30">
                                        {getLabel('down')}
                                    </div>
                                    <motion.div
                                        className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-primary/30 shadow-lg shadow-black/30"
                                        animate={{ y: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
                                    >
                                        <FaArrowDown className="text-sm text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Left Direction */}
                        {indicators.left && (
                            <motion.div
                                className="absolute left-8 top-1/2 transform -translate-y-1/2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center">
                                    <motion.div
                                        className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center mr-2 border border-primary/30 shadow-lg shadow-black/30"
                                        animate={{ x: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
                                    >
                                        <FaArrowLeft className="text-sm text-white" />
                                    </motion.div>
                                    <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs shadow-md shadow-black/30">
                                        {getLabel('left')}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Right Direction */}
                        {indicators.right && (
                            <motion.div
                                className="absolute right-8 top-1/2 transform -translate-y-1/2"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center">
                                    <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs mr-2 shadow-md shadow-black/30">
                                        {getLabel('right')}
                                    </div>
                                    <motion.div
                                        className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-primary/30 shadow-lg shadow-black/30"
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
                                    >
                                        <FaArrowRight className="text-sm text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}