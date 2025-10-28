import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnimatedMetricProps {
  title: string;
  value: number;
  previousValue?: number;
  unit?: string;
  icon: React.ElementType;
  colorScheme: "primary" | "secondary" | "accent" | "destructive";
  format?: "currency" | "percentage" | "number";
  animationDelay?: number;
  subtitle?: string;
}

export const AnimatedMetric = ({
  title,
  value,
  previousValue,
  unit = "",
  icon: Icon,
  colorScheme,
  format = "number",
  animationDelay = 0,
  subtitle
}: AnimatedMetricProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
      
      // Animate the number counting up
      const startValue = 0;
      const endValue = value;
      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();

      const updateValue = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };
      
      requestAnimationFrame(updateValue);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [value, animationDelay]);

  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return `$${val.toLocaleString()}`;
      case "percentage":
        return `${val.toFixed(1)}%`;
      default:
        return val.toFixed(val % 1 === 0 ? 0 : 1);
    }
  };

  const getChangeIndicator = () => {
    if (previousValue === undefined) return null;
    
    const change = value - previousValue;
    const changePercent = ((change / previousValue) * 100);
    const isPositive = change > 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: animationDelay + 1, duration: 0.3 }}
        className="flex items-center gap-1"
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3 text-secondary" />
        ) : (
          <TrendingDown className="h-3 w-3 text-destructive" />
        )}
        <Badge 
          variant="outline" 
          className={`text-xs ${
            isPositive 
              ? 'bg-secondary/10 text-secondary border-secondary/20' 
              : 'bg-destructive/10 text-destructive border-destructive/20'
          }`}
        >
          {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
        </Badge>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: animationDelay,
        duration: 0.5,
        type: "spring",
        damping: 25,
        stiffness: 300
      }}
      whileHover={{ 
        scale: 1.02, 
        transition: { duration: 0.2 } 
      }}
    >
      <Card className="shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden relative">
        {/* Background Glow Effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br from-${colorScheme}/5 to-transparent opacity-0`}
          animate={{ 
            opacity: hasAnimated ? [0, 0.3, 0] : 0 
          }}
          transition={{ 
            delay: animationDelay + 0.5,
            duration: 2,
            ease: "easeInOut"
          }}
        />
        
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 text-${colorScheme}`} />
              {title}
            </div>
            {getChangeIndicator()}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-start justify-center w-full" style={{ minWidth: 0 }}>
            <motion.div 
              className={`text-3xl font-bold text-${colorScheme} mb-1 w-full text-left`}
              key={displayValue}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{ minWidth: 0 }}
            >
              {formatValue(displayValue)}{unit}
            </motion.div>
            {subtitle && (
              <span className="text-xs text-muted-foreground -mt-1 w-full text-left block truncate" style={{ minWidth: 0 }}>
                {subtitle}
              </span>
            )}
          </div>
          {/* Pulse Animation for Important Metrics */}
          {(colorScheme === "primary" || colorScheme === "secondary") && hasAnimated && (
            <motion.div
              className={`absolute inset-0 border-2 border-${colorScheme}/20 rounded-lg`}
              animate={{ 
                scale: [1, 1.02, 1],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                delay: animationDelay + 1.5,
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};