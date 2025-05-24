/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
"use client"

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBell, FaChevronRight, FaPlay, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaUsers, FaClock, FaStar, FaCompass, FaGraduationCap, FaRegLightbulb, FaBrain, FaInfinity, FaRandom, FaShareAlt } from 'react-icons/fa';
import ReelsDeck from '@/components/ReelsDeck';
import { deckReels } from '@/data/deckReels';

// Enhanced trending reels with more detailed data
const trendingReels = [
  {
    id: 'reel1',
    title: 'Black Holes Explained',
    subtitle: 'Mind-bending concepts in 60 seconds',
    color: 'from-[#8f46c1] to-[#a0459b]',
    image: '/test.jpeg',
    author: 'Dr. Alex Chen',
    views: '12.5k',
    duration: '60 sec'
  },
  {
    id: 'reel2',
    title: 'Inner Peace',
    subtitle: 'Quick meditation technique to try now',
    color: 'from-[#a0459b] to-[#bd4580]',
    image: '/test.jpeg',
    author: 'Maya Wilson',
    views: '9.8k',
    duration: '45 sec'
  },
  {
    id: 'reel3',
    title: 'Quantum Physics',
    subtitle: 'Wave-particle duality simplified',
    color: 'from-[#bd4580] to-[#d56f66]',
    image: '/test.jpeg',
    author: 'Prof. James Liu',
    views: '11.2k',
    duration: '55 sec'
  }
];

// Platform features with enhanced design
const platformFeatures = [
  {
    title: "Bite-sized Learning",
    description: "Master complex topics in 60-second looping clips",
    icon: <FaClock className="text-2xl" />,
    color: "from-[#8f46c1] to-[#a0459b]"
  },
  {
    title: "Infinite Loops",
    description: "Clips automatically loop for better retention",
    icon: <FaInfinity className="text-2xl" />,
    color: "from-[#a0459b] to-[#bd4580]"
  },
  {
    title: "Smart Sharing",
    description: "Share knowledge clips with friends and study groups",
    icon: <FaShareAlt className="text-2xl" />,
    color: "from-[#bd4580] to-[#d56f66]"
  }
];

// Categories with enhanced design
const categories = [
  {
    name: "Physics",
    color: "from-[#8f46c1] to-[#a0459b]",
    icon: "🔭",
    clips: 42
  },
  {
    name: "History",
    color: "from-[#a0459b] to-[#bd4580]",
    icon: "📜",
    clips: 38
  },
  {
    name: "Psychology",
    color: "from-[#bd4580] to-[#c85975]",
    icon: "🧠",
    clips: 27
  },
  {
    name: "Technology",
    color: "from-[#c85975] to-[#d56f66]",
    icon: "💻",
    clips: 64
  }
];

// The benefit stats for guilt-free section
const scrollBenefits = [
  {
    value: '85%',
    label: 'Knowledge Retention',
    color: 'text-[#8f46c1]',
    icon: <FaBrain className="text-lg" />
  },
  {
    value: '3x',
    label: 'Learning Efficiency',
    color: 'text-[#a0459b]',
    icon: <FaGraduationCap className="text-lg" />
  },
  {
    value: '-32%',
    label: 'Mindless Scrolling',
    color: 'text-[#d56f66]',
    icon: <FaClock className="text-lg" />
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const cardVariants = {
  initial: { scale: 0.9, rotate: -5, opacity: 0 },
  animate: (i) => ({
    scale: 1,
    rotate: i % 2 === 0 ? -2 : 2,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: i * 0.1
    }
  }),
  hover: {
    scale: 1.05,
    rotate: 0,
    zIndex: 10,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.98,
    rotate: 0
  },
  exit: (i) => ({
    x: i % 2 === 0 ? -1000 : 1000,
    opacity: 0,
    transition: { duration: 0.5 }
  })
};

// Enhanced shimmer effect
const shimmer = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 300,
    opacity: 1,
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  }
};

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const cardsControls = useAnimation();
  const cardsRef = useRef();

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle card swipe
  const handleSwipe = (direction) => {
    setSwipeDirection(direction);

    cardsControls.start({
      x: direction === 'left' ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.5 }
    }).then(() => {
      setCurrentCardIndex((prev) =>
        direction === 'left'
          ? (prev + 1) % trendingReels.length
          : (prev - 1 + trendingReels.length) % trendingReels.length
      );
      cardsControls.set({ x: 0, opacity: 1 });
      setSwipeDirection(null);
    });
  };

  // Handle drag end for swipe
  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      handleSwipe('left');
    } else if (info.offset.x > threshold) {
      handleSwipe('right');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0c0612] via-[#131019] to-[#1a1522] text-white overflow-x-hidden font-sans">
      {/* Background animated shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#8f46c1]/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#d56f66]/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-[#a0459b]/10 blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ top: '40%', right: '25%' }}
        />
      </div>

      {/* Initial Loading Animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0612]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">K</span>
              </div>
              <motion.div
                className="h-1 bg-white/20 rounded-full mt-4 w-32"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className="relative z-10 px-6 py-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <motion.div
            className="w-10 h-10 bg-gradient-to-tr from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl font-bold">K</span>
          </motion.div>
          <motion.h1
            className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8f46c1] to-[#d56f66] hidden md:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            KnowScroll
          </motion.h1>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSearch className="text-lg" />
          </motion.button>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-[#d56f66] rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
            />
            <motion.button
              className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
            >
              <FaBell className="text-lg" />
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      <main className="relative z-10 mt-2 px-6">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12 text-center md:text-left max-w-4xl mx-auto md:mx-0"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="block mb-2">
              Short, Looping Clips
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">
              That Make You Smarter
            </span>
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-white/70 mb-8 max-w-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            KnowScroll is a video-sharing platform for educational content that transforms complex topics into bite-sized, looping clips that stick in your mind.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center md:justify-start"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Link href="/feed">
              <motion.div
                className="px-8 py-3 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full font-semibold text-white shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Start Scrolling</span>
                <motion.span
                  initial={{ x: 0, opacity: 0 }}
                  whileHover={{ x: 5, opacity: 1 }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </motion.div>
            </Link>
            <motion.button
              className="px-8 py-3 bg-white/5 backdrop-blur-md rounded-full font-semibold text-white shadow-lg border border-white/10"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center">
                <FaPlay className="mr-2 text-sm" /> Watch Demo
              </span>
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Platform Features Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center mr-2">
                <FaPlay className="text-xs text-white" />
              </div>
              <h3 className="text-xl font-bold">What Makes KnowScroll Special</h3>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platformFeatures.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`bg-gradient-to-br ${feature.color} bg-opacity-20 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors`}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                  backgroundColor: "rgba(255, 255, 255, 0.08)"
                }}
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ReelsDeck Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center mb-6"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center mr-2">
                <FaRandom className="text-xs text-white" />
              </div>
              <h3 className="text-xl font-bold">Trending Loops</h3>
            </div>
            <Link href="/feed">
              <motion.div
                className="flex items-center text-sm text-white/70 hover:text-white"
                whileHover={{ x: 3 }}
              >
                View All <FaChevronRight className="ml-1 text-xs" />
              </motion.div>
            </Link>
          </motion.div>

          <div className="relative flex justify-center">
            <ReelsDeck reels={deckReels} initialIndex={Math.floor(Math.random() * deckReels.length)} />
          </div>
        </motion.section>

        {/* Multi-dimensional Navigation Section */}
        <section className="relative mb-20">
          <motion.div
            className="max-w-5xl mx-auto px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">
                  Multi-Dimensional
                </span> Video Navigation
              </h2>
              <p className="text-white/70 max-w-xl mx-auto">
                Our unique navigation system lets you explore looping clips in ways you&apos;ve never seen before
              </p>
            </motion.div>

            {/* Navigation methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Vertical Navigation */}
              <NavigationMethod
                title="Series Progression"
                description="Episode by episode learning journey"
                direction="vertical"
                color="#8f46c1"
                gradientFrom="from-[#8f46c1]/20"
                gradientTo="to-transparent"
                borderColor="border-[#8f46c1]/30"
              />

              {/* Horizontal Navigation */}
              <NavigationMethod
                title="Alternate Perspectives"
                description="Different angles on the same topic"
                direction="horizontal"
                color="#a0459b"
                gradientFrom="from-[#a0459b]/20"
                gradientTo="to-transparent"
                borderColor="border-[#a0459b]/30"
              />

              {/* Social Navigation */}
              <NavigationMethod
                title="Squad Huddles"
                description="Collaborative learning discussions"
                direction="social"
                color="#d56f66"
                gradientFrom="from-[#d56f66]/20"
                gradientTo="to-transparent"
                borderColor="border-[#d56f66]/30"
              />
            </div>
          </motion.div>
        </section>

        {/* Guilt-Free Scrolling Section */}
        <section className="relative mb-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-3xl">
              {/* Background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0c0612] to-[#1a1522] border border-white/10" />

              <div className="relative p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
                  {/* Left column - text content */}
                  <div className="md:w-1/2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8f46c1] to-[#d56f66] flex items-center justify-center mr-3">
                          <FaRegLightbulb className="text-xl" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold">
                          Loops That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">Teach</span>
                        </h2>
                      </div>

                      <p className="text-white/70 mb-8 text-lg">
                        Our short, looping clips turn mindless scrolling into meaningful learning moments. Each loop reinforces concepts for better retention.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {scrollBenefits.map((benefit, i) => (
                          <motion.div
                            key={i}
                            className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                          >
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
                                {benefit.icon}
                              </div>
                              <p className={`text-2xl font-bold ${benefit.color}`}>{benefit.value}</p>
                            </div>
                            <p className="text-sm text-white/70">{benefit.label}</p>
                          </motion.div>
                        ))}
                      </div>

                      <motion.button
                        className="px-6 py-3 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full text-white font-medium"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Start Looping
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Right column - visualization */}
                  <div className="md:w-1/2">
                    <ComparisonVisual />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-24"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center mb-6"
          >
            <h3 className="text-xl font-bold">Browse Categories</h3>
            <Link href="/categories">
              <motion.div
                className="flex items-center text-sm text-white/70 hover:text-white"
                whileHover={{ x: 3 }}
              >
                View All <FaChevronRight className="ml-1 text-xs" />
              </motion.div>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`rounded-xl overflow-hidden h-36 bg-gradient-to-r ${category.color} relative border border-white/10`}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                  scale: 1.02
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-5xl">
                  {category.icon}
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h4 className="font-semibold text-lg">{category.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">{category.clips} video loops</span>
                    <motion.div
                      className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.2)", scale: 1.1 }}
                    >
                      <FaChevronRight className="text-xs" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section> */}
      </main>

      {/* Navigation */}
      <motion.nav
        className="fixed bottom-0 inset-x-0 h-16 bg-black/30 backdrop-blur-md border-t border-white/10 flex items-center justify-around z-20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.2, type: "spring" }}
      >
        <Link href="/">
          <motion.div
            className="flex flex-col items-center text-white"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </motion.div>
        </Link>

        <Link href="/feed">
          <motion.div
            className="flex flex-col items-center text-white/70"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            <span className="text-xs mt-1">Loops</span>
          </motion.div>
        </Link>

        <Link href="/create">
          <motion.div
            className="w-12 h-12 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center -mt-4 shadow-lg"
            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </motion.div>
        </Link>

        <Link href="/explore">
          <motion.div
            className="flex flex-col items-center text-white/70"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-xs mt-1">Explore</span>
          </motion.div>
        </Link>

        <Link href="/profile">
          <motion.div
            className="flex flex-col items-center text-white/70"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-[#d56f66] rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
              />
            </div>
            <span className="text-xs mt-1">Profile</span>
          </motion.div>
        </Link>
      </motion.nav>
    </div>
  );
}

// Navigation method visualization component
function NavigationMethod({ title, description, direction, color, gradientFrom, gradientTo, borderColor }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`rounded-xl overflow-hidden relative bg-gradient-to-br ${gradientFrom} ${gradientTo} border ${borderColor} h-80 md:h-72`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Base phone outline */}
          <rect
            x="60"
            y="20"
            width="80"
            height="160"
            rx="10"
            fill="#121212"
            stroke="#333"
            strokeWidth="2"
          />
          <rect
            x="65"
            y="25"
            width="70"
            height="150"
            rx="5"
            fill="#0A0A0A"
          />

          {/* Video icon in center of screen */}
          <circle cx="100" cy="90" r="5" fill={color} opacity="0.5" />
          <rect x="95" y="85" width="10" height="10" rx="2" fill={color} opacity="0.8" />

          {/* Screen content based on direction */}
          {direction === "vertical" && (
            <>
              <motion.path
                d="M100 55 L100 35"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ y: isHovered ? [-5, 0, -5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.polygon
                points="90,40 100,30 110,40"
                fill={color}
                animate={{ y: isHovered ? [-5, 0, -5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              <rect x="80" y="70" width="40" height="40" rx="5" fill={color} opacity="0.8" />

              <motion.path
                d="M100 145 L100 165"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ y: isHovered ? [5, 0, 5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.polygon
                points="90,160 100,170 110,160"
                fill={color}
                animate={{ y: isHovered ? [5, 0, 5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Loop indicator */}
              <motion.circle
                cx="100"
                cy="130"
                r="8"
                stroke={color}
                strokeWidth="2"
                fill="none"
                animate={{
                  rotateY: isHovered ? 360 : 0
                }}
                style={{
                  transformOrigin: "100px 130px"
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.path
                d="M100 122 L100 116"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                animate={{
                  rotateY: isHovered ? 360 : 0
                }}
                style={{
                  transformOrigin: "100px 130px"
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </>
          )}

          {direction === "horizontal" && (
            <>
              <motion.path
                d="M45 100 L65 100"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ x: isHovered ? [-5, 0, -5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.polygon
                points="50,90 40,100 50,110"
                fill={color}
                animate={{ x: isHovered ? [-5, 0, -5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              <rect x="80" y="70" width="40" height="40" rx="5" fill={color} opacity="0.8" />

              <motion.path
                d="M155 100 L135 100"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ x: isHovered ? [5, 0, 5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.polygon
                points="150,90 160,100 150,110"
                fill={color}
                animate={{ x: isHovered ? [5, 0, 5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Loop indicator */}
              <motion.circle
                cx="100"
                cy="130"
                r="8"
                stroke={color}
                strokeWidth="2"
                fill="none"
                animate={{
                  rotateY: isHovered ? 360 : 0
                }}
                style={{
                  transformOrigin: "100px 130px"
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.path
                d="M100 122 L100 116"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                animate={{
                  rotateY: isHovered ? 360 : 0
                }}
                style={{
                  transformOrigin: "100px 130px"
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </>
          )}

          {direction === "social" && (
            <>
              <circle cx="100" cy="70" r="20" fill={color} opacity="0.8" />
              <circle cx="70" cy="110" r="14" fill={color} opacity="0.6" />
              <circle cx="100" cy="120" r="12" fill={color} opacity="0.5" />
              <circle cx="130" cy="110" r="14" fill={color} opacity="0.6" />

              <motion.path
                d="M85 70 L115 70"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.path
                d="M100 55 L100 85"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              />

              <motion.path
                d="M70 110 L100 70"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="2,2"
                animate={{ opacity: isHovered ? [0.3, 0.8, 0.3] : 0.3 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.path
                d="M130 110 L100 70"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="2,2"
                animate={{ opacity: isHovered ? [0.3, 0.8, 0.3] : 0.3 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
              <motion.path
                d="M70 110 L130 110"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="2,2"
                animate={{ opacity: isHovered ? [0.3, 0.8, 0.3] : 0.3 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              />

              {/* Loop indicators */}
              <motion.circle
                cx="70"
                cy="140"
                r="6"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                animate={{ rotate: isHovered ? 360 : 0 }}
                style={{ transformOrigin: "70px 140px" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              <motion.circle
                cx="100"
                cy="140"
                r="6"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                animate={{ rotate: isHovered ? 360 : 0 }}
                style={{ transformOrigin: "100px 140px" }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />

              <motion.circle
                cx="130"
                cy="140"
                r="6"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                animate={{ rotate: isHovered ? 360 : 0 }}
                style={{ transformOrigin: "130px 140px" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </>
          )}

          {/* Home indicator */}
          <rect x="90" y="170" width="20" height="2" rx="1" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </motion.div>
  );
}

// Before/After comparison visual component
function ComparisonVisual() {
  return (
    <motion.div
      className="relative w-full h-96"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Before Section */}
        <div className="h-1/2 md:h-full md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 p-6 relative">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">Standard Videos</div>

          <div className="flex flex-col h-full items-center justify-center">
            {/* Phone mockup with mindless scrolling */}
            <div className="relative w-36 h-64 md:w-40 md:h-72 bg-black rounded-3xl border-4 border-gray-800 overflow-hidden">
              <div className="absolute inset-2 rounded-2xl bg-gray-900 overflow-hidden">
                {/* Social media feed mockup */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="relative w-full"
                    animate={{ y: ["0%", "-70%", "0%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Long video thumbnails */}
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-full py-2 px-2 border-b border-gray-800"
                      >
                        <div className="w-full h-20 bg-gray-800 rounded-md mb-2">
                          <div className="absolute right-4 bottom-4 px-2 py-0.5 text-[8px] bg-gray-900 rounded">
                            10:35
                          </div>
                        </div>
                        <div className="h-2 w-24 bg-gray-800 rounded-full mb-1" />
                        <div className="h-2 w-16 bg-gray-800 rounded-full" />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Skip indicators */}
              <motion.div
                className="absolute inset-x-0 bottom-0 h-full pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute right-4 w-6 h-6 rounded-full bg-gray-800/80 flex items-center justify-center text-xs"
                    style={{
                      top: `${30 + i * 22}%`,
                    }}
                    initial={{ x: 0, opacity: 0 }}
                    animate={{
                      x: [0, 20, 0],
                      opacity: [0, 0.7, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 3,
                      ease: "easeInOut"
                    }}
                  >
                    <span>&gt;&gt;</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Time wasted indicator */}
            <motion.div
              className="mt-4 px-4 py-2 bg-red-500/20 backdrop-blur-md rounded-full text-sm border border-red-500/30 flex items-center"
              animate={{
                scale: [1, 1.03, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaClock className="mr-2 text-red-400" /> Low knowledge retention
            </motion.div>
          </div>
        </div>

        {/* After Section */}
        <div className="h-1/2 md:h-full md:w-1/2 p-6 relative">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">KnowScroll Loops</div>

          <div className="flex flex-col h-full items-center justify-center">
            {/* Phone mockup with KnowScroll */}
            <div className="relative w-36 h-64 md:w-40 md:h-72 bg-black rounded-3xl border-4 border-gray-800 overflow-hidden">
              <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-[#0c0612] to-[#1a1522] overflow-hidden">
                {/* Looping clip mockup */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-full h-full"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-[#8f46c1] to-[#d56f66] opacity-60" />

                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <motion.div
                        className="w-12 h-12 rounded-full bg-white/20 mb-4 flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <motion.div
                          className="w-10 h-10 rounded-full border-2 border-white"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>

                      <div className="text-sm font-bold mb-1">Black Holes</div>
                      <div className="text-xs mb-2">Event Horizon Explained</div>

                      {/* Loop indicator */}
                      <motion.div
                        className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs flex items-center mt-2"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="mr-1"
                        >
                          ↻
                        </motion.div>
                        Looping (0:30)
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Navigation indicators */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute left-1/2 top-6 transform -translate-x-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaArrowUp className="text-xs text-white/80" />
                  </motion.div>

                  <motion.div
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <FaArrowRight className="text-xs text-white/80" />
                  </motion.div>
                </div>
              </div>

              {/* Knowledge bubbles floating up */}
              <motion.div
                className="absolute inset-x-0 bottom-0 h-full pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(5)].map((_, i) => {
                  const icons = [
                    <FaBrain key="brain" className="text-[8px] text-white" />,
                    <FaCompass key="compass" className="text-[8px] text-white" />,
                    <FaGraduationCap key="grad" className="text-[8px] text-white" />,
                    <FaRegLightbulb key="bulb" className="text-[8px] text-white" />,
                    <FaStar key="star" className="text-[8px] text-white" />
                  ];

                  return (
                    <motion.div
                      key={i}
                      className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-[#8f46c1] to-[#d56f66] flex items-center justify-center"
                      style={{
                        left: `${20 + i * 12}%`,
                        bottom: '10%'
                      }}
                      initial={{ y: 0, opacity: 0 }}
                      animate={{
                        y: -100 - i * 20,
                        opacity: [0, 0.9, 0],
                        x: i % 2 === 0 ? [0, 10, -5, 0] : [0, -10, 5, 0]
                      }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "easeOut"
                      }}
                    >
                      {icons[i]}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Knowledge gained indicator */}
            <motion.div
              className="mt-4 px-4 py-2 bg-green-500/20 backdrop-blur-md rounded-full text-sm border border-green-500/30 flex items-center"
              animate={{
                scale: [1, 1.03, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaGraduationCap className="mr-2 text-green-400" /> Perfect for concept retention
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}