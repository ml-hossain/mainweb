import React, { useState, useEffect, useRef } from 'react'
import { FiX, FiPlay, FiPause, FiVolume2, FiVolumeX, FiInfo } from 'react-icons/fi'

const VideoAd = ({ 
  videoUrl,
  type = 'preroll', // 'preroll', 'midroll', 'postroll', 'banner', 'overlay'
  autoPlay = true,
  muted = true,
  closeable = true,
  showLabel = true,
  skipAfter = 5, // seconds after which skip button appears
  onClose = () => {},
  onSkip = () => {},
  onComplete = () => {},
  className = '',
  // Google Ad Manager / IMA SDK props
  adTagUrl = '', // VAST ad tag URL
  enableIMA = false // Enable Google IMA SDK
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [canSkip, setCanSkip] = useState(false)
  const [adEnded, setAdEnded] = useState(false)
  
  const videoRef = useRef(null)
  const skipTimerRef = useRef(null)

  useEffect(() => {
    if (skipAfter > 0) {
      skipTimerRef.current = setTimeout(() => {
        setCanSkip(true)
      }, skipAfter * 1000)
    }
    return () => {
      if (skipTimerRef.current) {
        clearTimeout(skipTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handleEnded = () => {
      setAdEnded(true)
      onComplete()
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleDurationChange)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleDurationChange)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  const handleSkip = () => {
    setIsVisible(false)
    onSkip()
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (video) {
      video.muted = !video.muted
      setIsMuted(video.muted)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getAdTypeStyles = () => {
    switch (type) {
      case 'banner':
        return 'max-w-full h-32 sm:h-40'
      case 'overlay':
        return 'absolute inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center'
      case 'preroll':
      case 'midroll':
      case 'postroll':
      default:
        return 'max-w-4xl mx-auto'
    }
  }

  return (
    <div className={`relative w-full ${getAdTypeStyles()} my-4 ${className}`}>
      {/* Ad Label */}
      {showLabel && (
        <div className="absolute top-2 left-2 z-20">
          <div className="bg-gray-800 bg-opacity-90 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <FiInfo className="w-3 h-3" />
            <span>Advertisement</span>
          </div>
        </div>
      )}

      {/* Skip Button */}
      {canSkip && !adEnded && (
        <div className="absolute top-2 right-2 z-20">
          <button
            onClick={handleSkip}
            className="bg-gray-800 bg-opacity-90 text-white px-3 py-1 rounded text-sm hover:bg-opacity-100 transition-all duration-200 flex items-center gap-1"
          >
            Skip Ad
          </button>
        </div>
      )}

      {/* Close Button */}
      {closeable && (canSkip || adEnded) && (
        <button
          onClick={handleClose}
          className="absolute top-2 right-12 z-20 bg-gray-800 bg-opacity-90 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-200"
          aria-label="Close ad"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}

      {/* Video Container */}
      <div className="relative bg-black rounded-lg overflow-hidden shadow-xl">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-auto"
          autoPlay={autoPlay}
          muted={muted}
          playsInline
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
          <source src={videoUrl.replace('.mp4', '.ogg')} type="video/ogg" />
          Your browser does not support HTML video.
        </video>

        {/* Custom Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* Progress Bar */}
          <div className="w-full bg-gray-600 bg-opacity-50 h-1 rounded-full mb-3">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
              </button>
              
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
              </button>
              
              {/* Time Display */}
              <span className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            {/* Skip Countdown */}
            {!canSkip && skipAfter > 0 && (
              <div className="text-sm bg-gray-800 bg-opacity-75 px-2 py-1 rounded">
                Skip in {Math.max(0, skipAfter - Math.floor(currentTime))}s
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Google IMA SDK Integration Placeholder */}
      {enableIMA && adTagUrl && (
        <div className="hidden">
          {/* IMA SDK will be injected here */}
          <div id="ima-ad-container" data-ad-tag={adTagUrl}></div>
        </div>
      )}
    </div>
  )
}

export default VideoAd
