import React, { useEffect, useState } from 'react';

interface GameClockProps { timeRemaining: string; running?: boolean }

const GameClock: React.FC<GameClockProps> = ({ timeRemaining, running = false }) => {
  const [time, setTime] = useState<string>(timeRemaining);

  // When timeRemaining from parent changes, update the state
  useEffect(() => {
    setTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
  let intervalId: ReturnType<typeof setInterval> | undefined;
    // Only start the interval if running is true and time isn't at 00:00
    if (running && time !== '00:00') {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const [minutes, seconds] = prevTime.split(':').map(Number);
          let newSeconds = seconds - 1;
          let newMinutes = minutes;
          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes -= 1;
          }
          if (newMinutes < 0) {
            return '00:00';
          }
          
          return `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [running, time]); // Depend on both running and time

  return <span>{time}</span>;
};

export default GameClock;
 
