/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ContentCardProps {
    id: string;
    title: string;
    subtitle?: string;
    image?: string;
    color?: string;
    index?: number;
    linkTo?: string;
    type?: 'standard' | 'featured' | 'small';
}

export default function ContentCard({
    id,
    title,
    subtitle,
    image = '/api/placeholder/400/500',
    color = 'from-primary-500 to-primary-800',
    index = 0,
    linkTo = '/feed',
    type = 'standard'
}: ContentCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Animation variants for different card types
    const cardVariants = {
        standard: {
            initial: {
                scale: 0.95,
                rotate: index % 2 === 0 ? -2 : 2,
                y: 0,
                opacity: 0
            },
            animate: {
                scale: 1,
                rotate: index % 2 === 0 ? -1 : 1,
                y: 0,
                opacity: 1,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: index * 0.1
                }
            },
            hover: {
                scale: 1.05,
                rotate: 0,
                y: -10,
                zIndex: 10,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                }
            },
            tap: {
                scale: 0.98,
                rotate: 0
            }
        },
        featured: {
            initial: {
                scale: 0.9,
                opacity: 0
            },
            animate: {
                scale: 1,
                opacity: 1,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: index * 0.1
                }
            },
            hover: {
                scale: 1.03,
                y: -5,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                }
            },
            tap: {
                scale: 0.98
            }
        },
        small: {
            initial: {
                scale: 0.9,
                opacity: 0
            },
            animate: {
                scale: 1,
                opacity: 1,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: index * 0.1
                }
            },
            hover: {
                scale: 1.08,
                y: -5,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                }
            },
            tap: {
                scale: 0.95
            }
        }
    };

    const selectedVariant = cardVariants[type];

    // Size classes based on card type
    const sizeClasses = {
        standard: 'w-64 h-80 md:w-72 md:h-96',
        featured: 'w-full h-80 md:h-96',
        small: 'w-40 h-48 md:w-48 md:h-56'
    };

    return (
        <Link href={linkTo}>
            <motion.div
                className={`relative ${sizeClasses[type]} rounded-2xl overflow-hidden shadow-xl 
                  bg-gradient-to-b ${color} flex flex-col justify-between
                  border border-white/10`}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                variants={selectedVariant}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                {/* Background image and overlay */}
                <div className="absolute inset-0 w-full h-full">
                    {/* Optional shimmer effect on hover */}
                    {isHovered && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 300 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Top section with icon/logo */}
                <div className="relative z-10 p-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md" />
                </div>

                {/* Bottom text section */}
                <div className="relative z-10 p-4 text-white">
                    <h4 className={`${type === 'small' ? 'text-lg' : 'text-2xl'} font-bold mb-2`}>
                        {title}
                    </h4>

                    {subtitle && (
                        <p className={`${type === 'small' ? 'text-xs' : 'text-sm'} text-white/80 mb-4`}>
                            {subtitle}
                        </p>
                    )}

                    <motion.div
                        className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm inline-flex items-center justify-center"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="mr-2"
                        >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Play
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
}