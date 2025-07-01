import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaClock, 
  FaStopwatch, 
  FaHourglass,
  FaVolumeUp,
  FaVolumeMute
} from 'react-icons/fa';
import { TimerType, TimerMode } from '@/interfaces/workout-session';

interface WorkoutTimerProps {
  type: TimerType;
  mode: TimerMode;
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number; // in seconds
  targetDuration?: number; // for countdown timers, in seconds
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onComplete?: () => void; // called when countdown reaches 0
  showControls?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  type,
  mode,
  isRunning,
  isPaused,
  currentTime,
  targetDuration,
  onPlay,
  onPause,
  onStop,
  onComplete,
  showControls = true,
  size = 'md',
  className = ''
}) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastWarning, setLastWarning] = useState<number | null>(null);

  // Audio context for beeps (optional enhancement)
  const playBeep = (frequency: number = 800, duration: number = 200) => {
    if (!audioEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  };

  // Handle countdown completion and warnings
  useEffect(() => {
    if (mode === 'countdown' && targetDuration) {
      const remaining = targetDuration - currentTime;
      
      // Completion
      if (remaining <= 0 && isRunning) {
        playBeep(1000, 500); // Completion beep
        onComplete?.();
      }
      // Warning beeps at 10, 5, 3, 2, 1 seconds
      else if (remaining <= 10 && remaining > 0) {
        const secondsLeft = Math.ceil(remaining);
        if ([10, 5, 3, 2, 1].includes(secondsLeft) && secondsLeft !== lastWarning) {
          playBeep(600, 100); // Warning beep
          setLastWarning(secondsLeft);
        }
      }
    }
  }, [currentTime, targetDuration, mode, isRunning, onComplete, lastWarning, audioEnabled]);

  // Format time display
  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate display time based on mode
  const getDisplayTime = (): number => {
    if (mode === 'countdown' && targetDuration) {
      return Math.max(0, targetDuration - currentTime);
    }
    return currentTime;
  };

  // Get timer icon based on type
  const getTimerIcon = () => {
    switch (type) {
      case 'exercise':
        return <FaStopwatch className="text-blue-500" />;
      case 'rest':
        return <FaHourglass className="text-orange-500" />;
      case 'total':
        return <FaClock className="text-green-500" />;
      default:
        return <FaClock />;
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-32 h-32',
          text: 'text-lg',
          icon: 'text-sm',
          button: 'w-8 h-8 text-xs'
        };
      case 'md':
        return {
          container: 'w-40 h-40',
          text: 'text-xl',
          icon: 'text-base',
          button: 'w-10 h-10 text-sm'
        };
      case 'lg':
        return {
          container: 'w-48 h-48',
          text: 'text-2xl',
          icon: 'text-lg',
          button: 'w-12 h-12 text-base'
        };
      case 'xl':
        return {
          container: 'w-56 h-56',
          text: 'text-3xl',
          icon: 'text-xl',
          button: 'w-14 h-14 text-lg'
        };
      default:
        return {
          container: 'w-40 h-40',
          text: 'text-xl',
          icon: 'text-base',
          button: 'w-10 h-10 text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const displayTime = getDisplayTime();
  const progress = mode === 'countdown' && targetDuration ? 
    ((targetDuration - displayTime) / targetDuration) * 100 : 0;

  // Timer color based on state and type
  const getTimerColor = () => {
    if (!isRunning && isPaused) return 'text-yellow-600';
    if (!isRunning) return 'text-gray-600';
    
    if (mode === 'countdown' && targetDuration) {
      const remaining = targetDuration - currentTime;
      if (remaining <= 10) return 'text-red-500';
      if (remaining <= 30) return 'text-orange-500';
    }
    
    switch (type) {
      case 'exercise':
        return 'text-blue-600';
      case 'rest':
        return 'text-orange-600';
      case 'total':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBorderColor = () => {
    if (!isRunning && isPaused) return 'border-yellow-300';
    if (!isRunning) return 'border-gray-300';
    
    switch (type) {
      case 'exercise':
        return 'border-blue-300';
      case 'rest':
        return 'border-orange-300';
      case 'total':
        return 'border-green-300';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Timer Circle */}
      <motion.div
        className={`relative ${sizeClasses.container} rounded-full border-4 ${getBorderColor()} 
          flex items-center justify-center bg-white shadow-lg`}
        animate={{ 
          scale: isRunning ? [1, 1.02, 1] : 1,
          borderColor: isRunning ? undefined : '#d1d5db'
        }}
        transition={{ 
          scale: { repeat: isRunning ? Infinity : 0, duration: 2 },
          borderColor: { duration: 0.3 }
        }}
      >
        {/* Progress ring for countdown mode */}
        {mode === 'countdown' && targetDuration && (
          <svg 
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className={getTimerColor()}
              strokeDasharray={289} // 2 * PI * 46
              initial={{ strokeDashoffset: 289 }}
              animate={{ 
                strokeDashoffset: 289 - (progress / 100) * 289 
              }}
              transition={{ duration: 0.5 }}
            />
          </svg>
        )}
        
        {/* Timer content */}
        <div className="flex flex-col items-center space-y-2 z-10">
          <div className={`${sizeClasses.icon}`}>
            {getTimerIcon()}
          </div>
          <div className={`${sizeClasses.text} font-mono font-bold ${getTimerColor()}`}>
            {formatTime(displayTime)}
          </div>
          {type !== 'total' && (
            <div className="text-xs text-gray-500 capitalize font-medium">
              {type}
            </div>
          )}
        </div>
      </motion.div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center space-x-3">
          {/* Play/Pause Button */}
          <motion.button
            onClick={isRunning ? onPause : onPlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${sizeClasses.button} rounded-full flex items-center justify-center
              ${isRunning 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
              } transition-colors shadow-md`}
          >
            {isRunning ? <FaPause /> : <FaPlay />}
          </motion.button>

          {/* Stop Button */}
          <motion.button
            onClick={onStop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${sizeClasses.button} rounded-full bg-red-500 hover:bg-red-600 
              text-white flex items-center justify-center transition-colors shadow-md`}
          >
            <FaStop />
          </motion.button>

          {/* Audio Toggle */}
          <motion.button
            onClick={() => setAudioEnabled(!audioEnabled)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${sizeClasses.button} rounded-full flex items-center justify-center
              ${audioEnabled 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-400 hover:bg-gray-500 text-white'
              } transition-colors shadow-md`}
          >
            {audioEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </motion.button>
        </div>
      )}

      {/* Status Text */}
      <div className="text-center">
        <div className="text-sm font-medium text-gray-700 capitalize">
          {isPaused ? 'Paused' : isRunning ? 'Running' : 'Stopped'} • {type} Timer
        </div>
        {mode === 'countdown' && targetDuration && (
          <div className="text-xs text-gray-500 mt-1">
            Target: {formatTime(targetDuration)}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTimer;