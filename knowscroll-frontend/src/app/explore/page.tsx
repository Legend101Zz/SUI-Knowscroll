/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaHome, FaPlay, FaPlus, FaUser, FaCompass, FaRandom, FaChevronRight, FaArrowRight, FaFilter, FaStar, FaUsers, FaClock } from 'react-icons/fa';
import { reels } from '@/data/reels';
import { series } from '@/data/series';

// Categories derived from tags in our data
const categories = [
  { id: 'physics', name: 'Physics', color: 'from-[#8f46c1] to-[#a0459b]', icon: '🔭' },
  { id: 'history', name: 'History', color: 'from-[#a0459b] to-[#bd4580]', icon: '📜' },
  { id: 'technology', name: 'Technology', color: 'from-[#bd4580] to-[#d56f66]', icon: '💻' },
  { id: 'mindfulness', name: 'Mindfulness', color: 'from-[#a0459b] to-[#8f46c1]', icon: '🧘' },
  { id: 'astronomy', name: 'Astronomy', color: 'from-[#d56f66] to-[#8f46c1]', icon: '✨' }
];

// Create featured series from our data
const featuredSeries = series.map(s => ({
  ...s,
  thumbnail: s.thumbnailUrl,
  description: s.description || "Educational series",
  episodeCount: s.episodeCount || reels.filter(r => r.seriesId === s.id).length,
  color: s.field === 'Physics' ? 'from-[#8f46c1] to-[#a0459b]' :
    s.field === 'History' ? 'from-[#a0459b] to-[#bd4580]' :
      'from-[#bd4580] to-[#d56f66]'
}));

// Create trending reels from our data
const trendingReels = reels
  .filter(reel => reel.likes > 2000) // Only high-engagement reels
  .sort((a, b) => b.likes - a.likes) // Sort by popularity
  .slice(0, 6) // Take the top 6
  .map(reel => ({
    id: reel.id,
    title: reel.title,
    description: reel.description.substring(0, 60) + "...",
    thumbnail: reel.thumbnailUrl,
    duration: `${Math.floor(reel.duration / 60)}:${(reel.duration % 60).toString().padStart(2, '0')}`,
    views: (reel.views / 1000).toFixed(1) + 'k',
    color: reel.tags.includes('physics') ? 'from-[#8f46c1] to-[#a0459b]' :
      reel.tags.includes('history') ? 'from-[#a0459b] to-[#bd4580]' :
        'from-[#bd4580] to-[#d56f66]'
  }));

// Get all unique featured creators from our data
const featuredCreators = [
  { id: 'user1', name: 'Alex Johnson', avatar: '/images/avatar-alex.jpg', field: 'Physics', followers: '12.4K' },
  { id: 'user2', name: 'Jamie Smith', avatar: '/images/avatar-jamie.jpg', field: 'History', followers: '9.8K' },
  { id: 'user3', name: 'Taylor Wong', avatar: '/images/avatar-taylor.jpg', field: 'Quantum Physics', followers: '11.2K' }
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

export default function ExplorePage() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter series based on search and category
  const getFilteredSeries = () => {
    let filtered = [...featuredSeries];

    if (searchText) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchText.toLowerCase()) ||
        s.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s =>
        s.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredSeries = getFilteredSeries();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary-secondary/5 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 bg-background flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <motion.div
                className="absolute inset-0 border-4 border-primary/30 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-secondary rounded-full flex items-center justify-center text-white">
                <span className="text-2xl font-bold">K</span>
              </div>
            </motion.div>
            <p className="absolute mt-32 text-white/60">Discovering knowledge...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-white/10 px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              className="w-10 h-10 bg-gradient-to-tr from-primary to-primary-secondary rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl font-bold">K</span>
            </motion.div>
            <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary hidden md:block">
              KnowScroll
            </h1>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Search educational content..."
              className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
          </div>

          <div className="flex space-x-2">
            <motion.button
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFilter />
            </motion.button>
            <motion.button
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRandom />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6">
        {/* Categories */}
        <motion.section
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate={!isLoading ? "visible" : "hidden"}
        >
          <motion.h2
            className="text-xl font-bold mb-4 flex items-center"
            variants={itemVariants}
          >
            <FaCompass className="mr-2 text-primary" />
            Explore Categories
          </motion.h2>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
            variants={itemVariants}
          >
            <motion.button
              className={`rounded-xl h-24 p-4 flex flex-col items-center justify-center border ${selectedCategory === 'all'
                ? 'bg-primary/20 border-primary'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              whileHover={{ y: -5, backgroundColor: selectedCategory === 'all' ? "rgba(143, 70, 193, 0.3)" : "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory('all')}
            >
              <span className="text-2xl mb-2">🌟</span>
              <span className="font-medium">All</span>
            </motion.button>

            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`rounded-xl h-24 p-4 flex flex-col items-center justify-center border ${selectedCategory === category.id
                  ? 'bg-primary/20 border-primary'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                whileHover={{ y: -5, backgroundColor: selectedCategory === category.id ? "rgba(143, 70, 193, 0.3)" : "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.section>

        {/* Featured Series */}
        <motion.section
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={!isLoading ? "visible" : "hidden"}
        >
          <motion.div
            className="flex justify-between items-center mb-4"
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold flex items-center">
              <FaStar className="mr-2 text-primary" />
              Featured Series
            </h2>
            <Link href="/series" className="text-sm text-white/70 flex items-center hover:text-white">
              See All <FaChevronRight className="ml-1 text-xs" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeries.length > 0 ? (
              filteredSeries.map((item, index) => (
                <Link href={`/feed?series=${item.id}`} key={item.id}>
                  <motion.div
                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden h-64 relative group"
                    variants={itemVariants}
                    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20`}></div>

                    {/* Thumbnail */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                      <img
                        src={item.thumbnail || `/images/${item.id}-thumb.jpg`}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => {
                          e.currentTarget.src = "/images/test.jpeg"; // Fallback image
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs inline-flex items-center">
                            <FaPlay className="mr-1 text-[10px]" /> {item.field}
                          </div>

                          <div className="flex items-center space-x-1">
                            <div className="px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs flex items-center">
                              <FaClock className="mr-1 text-[10px]" /> {item.episodeCount} eps
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                        <p className="text-sm text-white/70 mb-4 line-clamp-2">{item.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {item.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-xs bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <motion.div
                            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                          >
                            <FaArrowRight className="text-sm" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-white/60">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <FaSearch className="text-2xl" />
                </div>
                <p>No series found matching your search criteria</p>
                <button
                  className="mt-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-full text-sm"
                  onClick={() => {
                    setSearchText('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Trending Reels */}
        <motion.section
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={!isLoading ? "visible" : "hidden"}
        >
          <motion.div
            className="flex justify-between items-center mb-4"
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold flex items-center">
              <FaPlay className="mr-2 text-primary" />
              Trending Clips
            </h2>
            <Link href="/feed" className="text-sm text-white/70 flex items-center hover:text-white">
              See All <FaChevronRight className="ml-1 text-xs" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingReels.map((reel, index) => (
              <Link href={`/feed?reel=${reel.id}`} key={reel.id}>
                <motion.div
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden relative h-48 group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  {/* Background image with gradient */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${reel.color} opacity-20`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                    <img
                      src={reel.thumbnail}
                      alt={reel.title}
                      className="w-full h-full object-cover opacity-50"
                      onError={(e) => {
                        e.currentTarget.src = "/images/test.jpeg"; // Fallback image
                      }}
                    />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs">
                        {reel.duration}
                      </div>
                      <div className="px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs flex items-center">
                        <FaPlay className="mr-1 text-[10px]" /> {reel.views}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-1">{reel.title}</h3>
                      <p className="text-sm text-white/70 line-clamp-1">{reel.description}</p>

                      <motion.div
                        className="mt-3 w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-4 right-4"
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.5)" }}
                      >
                        <FaPlay className="text-white ml-1" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Featured Creators */}
        <motion.section
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={!isLoading ? "visible" : "hidden"}
        >
          <motion.h2
            className="text-xl font-bold mb-4 flex items-center"
            variants={itemVariants}
          >
            <FaUsers className="mr-2 text-primary" />
            Featured Educators
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center"
                variants={itemVariants}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-primary/30">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/avatar-alex.jpg"; // Fallback avatar
                    }}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold">{creator.name}</h3>
                  <p className="text-sm text-white/70">{creator.field}</p>
                  <div className="flex items-center mt-1 text-xs text-primary-light">
                    <FaUsers className="mr-1 text-[10px]" />
                    <span>{creator.followers}</span>
                  </div>
                </div>

                <motion.button
                  className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-full text-xs"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Follow
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Bottom Navigation */}
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
    </div>
  );
}