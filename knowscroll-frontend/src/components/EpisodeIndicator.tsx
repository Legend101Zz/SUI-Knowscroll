"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCircle, FaRegCircle, FaGraduationCap, FaPlay } from 'react-icons/fa';
import { Reel } from '@/types';
import { reels } from '@/data/reels';

interface EpisodeIndicatorProps {
    currentReelId: string;
    visible: boolean;
}

export default function EpisodeIndicator({ currentReelId, visible }: EpisodeIndicatorProps) {
    const [seriesReels, setSeriesReels] = useState<Reel[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [showIndicator, setShowIndicator] = useState(false);
    const [seriesTitle, setSeriesTitle] = useState('');
    const [isTitleVisible, setIsTitleVisible] = useState(false);

    // Show title after a small delay
    useEffect(() => {
        let titleTimer: NodeJS.Timeout;
        if (visible && showIndicator) {
            titleTimer = setTimeout(() => setIsTitleVisible(true), 300);
        } else {
            setIsTitleVisible(false);
        }

        return () => {
            if (titleTimer) clearTimeout(titleTimer);
        };
    }, [visible, showIndicator]);

    useEffect(() => {
        const currentReel = reels.find(r => r.id === currentReelId);
        if (!currentReel || !currentReel.seriesId) {
            setShowIndicator(false);
            return;
        }

        // Get all reels in this series, sorted by episode number
        const seriesEpisodes = reels
            .filter(r => r.seriesId === currentReel.seriesId)
            .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));

        if (seriesEpisodes.length <= 1) {
            setShowIndicator(false);
            return;
        }

        // Find current index
        const index = seriesEpisodes.findIndex(r => r.id === currentReelId);

        // Find series title from first reel in series (assuming title format is consistent)
        const firstReel = seriesEpisodes[0];
        const titleParts = firstReel.title.split(':');
        const extractedTitle = titleParts.length > 1
            ? titleParts[0].trim() // If title has format "Series Name: Episode Name"
            : firstReel.title.split(' ').slice(0, 2).join(' '); // Otherwise take first two words

        setSeriesTitle(extractedTitle);
        setSeriesReels(seriesEpisodes);
        setCurrentIndex(index);
        setShowIndicator(true);
    }, [currentReelId]);

    if (!showIndicator) return null;

    // Only show dots for series with a reasonable number of episodes
    const maxDisplayDots = 7;

    // For series with many episodes, we'll use a condensed display
    const condensedView = seriesReels.length > maxDisplayDots;

    // Determine which episodes to show in the indicator
    // For large series, show a subset centered around current episode
    const getVisibleEpisodes = () => {
        if (!condensedView) return seriesReels;

        const halfVisible = Math.floor(maxDisplayDots / 2);
        let startIdx = Math.max(0, currentIndex - halfVisible);
        let endIdx = Math.min(seriesReels.length - 1, currentIndex + halfVisible);

        // Adjust if we're near the beginning or end
        if (startIdx === 0) {
            endIdx = Math.min(seriesReels.length - 1, maxDisplayDots - 1);
        } else if (endIdx === seriesReels.length - 1) {
            startIdx = Math.max(0, seriesReels.length - maxDisplayDots);
        }

        return seriesReels.slice(startIdx, endIdx + 1);
    };

    const visibleEpisodes = getVisibleEpisodes();

    return (
        <AnimatePresence>
            {visible && showIndicator && (
                <motion.div
                    className="absolute top-0 inset-x-0 z-30 pointer-events-none"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex flex-col items-center mt-4">
                        {/* Series Title */}
                        <AnimatePresence>
                            {isTitleVisible && (
                                <motion.div
                                    className="mb-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-center shadow-md shadow-black/20"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-center">
                                        <FaGraduationCap className="text-primary-light mr-1.5 text-sm" />
                                        <h3 className="text-sm font-medium">{seriesTitle}</h3>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Episode Indicator */}
                        <motion.div
                            className="bg-black/60 backdrop-blur-md rounded-full px-3 py-2 flex items-center space-x-1.5 shadow-lg shadow-black/20 border border-white/5"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.7)" }}
                        >
                            {!condensedView ? (
                                // Standard dot indicator for series with few episodes
                                seriesReels.map((_, idx) => (
                                    <motion.div
                                        key={idx}
                                        animate={{
                                            scale: idx === currentIndex ? [1, 1.2, 1] : 1,
                                            opacity: idx === currentIndex ? 1 : 0.5
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: idx === currentIndex ? Infinity : 0,
                                            repeatType: "reverse"
                                        }}
                                    >
                                        {idx === currentIndex ? (
                                            <FaCircle className="text-primary text-xs" />
                                        ) : (
                                            <FaRegCircle className="text-white/70 text-xs" />
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                // Enhanced condensed view
                                <div className="flex items-center">
                                    {/* Episode counter display */}
                                    <div className="flex items-center mr-2.5 pl-1 bg-primary/20 rounded-full">
                                        <FaPlay className="text-primary-light text-xs mr-1" />
                                        <motion.span
                                            className="font-medium mr-1"
                                            animate={{
                                                scale: [1, 1.1, 1],
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            {(seriesReels[currentIndex]?.episodeNumber || 0)}
                                        </motion.span>
                                        <span className="text-xs text-white/70 mr-1.5">
                                            of {seriesReels.length}
                                        </span>
                                    </div>

                                    {/* Dots for visible episodes */}
                                    <div className="flex items-center space-x-1">
                                        {/* Show dots at the beginning if we're not showing all */}
                                        {currentIndex > 2 && (
                                            <>
                                                {/* Episode 1 */}
                                                <motion.div
                                                    className="cursor-pointer"
                                                    whileHover={{ scale: 1.2 }}
                                                >
                                                    <FaRegCircle className="text-white/50 text-xs" />
                                                </motion.div>

                                                {/* Ellipsis */}
                                                <motion.div className="text-white/50 text-xs flex items-center mx-0.5">…</motion.div>
                                            </>
                                        )}

                                        {visibleEpisodes.map((_, idx) => {
                                            const episodeIdx = seriesReels.findIndex(r => r.id === visibleEpisodes[idx].id);
                                            return (
                                                <motion.div
                                                    key={`visible-${episodeIdx}`}
                                                    animate={{
                                                        scale: episodeIdx === currentIndex ? [1, 1.2, 1] : 1,
                                                        opacity: episodeIdx === currentIndex ? 1 : 0.5
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: episodeIdx === currentIndex ? Infinity : 0,
                                                        repeatType: "reverse"
                                                    }}
                                                >
                                                    {episodeIdx === currentIndex ? (
                                                        <FaCircle className="text-primary text-xs" />
                                                    ) : (
                                                        <FaRegCircle className="text-white/70 text-xs" />
                                                    )}
                                                </motion.div>
                                            );
                                        })}

                                        {/* Show dots at the end if we're not showing all */}
                                        {currentIndex < seriesReels.length - 3 && (
                                            <>
                                                {/* Ellipsis */}
                                                <motion.div className="text-white/50 text-xs flex items-center mx-0.5">…</motion.div>

                                                {/* Last episode */}
                                                <motion.div
                                                    className="cursor-pointer"
                                                    whileHover={{ scale: 1.2 }}
                                                >
                                                    <FaRegCircle className="text-white/50 text-xs" />
                                                </motion.div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* For condensed view, add a visual progress bar */}
                            {condensedView && (
                                <div className="ml-2 w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${((currentIndex + 1) / seriesReels.length) * 100}%`
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}