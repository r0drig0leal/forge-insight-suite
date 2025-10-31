import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  decimals?: number;
  suffix?: string;
}

export const AnimatedCounter = memo(({ 
  value, 
  duration = 2, 
  delay = 0, 
  className = "", 
  style = {},
  decimals = 0,
  suffix = ""
}: AnimatedCounterProps) => {
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  const [display, setDisplay] = useState(safeValue.toFixed(decimals));
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    let rafId: number;
    let timerId: NodeJS.Timeout | null = null;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = easeOutQuart * safeValue;
      setDisplay((typeof currentValue === 'number' && !isNaN(currentValue) ? currentValue : 0).toFixed(decimals));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setDisplay((typeof safeValue === 'number' && !isNaN(safeValue) ? safeValue : 0).toFixed(decimals));
        setIsAnimating(false);
      }
    };

    timerId = setTimeout(() => {
      startTime = null;
      rafId = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      if (timerId) clearTimeout(timerId);
      cancelAnimationFrame(rafId);
    };
  }, [safeValue, duration, delay, decimals]);

  return (
    <motion.span
      className={className}
      style={style}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <span className={isAnimating ? "animate-pulse" : undefined}>
        {display}{suffix}
      </span>
    </motion.span>
  );
});