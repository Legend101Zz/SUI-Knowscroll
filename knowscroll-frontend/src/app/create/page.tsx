/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCloudUploadAlt,
  FaVideo,
  FaTimes,
  FaChevronRight,
  FaTag,
  FaBook,
  FaPlus,
  FaRandom,
  FaHome,
  FaCompass,
  FaUser,
  FaPlay,
  FaCog,
  FaCheck,
  FaInfoCircle,
  FaLightbulb
} from 'react-icons/fa';
import Link from 'next/link';
import NavigationSVG from '@/components/NavigationSVG';

export default function CreatePage() {
  // Core state
  const [uploadStep, setUploadStep] = useState<'initial' | 'uploading' | 'processing' | 'metadata' | 'preview' | 'publishing' | 'complete'>('initial');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHyperReel, setIsHyperReel] = useState(false);
  const [originalVersionId, setOriginalVersionId] = useState<string | null>(null);

  // Form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isPartOfSeries, setIsPartOfSeries] = useState(false);
  const [seriesTitle, setSeriesTitle] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('1');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);

  // Categories
  const categories = [
    { id: 'physics', name: 'Physics', color: 'from-[#8f46c1] to-[#a0459b]' },
    { id: 'history', name: 'History', color: 'from-[#a0459b] to-[#bd4580]' },
    { id: 'psychology', name: 'Psychology', color: 'from-[#bd4580] to-[#c85975]' },
    { id: 'technology', name: 'Technology', color: 'from-[#c85975] to-[#d56f66]' },
    { id: 'math', name: 'Mathematics', color: 'from-[#8f46c1] to-[#d56f66]' },
    { id: 'biology', name: 'Biology', color: 'from-[#58ABFF] to-[#4DE6C8]' },
  ];

  // Handle file selection from input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.includes('video/')) {
        processFile(file);
      } else {
        // Show error - only video files allowed
        alert('Please select a video file');
      }
    }
  };

  // Handle drag and drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('video/')) {
        processFile(file);
      } else {
        // Show error - only video files allowed
        alert('Please select a video file');
      }
    }
  };

  // Process the uploaded file
  const processFile = (file: File) => {
    setVideoFile(file);
    setUploadStep('uploading');

    // Create a preview URL
    const videoUrl = URL.createObjectURL(file);
    setVideoPreview(videoUrl);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(100);

        // Move to processing stage after a brief delay
        setTimeout(() => {
          setUploadStep('processing');
          simulateProcessing();
        }, 500);
      }
      setUploadProgress(progress);
    }, 300);
  };

  // Simulate video processing
  const simulateProcessing = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setProcessingProgress(100);

        // Move to metadata stage after a brief delay
        setTimeout(() => {
          setUploadStep('metadata');
        }, 500);
      }
      setProcessingProgress(progress);
    }, 200);
  };

  // Handle form submission
  const handleMetadataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStep('preview');
  };

  // Add a tag
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle publishing
  const handlePublish = () => {
    setUploadStep('publishing');

    // Simulate publishing process
    setTimeout(() => {
      setUploadStep('complete');
    }, 2000);
  };

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

  // Function to handle upload button click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Reset the form
  const handleReset = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setTitle('');
    setDescription('');
    setSelectedCategory('');
    setTags([]);
    setCurrentTag('');
    setIsPartOfSeries(false);
    setSeriesTitle('');
    setEpisodeNumber('1');
    setIsHyperReel(false);
    setOriginalVersionId(null);
    setUploadStep('initial');
    setUploadProgress(0);
    setProcessingProgress(0);
  };

  // Function to create a placeholder thumbnail
  const getPlaceholderThumbnail = () => {
    const categories = ['physics', 'history', 'psychology', 'technology', 'math', 'biology'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return `/images/${randomCategory}-thumb.jpg`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-primary-500 to-primary-800 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-tr from-primary-secondary to-primary-800 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/">
            <div className="flex items-center">
              <motion.div
                className="w-10 h-10 bg-gradient-to-tr from-primary to-primary-secondary rounded-full flex items-center justify-center shadow-lg mr-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl font-bold">K</span>
              </motion.div>
              <motion.h1
                className="text-xl font-bold hidden md:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                KnowScroll
              </motion.h1>
            </div>
          </Link>

          <div className="flex items-center">
            <h2 className="text-xl font-semibold mr-2">Create New Reel</h2>
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-secondary flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <FaPlus className="text-sm" />
            </motion.div>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-8 px-6 max-w-6xl mx-auto">
        {/* Steps indicator */}
        <div className="mb-10">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            {['initial', 'uploading', 'processing', 'metadata', 'preview', 'publishing', 'complete'].map((step, index) => (
              <div
                key={step}
                className="flex flex-col items-center relative"
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${['uploading', 'processing', 'metadata', 'preview', 'publishing', 'complete'].indexOf(uploadStep) >= index
                    ? 'bg-primary'
                    : 'bg-white/10'
                    }`}
                  animate={{
                    scale: uploadStep === step ? [1, 1.2, 1] : 1,
                    boxShadow: uploadStep === step ? [
                      '0 0 0 rgba(143, 70, 193, 0.4)',
                      '0 0 20px rgba(143, 70, 193, 0.6)',
                      '0 0 0 rgba(143, 70, 193, 0.4)'
                    ] : 'none'
                  }}
                  transition={{
                    duration: 2,
                    repeat: uploadStep === step ? Infinity : 0
                  }}
                >
                  {step === 'initial' && <FaCloudUploadAlt className="text-sm" />}
                  {step === 'uploading' && <FaVideo className="text-sm" />}
                  {step === 'processing' && <FaCog className="text-sm" />}
                  {step === 'metadata' && <FaTag className="text-sm" />}
                  {step === 'preview' && <FaPlay className="text-sm" />}
                  {step === 'publishing' && <FaRandom className="text-sm" />}
                  {step === 'complete' && <FaCheck className="text-sm" />}
                </motion.div>

                <p className={`text-xs ${uploadStep === step ? 'text-primary-light' : 'text-white/50'}`}>
                  {step === 'initial' ? 'Upload' :
                    step === 'uploading' ? 'Uploading' :
                      step === 'processing' ? 'Processing' :
                        step === 'metadata' ? 'Details' :
                          step === 'preview' ? 'Preview' :
                            step === 'publishing' ? 'Publishing' : 'Complete'}
                </p>

                {index < 6 && (
                  <div className={`absolute top-4 left-full w-5 md:w-10 h-0.5 -ml-1 md:-ml-3 ${['uploading', 'processing', 'metadata', 'preview', 'publishing', 'complete'].indexOf(uploadStep) > index
                    ? 'bg-primary'
                    : 'bg-white/10'
                    }`} style={{ transform: 'translateX(50%)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Initial Upload UI */}
        <AnimatePresence mode="wait">
          {uploadStep === 'initial' && (
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div
                ref={uploadAreaRef}
                className={`border-2 border-dashed rounded-3xl p-8 md:p-12 mb-8 text-center transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
                  }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="video/*"
                  className="hidden"
                />

                <motion.div
                  initial={{ scale: 1 }}
                  animate={{
                    scale: isDragging ? 1.05 : 1,
                    y: isDragging ? -10 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <motion.div
                      animate={{
                        y: isDragging ? [-10, 0] : 0,
                        opacity: isDragging ? [0.5, 1] : 1
                      }}
                      transition={{
                        repeat: isDragging ? Infinity : 0,
                        duration: 1,
                        repeatType: "reverse"
                      }}
                    >
                      <FaCloudUploadAlt className="text-4xl text-primary-light" />
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">
                    Drag & Drop your educational video here
                  </h3>
                  <p className="text-white/60 mb-6 max-w-md mx-auto">
                    Share your knowledge with the world. Upload a video file (MP4, WebM, MOV) up to 10 minutes long.
                  </p>

                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary-secondary rounded-full font-medium"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUploadClick}
                  >
                    Select Video
                  </motion.button>
                </motion.div>

                {/* Video Format Information */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <h4 className="font-semibold mb-1 text-sm">Supported Formats</h4>
                    <p className="text-white/60 text-xs">MP4, WebM, MOV</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <h4 className="font-semibold mb-1 text-sm">Max Duration</h4>
                    <p className="text-white/60 text-xs">10 minutes</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <h4 className="font-semibold mb-1 text-sm">Resolution</h4>
                    <p className="text-white/60 text-xs">1080p recommended</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <h4 className="font-semibold mb-1 text-sm">Max Size</h4>
                    <p className="text-white/60 text-xs">500 MB</p>
                  </div>
                </div>
              </div>

              {/* Navigation Concept Showcase */}
              <motion.div
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="flex flex-col md:flex-row items-center gap-6" variants={itemVariants}>
                  <div className="w-full md:w-auto">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <FaLightbulb className="text-xl text-primary-light" />
                      </div>
                      <h3 className="text-lg font-semibold">KnowScroll&apos;s Multi-Dimensional Navigation</h3>
                    </div>

                    <p className="text-white/70 text-sm mb-5">
                      Make your content stand out with KnowScroll&apos;s unique navigation system. Users can explore content in multiple dimensions, creating a rich, interactive learning experience.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <h4 className="font-semibold text-sm mb-1">Series Navigation</h4>
                        <p className="text-xs text-white/60">Vertical swipes for episode progression</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <h4 className="font-semibold text-sm mb-1">HyperReels</h4>
                        <p className="text-xs text-white/60">Horizontal swipes for alternate perspectives</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <h4 className="font-semibold text-sm mb-1">Squad Huddles</h4>
                        <p className="text-xs text-white/60">Group discussions around content</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      <NavigationSVG mode="standard" size={200} />
                    </motion.div>
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      <NavigationSVG mode="hyper" size={200} />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* HyperReels Information */}
              <motion.div
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="flex items-start" variants={itemVariants}>
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <FaRandom className="text-xl text-primary-light" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Create a HyperReel</h3>
                    <p className="text-white/70 text-sm mb-3">
                      HyperReels allow viewers to swipe left/right to see different perspectives on the same topic.
                      Create alternate versions of existing content for a richer learning experience.
                    </p>

                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isHyperReel}
                            onChange={() => setIsHyperReel(!isHyperReel)}
                          />
                          <div className="w-10 h-5 bg-white/10 rounded-full shadow-inner"></div>
                          <div className={`absolute left-0 top-0 w-5 h-5 bg-white rounded-full transition-transform transform ${isHyperReel ? 'translate-x-5 bg-primary' : ''}`}></div>
                        </div>
                        <span className="ml-3 text-sm font-medium">
                          This is a HyperReel (alternate version)
                        </span>
                      </label>
                    </div>

                    {isHyperReel && (
                      <motion.div
                        className="mt-4 bg-white/5 rounded-xl p-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block mb-2 text-sm">Select original video</label>
                        <select
                          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3"
                          value={originalVersionId || ''}
                          onChange={(e) => setOriginalVersionId(e.target.value)}
                        >
                          <option value="">Select original version</option>
                          <option value="laser-main">How Lasers Work</option>
                          <option value="ai-intro">The AI Revolution: An Introduction</option>
                        </select>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Uploading UI */}
          {uploadStep === 'uploading' && (
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#1a1522"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#8f46c1"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, rotate: -90 }}
                      animate={{
                        pathLength: uploadProgress / 100,
                        rotate: -90
                      }}
                      style={{
                        pathLength: uploadProgress / 100,
                        rotate: -90,
                        transformOrigin: "center"
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{Math.round(uploadProgress)}%</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2">Uploading your video</h3>
                <p className="text-white/60 mb-2">This may take a few minutes depending on your connection</p>
                <p className="text-sm text-primary-light">{videoFile?.name}</p>

                {videoPreview && (
                  <motion.div
                    className="mt-8 rounded-xl overflow-hidden mx-auto max-w-sm"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <video
                      ref={videoRef}
                      src={videoPreview}
                      className="w-full h-full object-cover rounded-xl"
                      controls
                      muted
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Processing UI */}
          {uploadStep === 'processing' && (
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="relative w-24 h-24 mx-auto mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {[...Array(8)].map((_, i) => (
                      <motion.line
                        key={i}
                        x1="50"
                        y1="20"
                        x2="50"
                        y2="10"
                        stroke="#8f46c1"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{
                          transformOrigin: "center",
                          transform: `rotate(${i * 45}deg)`,
                          opacity: 1 - (i * 0.1)
                        }}
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{Math.round(processingProgress)}%</span>
                  </div>
                </motion.div>

                <h3 className="text-xl font-semibold mb-2">Processing your video</h3>
                <p className="text-white/60 mb-6">We&apos;re optimizing your content for the KnowScroll platform</p>

                {/* Processing steps */}
                <div className="max-w-md mx-auto">
                  <motion.div
                    className="flex items-center mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: processingProgress > 20 ? 1 : 0.5 }}
                  >
                    <motion.div
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${processingProgress > 20 ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      {processingProgress > 20 && <FaCheck className="text-[10px]" />}
                    </motion.div>
                    <span className="text-sm">Transcoding for multiple devices</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: processingProgress > 40 ? 1 : 0.5 }}
                  >
                    <motion.div
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${processingProgress > 40 ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      {processingProgress > 40 && <FaCheck className="text-[10px]" />}
                    </motion.div>
                    <span className="text-sm">Generating thumbnails</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: processingProgress > 60 ? 1 : 0.5 }}
                  >
                    <motion.div
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${processingProgress > 60 ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      {processingProgress > 60 && <FaCheck className="text-[10px]" />}
                    </motion.div>
                    <span className="text-sm">Optimizing for loop playback</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: processingProgress > 80 ? 1 : 0.5 }}
                  >
                    <motion.div
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${processingProgress > 80 ? 'bg-primary' : 'bg-white/10'}`}
                    >
                      {processingProgress > 80 && <FaCheck className="text-[10px]" />}
                    </motion.div>
                    <span className="text-sm">Preparing content for mobile viewing</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Metadata Form UI */}
          {uploadStep === 'metadata' && (
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleMetadataSubmit} className="mb-8">
                <div className="md:flex gap-8">
                  {/* Preview Column */}
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <div className="sticky top-24">
                      {videoPreview && (
                        <motion.div
                          className="rounded-xl overflow-hidden mb-4"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <video
                            src={videoPreview}
                            className="w-full h-full object-cover"
                            controls
                            muted
                          />
                        </motion.div>
                      )}

                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="font-semibold mb-2">Video Information</h4>
                        <div className="text-sm text-white/70 space-y-2">
                          <p>Filename: {videoFile?.name}</p>
                          <p>Size: {videoFile ? (videoFile.size / (1024 * 1024)).toFixed(2) + " MB" : "Unknown"}</p>
                          <p>Duration: ~{videoRef.current?.duration ? Math.round(videoRef.current.duration) + " sec" : "Calculating..."}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Column */}
                  <div className="md:w-2/3">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                      {/* Title */}
                      <motion.div className="mb-6" variants={itemVariants}>
                        <label className="block mb-2 font-medium" htmlFor="title">Title (Required)</label>
                        <input
                          type="text"
                          id="title"
                          className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 focus:border-primary focus:outline-none"
                          placeholder="Enter a clear, descriptive title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          maxLength={100}
                        />
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-white/50">{title.length}/100</span>
                        </div>
                      </motion.div>

                      {/* Description */}
                      <motion.div className="mb-6" variants={itemVariants}>
                        <label className="block mb-2 font-medium" htmlFor="description">Description</label>
                        <textarea
                          id="description"
                          className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 focus:border-primary focus:outline-none min-h-[120px]"
                          placeholder="Provide details about your educational content"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          maxLength={500}
                        />
                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-white/50">{description.length}/500</span>
                        </div>
                      </motion.div>

                      {/* Category */}
                      <motion.div className="mb-6" variants={itemVariants}>
                        <label className="block mb-2 font-medium">Category</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {categories.map(category => (
                            <motion.div
                              key={category.id}
                              className={`rounded-lg p-3 cursor-pointer border ${selectedCategory === category.id
                                ? 'border-primary bg-primary/20'
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedCategory(category.id)}
                            >
                              <div className={`w-full h-1 rounded-full bg-gradient-to-r ${category.color} mb-2`}></div>
                              <p className="text-sm font-medium">{category.name}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Tags */}
                      <motion.div className="mb-6" variants={itemVariants}>
                        <label className="block mb-2 font-medium">Tags</label>
                        <div className="flex">
                          <input
                            type="text"
                            className="flex-1 bg-white/5 border border-white/20 rounded-l-lg py-3 px-4 focus:border-primary focus:outline-none"
                            placeholder="Add tags (e.g. physics, quantum, education)"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                          />
                          <motion.button
                            type="button"
                            className="bg-primary px-4 rounded-r-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddTag}
                          >
                            <FaPlus />
                          </motion.button>
                        </div>

                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {tags.map(tag => (
                              <motion.div
                                key={tag}
                                className="bg-primary/20 rounded-full px-3 py-1 text-sm flex items-center"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                              >
                                {tag}
                                <motion.button
                                  type="button"
                                  className="ml-2 text-white/70 hover:text-white"
                                  whileHover={{ scale: 1.2, rotate: 90 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleRemoveTag(tag)}
                                >
                                  <FaTimes className="text-xs" />
                                </motion.button>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>

                      {/* Series Toggle */}
                      <motion.div className="mb-6" variants={itemVariants}>
                        <div className="flex items-center mb-3">
                          <label className="flex items-center cursor-pointer">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={isPartOfSeries}
                                onChange={() => setIsPartOfSeries(!isPartOfSeries)}
                              />
                              <div className="w-10 h-5 bg-white/10 rounded-full shadow-inner"></div>
                              <div className={`absolute left-0 top-0 w-5 h-5 bg-white rounded-full transition-transform transform ${isPartOfSeries ? 'translate-x-5 bg-primary' : ''}`}></div>
                            </div>
                            <span className="ml-3 font-medium">
                              This is part of a series
                            </span>
                          </label>
                        </div>

                        {isPartOfSeries && (
                          <motion.div
                            className="bg-white/5 rounded-xl p-4"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <div className="mb-3">
                              <label className="block mb-2 text-sm">Series Title</label>
                              <input
                                type="text"
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3"
                                placeholder="e.g. Quantum Physics Fundamentals"
                                value={seriesTitle}
                                onChange={(e) => setSeriesTitle(e.target.value)}
                              />
                            </div>

                            <div className="mb-3">
                              <label className="block mb-2 text-sm">Episode Number</label>
                              <input
                                type="number"
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3"
                                min="1"
                                value={episodeNumber}
                                onChange={(e) => setEpisodeNumber(e.target.value)}
                              />
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div className="flex justify-end" variants={itemVariants}>
                        <motion.button
                          type="submit"
                          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-secondary rounded-full font-medium"
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          disabled={!title.trim()}
                        >
                          Continue to Preview
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* Preview UI */}
          {uploadStep === 'preview' && (
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-center">Preview Your Reel</h3>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Video Preview */}
                  <div>
                    <div className="rounded-xl overflow-hidden mb-4 bg-white/5 border border-white/10">
                      {videoPreview && (
                        <video
                          src={videoPreview}
                          className="w-full h-full object-cover"
                          controls
                          autoPlay
                          muted
                          loop
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Video</p>
                      <motion.button
                        className="text-sm text-primary-light flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setUploadStep('metadata')}
                      >
                        <FaRandom className="mr-1" /> Change
                      </motion.button>
                    </div>

                    <p className="text-sm text-white/60">
                      File: {videoFile?.name}<br />
                      Size: {videoFile ? (videoFile.size / (1024 * 1024)).toFixed(2) + " MB" : "Unknown"}<br />
                      Duration: ~{videoRef.current?.duration ? Math.round(videoRef.current.duration) + " sec" : "Calculating..."}
                    </p>
                  </div>

                  {/* Content Preview */}
                  <div>
                    <div className="rounded-xl overflow-hidden relative bg-background-lighter border border-white/10 h-full p-6">
                      <motion.div
                        className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/10 to-primary-secondary/10 z-0"
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />

                      <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">{title}</h2>

                        {selectedCategory && (
                          <div className="flex items-center mb-3">
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">
                              {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                            </div>
                          </div>
                        )}

                        <p className="text-white/70 mb-4 line-clamp-3">
                          {description || "No description provided."}
                        </p>

                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {tags.map(tag => (
                              <div key={tag} className="bg-white/10 rounded-full px-3 py-1 text-xs">
                                {tag}
                              </div>
                            ))}
                          </div>
                        )}

                        {isPartOfSeries && (
                          <div className="bg-white/10 rounded-xl p-3 mb-4">
                            <div className="flex items-center mb-2">
                              <FaBook className="mr-2 text-sm text-primary-light" />
                              <span className="font-medium">{seriesTitle}</span>
                            </div>
                            <div className="flex items-center text-sm text-white/70">
                              <span>Episode {episodeNumber}</span>
                            </div>
                          </div>
                        )}

                        {isHyperReel && (
                          <div className="bg-primary/20 rounded-xl p-3 mb-4">
                            <div className="flex items-center">
                              <FaRandom className="mr-2 text-sm text-primary-light" />
                              <span className="font-medium">HyperReel</span>
                            </div>
                            <p className="text-sm text-white/70 mt-1">
                              Alternate version of &quot;{originalVersionId === 'laser-main' ? 'How Lasers Work' : originalVersionId === 'ai-intro' ? 'The AI Revolution: An Introduction' : 'original content'}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <motion.button
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setUploadStep('metadata')}
                      >
                        Edit Details
                      </motion.button>

                      <motion.button
                        className="px-6 py-2 bg-gradient-to-r from-primary to-primary-secondary rounded-full text-sm font-medium"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePublish}
                      >
                        Publish Now
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Publishing UI */}
          {uploadStep === 'publishing' && (
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-6 relative"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#1a1522"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: [0, 0.3, 0.5, 0.8, 1],
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8f46c1" />
                      <stop offset="100%" stopColor="#d56f66" />
                    </linearGradient>
                  </defs>
                </svg>

                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <FaRandom className="text-2xl text-primary-light" />
                </motion.div>
              </motion.div>

              <h3 className="text-xl font-semibold mb-3">Publishing Your Reel</h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Your content is being prepared for the KnowScroll feed.
                This will only take a moment.
              </p>

              <div className="flex flex-col items-center">
                <motion.div
                  className="w-full max-w-md h-1 bg-white/10 rounded-full overflow-hidden mb-6"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary-secondary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                  />
                </motion.div>

                <motion.div
                  className="text-sm text-white/60"
                  animate={{
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  Optimizing for multi-dimensional navigation...
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Complete UI */}
          {uploadStep === 'complete' && (
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary to-primary-secondary rounded-full flex items-center justify-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  boxShadow: [
                    "0 0 0 rgba(143, 70, 193, 0.4)",
                    "0 0 30px rgba(143, 70, 193, 0.6)",
                    "0 0 0 rgba(143, 70, 193, 0.4)"
                  ]
                }}
                transition={{
                  duration: 2,
                  boxShadow: {
                    repeat: Infinity,
                    duration: 2
                  }
                }}
              >
                <FaCheck className="text-3xl" />
              </motion.div>

              <h3 className="text-xl font-semibold mb-3">Your Reel is Live!</h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Your content is now available on the KnowScroll platform.
                Others can now discover and learn from your knowledge.
              </p>

              {/* Preview card */}
              <motion.div
                className="max-w-xs mx-auto rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-8"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.3)"
                }}
              >
                <div className="h-48 relative">
                  {videoPreview ? (
                    <video
                      src={videoPreview}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary-secondary/30" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h4 className="text-lg font-bold truncate">{title}</h4>
                    <div className="flex items-center">
                      <div className="px-2 py-0.5 bg-white/10 rounded-full text-xs mr-2">
                        {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Educational'}
                      </div>
                      <span className="text-xs text-white/70">Just now</span>
                    </div>
                  </div>

                  <motion.button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(143, 70, 193, 1)"
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaPlay className="text-sm" />
                  </motion.button>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/feed">
                  <motion.button
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-medium w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Go to Feed
                  </motion.button>
                </Link>

                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary-secondary rounded-full font-medium flex items-center justify-center w-full sm:w-auto"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                >
                  <FaPlus className="mr-2" /> Create Another
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-t border-white/5 flex items-center justify-around z-30"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100,
          delay: 0.3
        }}
      >
        <Link href="/">
          <motion.div
            className="flex flex-col items-center justify-center w-16"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHome className="text-xl mb-1 text-white/80" />
            <span className="text-xs text-white/60">Home</span>
          </motion.div>
        </Link>

        <Link href="/explore">
          <motion.div
            className="flex flex-col items-center justify-center w-16"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCompass className="text-xl mb-1 text-white/80" />
            <span className="text-xs text-white/60">Explore</span>
          </motion.div>
        </Link>

        <motion.div
          className="flex flex-col items-center justify-center -mt-8 relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary-secondary flex items-center justify-center shadow-lg"
            animate={{
              boxShadow: [
                "0 0 0px rgba(143, 70, 193, 0.3)",
                "0 0 20px rgba(143, 70, 193, 0.5)",
                "0 0 0px rgba(143, 70, 193, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaPlus className="text-xl" />
          </motion.div>
          <span className="text-xs text-primary-light mt-1">Create</span>
        </motion.div>

        <Link href="/feed">
          <motion.div
            className="flex flex-col items-center justify-center w-16"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay className="text-xl mb-1 text-white/80" />
            <span className="text-xs text-white/60">Feed</span>
          </motion.div>
        </Link>

        <Link href="/profile">
          <motion.div
            className="flex flex-col items-center justify-center w-16"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUser className="text-xl mb-1 text-white/80" />
            <span className="text-xs text-white/60">Profile</span>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}