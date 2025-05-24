"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NavigationSVGProps {
    mode?: 'standard' | 'hyper' | 'squad';
    size?: number;
    animate?: boolean;
}

export default function NavigationSVG({
    mode = 'standard',
    size = 300,
    animate = true
}: NavigationSVGProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(animate);

    // Toggle animation when hover state changes
    useEffect(() => {
        if (isHovered) {
            setIsAnimating(true);
        } else if (!animate) {
            setIsAnimating(false);
        }
    }, [isHovered, animate]);

    // Gradient definitions based on mode
    const getGradients = () => {
        if (mode === 'hyper') {
            return (
                <>
                    <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a0459b" />
                        <stop offset="100%" stopColor="#bd4580" />
                    </linearGradient>
                    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a0459b" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#bd4580" stopOpacity="0.3" />
                    </linearGradient>
                </>
            );
        } else if (mode === 'squad') {
            return (
                <>
                    <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#bd4580" />
                        <stop offset="100%" stopColor="#d56f66" />
                    </linearGradient>
                    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#bd4580" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#d56f66" stopOpacity="0.3" />
                    </linearGradient>
                </>
            );
        } else {
            return (
                <>
                    <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8f46c1" />
                        <stop offset="100%" stopColor="#a0459b" />
                    </linearGradient>
                    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8f46c1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a0459b" stopOpacity="0.3" />
                    </linearGradient>
                </>
            );
        }
    };

    // Render the navigation SVG based on mode
    const renderNavigationSVG = () => {
        if (mode === 'hyper') {
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 300 300"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <defs>
                        {getGradients()}
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="4" stdDeviation="10" floodOpacity="0.2" />
                        </filter>
                    </defs>

                    {/* Main Phone */}
                    <rect x="75" y="45" width="150" height="210" rx="15" fill="#121212" stroke="url(#phoneGrad)" strokeWidth="2" filter="url(#shadow)" />
                    <rect x="80" y="50" width="140" height="200" rx="10" fill="#0c0612" />
                    <rect x="80" y="50" width="140" height="200" rx="10" fill="url(#screenGrad)" />

                    {/* Screen Content - Center Block */}
                    <rect x="115" y="120" width="70" height="70" rx="5" fill="#241b2e" />
                    <rect x="115" y="120" width="70" height="70" rx="5" fill="#a0459b" fillOpacity="0.3" />

                    {/* Left & Right blocks (swipe targets) */}
                    <motion.g
                        animate={isAnimating ? {
                            x: [0, -40, 0],
                            opacity: [0.8, 1, 0.8]
                        } : {}}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <rect x="40" y="120" width="70" height="70" rx="5" fill="#241b2e" fillOpacity="0.8" />
                        <rect x="40" y="120" width="70" height="70" rx="5" fill="#bd4580" fillOpacity="0.2" />
                    </motion.g>

                    <motion.g
                        animate={isAnimating ? {
                            x: [0, 40, 0],
                            opacity: [0.8, 1, 0.8]
                        } : {}}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1.5
                        }}
                    >
                        <rect x="190" y="120" width="70" height="70" rx="5" fill="#241b2e" fillOpacity="0.8" />
                        <rect x="190" y="120" width="70" height="70" rx="5" fill="#d56f66" fillOpacity="0.2" />
                    </motion.g>

                    {/* Horizontal Arrows */}
                    <motion.g
                        animate={isAnimating ? {
                            x: [0, -25, 0],
                            opacity: [0.3, 1, 0.3]
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <path d="M105 155 L85 155 L95 145 M85 155 L95 165" stroke="#fff" strokeWidth="2" fill="none" />
                        <text x="95" y="180" fill="#fff" fontSize="10" textAnchor="middle">Left view</text>
                    </motion.g>

                    <motion.g
                        animate={isAnimating ? {
                            x: [0, 25, 0],
                            opacity: [0.3, 1, 0.3]
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1
                        }}
                    >
                        <path d="M195 155 L215 155 L205 145 M215 155 L205 165" stroke="#fff" strokeWidth="2" fill="none" />
                        <text x="205" y="180" fill="#fff" fontSize="10" textAnchor="middle">Right view</text>
                    </motion.g>

                    {/* Label */}
                    <rect x="85" y="220" width="130" height="25" rx="5" fill="#241b2e" fillOpacity="0.8" />
                    <text x="150" y="235" fill="#fff" fontSize="12" textAnchor="middle">HyperReels Navigation</text>
                    <text x="150" y="250" fill="#fff" fontSize="8" textAnchor="middle" fillOpacity="0.7">Swipe left/right for alternate perspectives</text>
                </svg>
            );
        } else if (mode === 'squad') {
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 300 300"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <defs>
                        {getGradients()}
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="4" stdDeviation="10" floodOpacity="0.2" />
                        </filter>
                    </defs>

                    {/* Main Phone */}
                    <rect x="120" y="60" width="60" height="100" rx="10" fill="#121212" stroke="url(#phoneGrad)" strokeWidth="2" filter="url(#shadow)" />
                    <rect x="122" y="62" width="56" height="96" rx="8" fill="#0c0612" />
                    <rect x="122" y="62" width="56" height="96" rx="8" fill="url(#screenGrad)" />

                    {/* Friend Phones */}
                    <motion.g
                        animate={isAnimating ? {
                            y: [0, -10, 0],
                            x: [0, -5, 0],
                            rotate: [0, -5, 0],
                            opacity: [0.6, 0.9, 0.6]
                        } : {}}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <rect x="75" y="120" width="50" height="90" rx="8" fill="#121212" stroke="#bd4580" strokeWidth="1.5" />
                        <rect x="77" y="122" width="46" height="86" rx="6" fill="#0c0612" />
                        <rect x="77" y="122" width="46" height="86" rx="6" fill="#bd4580" fillOpacity="0.2" />
                    </motion.g>

                    <motion.g
                        animate={isAnimating ? {
                            y: [0, -5, 0],
                            x: [0, 5, 0],
                            rotate: [0, 5, 0],
                            opacity: [0.6, 0.9, 0.6]
                        } : {}}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 0.5
                        }}
                    >
                        <rect x="175" y="120" width="50" height="90" rx="8" fill="#121212" stroke="#d56f66" strokeWidth="1.5" />
                        <rect x="177" y="122" width="46" height="86" rx="6" fill="#0c0612" />
                        <rect x="177" y="122" width="46" height="86" rx="6" fill="#d56f66" fillOpacity="0.2" />
                    </motion.g>

                    {/* Connection Lines */}
                    <motion.path
                        d="M120 110 L95 120"
                        stroke="#bd4580"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                        animate={isAnimating ? {
                            opacity: [0.3, 0.8, 0.3]
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    />

                    <motion.path
                        d="M180 110 L205 120"
                        stroke="#d56f66"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                        animate={isAnimating ? {
                            opacity: [0.3, 0.8, 0.3]
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 0.5
                        }}
                    />

                    <motion.path
                        d="M100 170 L175 170"
                        stroke="white"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        animate={isAnimating ? {
                            opacity: [0.2, 0.6, 0.2]
                        } : {}}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1
                        }}
                    />

                    {/* Chat Bubbles */}
                    <motion.g
                        animate={isAnimating ? {
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7]
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1.5
                        }}
                    >
                        <rect x="85" y="140" width="30" height="15" rx="5" fill="#bd4580" fillOpacity="0.6" />
                        <rect x="85" y="160" width="25" height="15" rx="5" fill="#bd4580" fillOpacity="0.4" />
                    </motion.g>

                    <motion.g
                        animate={isAnimating ? {
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7]
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <rect x="135" y="90" width="30" height="15" rx="5" fill="white" fillOpacity="0.6" />
                        <rect x="130" y="110" width="40" height="15" rx="5" fill="white" fillOpacity="0.4" />
                    </motion.g>

                    <motion.g
                        animate={isAnimating ? {
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7]
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 2
                        }}
                    >
                        <rect x="185" y="140" width="30" height="15" rx="5" fill="#d56f66" fillOpacity="0.6" />
                        <rect x="190" y="160" width="25" height="15" rx="5" fill="#d56f66" fillOpacity="0.4" />
                    </motion.g>

                    {/* Label */}
                    <rect x="85" y="220" width="130" height="25" rx="5" fill="#241b2e" fillOpacity="0.8" />
                    <text x="150" y="235" fill="#fff" fontSize="12" textAnchor="middle">Squad Huddles</text>
                    <text x="150" y="250" fill="#fff" fontSize="8" textAnchor="middle" fillOpacity="0.7">Collaborative learning discussions</text>
                </svg>
            );
        } else {
            // Standard Series Navigation
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 300 300"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <defs>
                        {getGradients()}
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="4" stdDeviation="10" floodOpacity="0.2" />
                        </filter>
                    </defs>

                    {/* Main Phone */}
                    <rect x="75" y="45" width="150" height="210" rx="15" fill="#121212" stroke="url(#phoneGrad)" strokeWidth="2" filter="url(#shadow)" />
                    <rect x="80" y="50" width="140" height="200" rx="10" fill="#0c0612" />
                    <rect x="80" y="50" width="140" height="200" rx="10" fill="url(#screenGrad)" />

                    {/* Screen Content - Center Block */}
                    <rect x="95" y="100" width="110" height="70" rx="5" fill="#241b2e" />
                    <rect x="95" y="100" width="110" height="70" rx="5" fill="#8f46c1" fillOpacity="0.3" />

                    {/* Top & Bottom blocks (swipe targets) */}
                    <motion.g
                        animate={isAnimating ? {
                            y: [0, -40, 0],
                            opacity: [0.8, 1, 0.8]
                        } : {}}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <rect x="95" y="25" width="110" height="70" rx="5" fill="#241b2e" fillOpacity="0.8" />
                        <rect x="95" y="25" width="110" height="70" rx="5" fill="#8f46c1" fillOpacity="0.2" />
                        <text x="150" y="65" fill="#fff" fontSize="8" textAnchor="middle" fillOpacity="0.9">Episode 2</text>
                    </motion.g>

                    <motion.g
                        animate={isAnimating ? {
                            y: [0, 40, 0],
                            opacity: [0.8, 1, 0.8]
                        } : {}}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1.5
                        }}
                    >
                        <rect x="95" y="175" width="110" height="70" rx="5" fill="#241b2e" fillOpacity="0.8" />
                        <rect x="95" y="175" width="110" height="70" rx="5" fill="#a0459b" fillOpacity="0.2" />
                        <text x="150" y="215" fill="#fff" fontSize="8" textAnchor="middle" fillOpacity="0.9">Episode 4</text>
                    </motion.g>

                    {/* Episode labels */}
                    <text x="150" y="135" fill="#fff" fontSize="10" textAnchor="middle" fillOpacity="0.9">Episode 3</text>

                    {/* Vertical Arrows */}
                    <motion.g
                        animate={isAnimating ? {
                            y: [0, -15, 0],
                            opacity: [0.3, 1, 0.3]
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <path d="M150 90 L150 70 L140 80 M150 70 L160 80" stroke="#fff" strokeWidth="2" fill="none" />
                        <text x="180" y="80" fill="#fff" fontSize="10" textAnchor="middle">Next</text>
                    </motion.g>

                    <motion.g
                        animate={isAnimating ? {
                            y: [0, 15, 0],
                            opacity: [0.3, 1, 0.3]
                        } : {}}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1
                        }}
                    >
                        <path d="M150 180 L150 200 L140 190 M150 200 L160 190" stroke="#fff" strokeWidth="2" fill="none" />
                        <text x="180" y="190" fill="#fff" fontSize="10" textAnchor="middle">Previous</text>
                    </motion.g>

                    {/* Episode Progress Dots */}
                    <circle cx="135" y="155" r="4" fill="#8f46c1" />
                    <circle cx="150" y="155" r="4" fill="#8f46c1" />
                    <circle cx="165" y="155" r="4" fill="white" fillOpacity="0.3" />
                    <circle cx="180" y="155" r="4" fill="white" fillOpacity="0.3" />

                    {/* Label */}
                    <rect x="85" y="255" width="130" height="25" rx="5" fill="#241b2e" fillOpacity="0.8" />
                    <text x="150" y="270" fill="#fff" fontSize="12" textAnchor="middle">Series Navigation</text>
                    <text x="150" y="285" fill="#fff" fontSize="8" textAnchor="middle" fillOpacity="0.7">Swipe up/down for next/previous episodes</text>
                </svg>
            );
        }
    };

    return (
        <div className="relative">
            {renderNavigationSVG()}
        </div>
    );
}