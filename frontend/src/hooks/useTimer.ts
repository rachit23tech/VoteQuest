'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  onTick?: (remaining: number) => void;
}

export const useTimer = ({ initialSeconds, onTimeUp, onTick }: TimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      if (secondsLeft <= 0 && onTimeUp) {
        onTimeUp();
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const newVal = prev - 1;
        if (onTick) {
          onTick(newVal);
        }
        return newVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onTimeUp, onTick]);

  const pause = () => setIsRunning(false);
  const resume = () => setIsRunning(true);
  const reset = () => {
    setSecondsLeft(initialSeconds);
    setIsRunning(true);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return {
    secondsLeft,
    minutes,
    seconds,
    isRunning,
    pause,
    resume,
    reset,
    formattedTime: `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`,
  };
};
