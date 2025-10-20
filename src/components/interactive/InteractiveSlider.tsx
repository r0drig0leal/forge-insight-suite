import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, AlertTriangle } from "lucide-react";

interface InteractiveSliderProps {
  title: string;
  baseValue: number;
  currentValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: React.ElementType;
  onValueChange: (value: number) => void;
  impactCalculation: (value: number) => {
    newRiskScore: number;
    impact: string;
    description: string;
  };
}

export const InteractiveSlider = ({
  title,
  baseValue,
  currentValue,
  min,
  max,
  step,
  unit,
  icon: Icon,
  onValueChange,
  impactCalculation
}: InteractiveSliderProps) => {
  const [sliderValue, setSliderValue] = useState([currentValue]);
  const [impact, setImpact] = useState(impactCalculation(currentValue));

  useEffect(() => {
    const newImpact = impactCalculation(sliderValue[0]);
    setImpact(newImpact);
    onValueChange(sliderValue[0]);
  }, [sliderValue, impactCalculation, onValueChange]);

  const getImpactColor = (impactType: string) => {
    switch (impactType) {
      case 'positive': return 'text-secondary';
      case 'negative': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactIcon = (impactType: string) => {
    switch (impactType) {
      case 'positive': return TrendingUp;
      case 'negative': return AlertTriangle;
      default: return Calculator;
    }
  };

  const ImpactIcon = getImpactIcon(impact.impact);
  const percentChange = ((sliderValue[0] - baseValue) / baseValue) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Value Display */}
          <div className="text-center">
            <motion.div 
              className="text-3xl font-bold text-primary mb-2"
              key={sliderValue[0]}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {sliderValue[0].toFixed(step < 1 ? 2 : 0)}{unit}
            </motion.div>
            {percentChange !== 0 && (
              <Badge 
                variant="outline" 
                className={`${percentChange > 0 ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
              >
                {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}% from base
              </Badge>
            )}
          </div>

          {/* Slider */}
          <div className="px-2">
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              min={min}
              max={max}
              step={step}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{min}{unit}</span>
              <span>{max}{unit}</span>
            </div>
          </div>

          {/* Impact Analysis */}
          <motion.div 
            className="bg-muted/50 rounded-lg p-3 space-y-2"
            key={impact.newRiskScore}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <ImpactIcon className={`h-4 w-4 ${getImpactColor(impact.impact)}`} />
              <span className="text-sm font-medium">Impact Analysis</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <strong className={getImpactColor(impact.impact)}>
                New Risk Score: {impact.newRiskScore.toFixed(0)}
              </strong>
            </div>
            <p className="text-xs text-muted-foreground">{impact.description}</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};