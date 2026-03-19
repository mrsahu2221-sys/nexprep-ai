import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ totalMinutes, onTimeUp, isRunning = true }) {
  const [secondsLeft, setSecondsLeft] = useState(totalMinutes * 60);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onTimeUp]);

  const hours = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;
  const pct = (secondsLeft / (totalMinutes * 60)) * 100;

  const timerClass = pct < 10 ? 'danger' : pct < 25 ? 'warning' : '';

  return (
    <div className={`timer-display ${timerClass}`}>
      <Clock size={20} />
      <span>
        {hours > 0 && `${hours.toString().padStart(2, '0')}:`}
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
