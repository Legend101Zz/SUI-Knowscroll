"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb, FaArrowRight, FaTimes, FaMagic, FaExternalLinkAlt, FaRandom } from 'react-icons/fa';
import { WhatIfScenario } from '@/types';

interface WhatIfOverlayProps {
    scenarios: WhatIfScenario[];
    isVisible: boolean;
    onClose: () => void;
    onSelectScenario: (scenarioId: string) => void;
}

export default function WhatIfOverlay({
    scenarios,
    isVisible,
    onClose,
    onSelectScenario
}: WhatIfOverlayProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [, setHasInteracted] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Reset to first scenario when opening
    useEffect(() => {
        if (isVisible) {
            setActiveIndex(0);
            setDirection(0);
            setHasInteracted(false);
            setAutoRotate(true);
        } else {
            // Clear any timers when closing
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }
    }, [isVisible]);

    // Auto-rotate scenarios every 8 seconds if user hasn't interacted
    useEffect(() => {
        if (!isVisible || scenarios.length <= 1 || !autoRotate) return;

        // Clear any existing timers
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            setDirection(1);
            setActiveIndex((prev) => (prev + 1) % scenarios.length);
        }, 8000);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isVisible, scenarios.length, activeIndex, autoRotate]);

    // Handle manual navigation
    const handleNext = () => {
        // Stop auto-rotation when user interacts
        setHasInteracted(true);
        setAutoRotate(false);

        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % scenarios.length);
    };

    const handlePrev = () => {
        // Stop auto-rotation when user interacts
        setHasInteracted(true);
        setAutoRotate(false);

        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + scenarios.length) % scenarios.length);
    };

    const handleSelectScenario = (scenarioId: string) => {
        // Add haptic feedback effect if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        onSelectScenario(scenarioId);
    };

    // Exit if no scenarios
    if (!scenarios || scenarios.length === 0) return null;

    // Use different layout for single scenario vs multiple
    const isSingleScenario = scenarios.length === 1;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="absolute inset-0 z-40 backdrop-blur-lg bg-black/80 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full max-w-lg p-5 mx-4 relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <motion.div
                            className="flex items-center justify-between mb-5"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex items-center">
                                <motion.div
                                    className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary-secondary/30 rounded-full flex items-center justify-center mr-3 relative"
                                    animate={{
                                        boxShadow: ["0 0 0px rgba(143, 70, 193, 0.2)", "0 0 20px rgba(143, 70, 193, 0.5)", "0 0 0px rgba(143, 70, 193, 0.2)"]
                                    }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                >
                                    <FaLightbulb className="text-xl text-primary-light" />

                                    {/* Orbiting particle effect */}
                                    <motion.div
                                        className="absolute w-2.5 h-2.5 rounded-full bg-primary"
                                        animate={{
                                            rotate: 360
                                        }}
                                        style={{
                                            transformOrigin: "center",
                                            offsetPath: "path('M 0 -18 A 18 18 0 1 1 0 18 A 18 18 0 1 1 0 -18')"
                                        }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                </motion.div>
                                <div>
                                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary">What If...</h2>
                                    <p className="text-sm text-white/70">Explore alternative learning paths</p>
                                </div>
                            </div>

                            <motion.button
                                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20"
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                            >
                                <FaTimes className="text-sm" />
                            </motion.button>
                        </motion.div>

                        {/* Scenarios Carousel */}
                        <div
                            ref={containerRef}
                            className="relative overflow-hidden rounded-2xl mb-4"
                            style={{ minHeight: "320px" }}
                        >
                            <AnimatePresence custom={direction} mode="popLayout">
                                <motion.div
                                    key={activeIndex}
                                    custom={direction}
                                    initial={{
                                        opacity: 0,
                                        x: direction * 200,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        transition: { type: "spring", damping: 25 }
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: direction * -200,
                                        transition: { duration: 0.2 }
                                    }}
                                    className="absolute inset-0"
                                >
                                    <div className={`h-full rounded-2xl overflow-hidden ${!isSingleScenario ? 'border-2 border-primary/30' : 'border border-white/10'} shadow-lg shadow-black/20`}>
                                        {/* Scenario visualization */}
                                        <div className="h-40 relative flex items-center justify-center overflow-hidden">
                                            <div className="absolute inset-0">
                                                {scenarios[activeIndex].thumbnailUrl ? (
                                                    <img
                                                        src={scenarios[activeIndex].thumbnailUrl}
                                                        alt={scenarios[activeIndex].title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary-secondary/30" />
                                                )}
                                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                                                {/* Animated concept visualization */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <motion.div
                                                        className="relative"
                                                        animate={{
                                                            rotate: [0, 5, -5, 0],
                                                        }}
                                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                                    >
                                                        {/* Visualization based on title */}
                                                        {scenarios[activeIndex].title.toLowerCase().includes("black hole") && (
                                                            <div className="relative">
                                                                <motion.div
                                                                    className="w-32 h-32 rounded-full bg-black border-4 border-primary/50 relative"
                                                                    animate={{
                                                                        boxShadow: ["0 0 20px rgba(143, 70, 193, 0.4)", "0 0 40px rgba(143, 70, 193, 0.7)", "0 0 20px rgba(143, 70, 193, 0.4)"]
                                                                    }}
                                                                    transition={{ duration: 3, repeat: Infinity }}
                                                                >
                                                                    <motion.div
                                                                        className="w-full h-full rounded-full bg-gradient-to-br from-primary/50 to-primary-secondary/50 absolute"
                                                                        style={{ filter: "blur(15px)" }}
                                                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                                        transition={{ duration: 3, repeat: Infinity }}
                                                                    />
                                                                </motion.div>
                                                                <motion.div
                                                                    className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full"
                                                                    style={{ x: 70, y: -30 }}
                                                                    animate={{
                                                                        scale: [1, 0.8, 0.6, 0.3, 0],
                                                                        x: [70, 50, 30, 10, 0],
                                                                        y: [-30, -20, -10, -5, 0],
                                                                    }}
                                                                    transition={{ duration: 2, repeat: Infinity }}
                                                                />
                                                            </div>
                                                        )}

                                                        {scenarios[activeIndex].title.toLowerCase().includes("meditation") && (
                                                            <div className="relative">
                                                                <motion.div
                                                                    className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center"
                                                                    animate={{
                                                                        scale: [1, 1.1, 1.2, 1.1, 1],
                                                                    }}
                                                                    transition={{ duration: 4, repeat: Infinity }}
                                                                >
                                                                    <motion.div
                                                                        className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center"
                                                                        animate={{
                                                                            scale: [1, 0.9, 1.1, 0.9, 1],
                                                                        }}
                                                                        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                                                                    >
                                                                        <motion.div
                                                                            className="w-8 h-8 rounded-full bg-primary/50"
                                                                            animate={{
                                                                                scale: [1, 1.2, 0.9, 1.2, 1],
                                                                            }}
                                                                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                                                        />
                                                                    </motion.div>
                                                                </motion.div>

                                                                {/* Emanating waves */}
                                                                {[...Array(3)].map((_, i) => (
                                                                    <motion.div
                                                                        key={i}
                                                                        className="absolute inset-0 border-2 border-primary/20 rounded-full"
                                                                        animate={{
                                                                            scale: [1, 1.5, 2],
                                                                            opacity: [0.6, 0.3, 0]
                                                                        }}
                                                                        transition={{
                                                                            duration: 3,
                                                                            repeat: Infinity,
                                                                            delay: i * 0.6,
                                                                            ease: "easeOut"
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}

                                                        {scenarios[activeIndex].title.toLowerCase().includes("quantum") && (
                                                            <div className="relative">
                                                                <motion.div
                                                                    className="w-16 h-16 rounded-full bg-primary-light/80"
                                                                    animate={{
                                                                        opacity: [1, 0.5, 1],
                                                                    }}
                                                                    transition={{ duration: 2, repeat: Infinity }}
                                                                />

                                                                {/* Electron orbits */}
                                                                {[...Array(3)].map((_, i) => (
                                                                    <motion.div
                                                                        key={i}
                                                                        className="absolute inset-0 border border-white/60 rounded-full"
                                                                        style={{
                                                                            transformOrigin: "center",
                                                                            rotate: i * 60,
                                                                        }}
                                                                    >
                                                                        <motion.div
                                                                            className="absolute w-3 h-3 bg-white rounded-full"
                                                                            style={{
                                                                                left: "50%",
                                                                                top: -8,
                                                                                marginLeft: -6,
                                                                            }}
                                                                            animate={{
                                                                                rotate: 360
                                                                            }}
                                                                            transition={{
                                                                                duration: 2 + i * 0.5,
                                                                                repeat: Infinity,
                                                                                ease: "linear"
                                                                            }}
                                                                        />
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Default visualization if no specific match */}
                                                        {!scenarios[activeIndex].title.toLowerCase().includes("black hole") &&
                                                            !scenarios[activeIndex].title.toLowerCase().includes("meditation") &&
                                                            !scenarios[activeIndex].title.toLowerCase().includes("quantum") && (
                                                                <div className="relative">
                                                                    <motion.div
                                                                        className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/50 to-primary-secondary/50 flex items-center justify-center"
                                                                        animate={{
                                                                            boxShadow: ["0 0 20px rgba(143, 70, 193, 0.4)", "0 0 40px rgba(143, 70, 193, 0.6)", "0 0 20px rgba(143, 70, 193, 0.4)"]
                                                                        }}
                                                                        transition={{ duration: 3, repeat: Infinity }}
                                                                    >
                                                                        <FaMagic className="text-4xl text-white" />
                                                                    </motion.div>

                                                                    {/* Particles */}
                                                                    {[...Array(8)].map((_, i) => (
                                                                        <motion.div
                                                                            key={i}
                                                                            className="absolute w-2 h-2 bg-primary-light rounded-full"
                                                                            initial={{
                                                                                x: 0,
                                                                                y: 0,
                                                                            }}
                                                                            animate={{
                                                                                x: Math.sin(i * 45 * Math.PI / 180) * 50,
                                                                                y: Math.cos(i * 45 * Math.PI / 180) * 50,
                                                                                opacity: [0, 1, 0],
                                                                            }}
                                                                            transition={{
                                                                                duration: 2 + Math.random(),
                                                                                repeat: Infinity,
                                                                                delay: i * 0.2,
                                                                                ease: "easeInOut"
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                    </motion.div>
                                                </div>
                                            </div>

                                            {/* Title overlay with animated gradient */}
                                            <div className="absolute inset-x-0 bottom-0 py-3 px-4 bg-gradient-to-t from-black to-transparent">
                                                <div className="relative overflow-hidden">
                                                    {/* Shimmer effect */}
                                                    <motion.div
                                                        className="absolute inset-0 w-full h-full"
                                                        style={{
                                                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                                                            backgroundSize: "200% 100%"
                                                        }}
                                                        animate={{ x: ["-100%", "100%"] }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 1.5,
                                                            ease: "linear",
                                                            repeatDelay: 1
                                                        }}
                                                    />
                                                    <motion.h3
                                                        className="text-2xl font-bold text-white drop-shadow-md"
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -20, opacity: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        {scenarios[activeIndex].title}
                                                    </motion.h3>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Scenario content */}
                                        <div className="p-5 bg-black/60 border-t border-white/10">
                                            <motion.p
                                                className="text-white/90 mb-4 text-base leading-relaxed"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                {scenarios[activeIndex].description}
                                            </motion.p>

                                            <motion.button
                                                className="w-full py-3 bg-gradient-to-r from-primary to-primary-secondary rounded-xl text-sm font-medium flex items-center justify-center shadow-lg shadow-primary/20"
                                                whileHover={{
                                                    scale: 1.03,
                                                    boxShadow: "0 10px 15px -3px rgba(143, 70, 193, 0.4)"
                                                }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => handleSelectScenario(scenarios[activeIndex].id)}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                Explore This Path <FaExternalLinkAlt className="ml-2 text-sm" />
                                            </motion.button>

                                            {/* Random idea button - for multiple scenarios */}
                                            {!isSingleScenario && (
                                                <motion.button
                                                    className="mt-3 w-full py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-medium flex items-center justify-center transition-colors"
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => {
                                                        // Select random scenario different from current
                                                        let newIndex;
                                                        do {
                                                            newIndex = Math.floor(Math.random() * scenarios.length);
                                                        } while (newIndex === activeIndex && scenarios.length > 1);

                                                        setDirection(newIndex > activeIndex ? 1 : -1);
                                                        setActiveIndex(newIndex);
                                                    }}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    <FaRandom className="mr-2 text-xs" /> Try Another Idea
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation dots - Only show for multiple scenarios */}
                            {!isSingleScenario && (
                                <div className="absolute bottom-[85px] left-0 right-0 flex justify-center space-x-1.5">
                                    {scenarios.map((_, idx) => (
                                        <motion.button
                                            key={idx}
                                            className={`w-2 h-2 rounded-full ${idx === activeIndex ? 'bg-primary' : 'bg-white/30'}`}
                                            animate={{
                                                scale: idx === activeIndex ? 1.5 : 1,
                                                backgroundColor: idx === activeIndex ? "rgba(143, 70, 193, 1)" : "rgba(255, 255, 255, 0.3)"
                                            }}
                                            whileHover={{ scale: 1.5 }}
                                            whileTap={{ scale: 1 }}
                                            onClick={() => {
                                                setDirection(idx > activeIndex ? 1 : -1);
                                                setActiveIndex(idx);
                                                setHasInteracted(true);
                                                setAutoRotate(false);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Navigation arrows - Only show for multiple scenarios */}
                            {!isSingleScenario && scenarios.length > 1 && (
                                <>
                                    <motion.button
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg shadow-black/20 z-10"
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
                                        whileTap={{ scale: 0.9 }}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        onClick={handlePrev}
                                    >
                                        <FaArrowRight className="rotate-180 text-sm" />
                                    </motion.button>

                                    <motion.button
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg shadow-black/20 z-10"
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
                                        whileTap={{ scale: 0.9 }}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        onClick={handleNext}
                                    >
                                        <FaArrowRight className="text-sm" />
                                    </motion.button>
                                </>
                            )}
                        </div>

                        {/* Footer text */}
                        <motion.div
                            className="text-center text-white/60 text-xs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <p>Explore alternative perspectives and deepen your understanding</p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}