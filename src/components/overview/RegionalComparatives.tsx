import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Award, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { PropertyAnalytics, PropertyData, Demographics } from "@/lib/mockData";

interface RegionalComparativesProps {
  analytics: PropertyAnalytics;
  property: PropertyData;
  demographics: Demographics | null;
}

export const RegionalComparatives = ({ analytics, property, demographics }: RegionalComparativesProps) => {
  const getMarketPositionText = (benchmark: number) => {
    const absBenchmark = Math.abs(benchmark);
    
    if (benchmark > 15) {
      return `Top 10% most expensive in the region`;
    } else if (benchmark > 5) {
      return `${benchmark.toFixed(1)}% above neighborhood median`;
    } else if (benchmark > 0) {
      return `Slightly above market average (+${benchmark.toFixed(1)}%)`;
    } else if (benchmark > -5) {
      return `Near market average (${benchmark.toFixed(1)}%)`;
    } else if (benchmark > -15) {
      return `${absBenchmark.toFixed(1)}% below neighborhood median`;
    } else {
      return `Top 10% most affordable in the region`;
    }
  };

  const getROIBenchmarkText = (roi: number) => {
    const avgROI = 6.2; // Market average
    const difference = roi - avgROI;
    
    if (difference > 2) {
      return `+${difference.toFixed(1)}% above neighborhood average`;
    } else if (difference > 0) {
      return `+${difference.toFixed(1)}% above market average`;
    } else if (difference > -1) {
      return `Close to market average (${difference.toFixed(1)}%)`;
    } else {
      return `${Math.abs(difference).toFixed(1)}% below market average`;
    }
  };

  const getPositionIcon = (benchmark: number) => {
    if (benchmark > 5) return TrendingUp;
    if (benchmark < -5) return TrendingDown;
    return Target;
  };

  const getPositionColor = (benchmark: number) => {
    if (benchmark > 5) return "text-destructive";
    if (benchmark < -5) return "text-secondary";
    return "text-primary";
  };

  const getROIIcon = (roi: number) => {
    if (roi > 6.2) return Award;
    if (roi < 5) return TrendingDown;
    return TrendingUp;
  };

  const getROIColor = (roi: number) => {
    if (roi > 6.2) return "text-secondary";
    if (roi < 5) return "text-orange-500";
    return "text-primary";
  };

  const MarketPositionIcon = getPositionIcon(analytics.neighborBenchmark);
  const ROIIcon = getROIIcon(analytics.potentialROI);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Market Position Analysis */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-5 w-5 text-primary" />
            Market Position
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <MarketPositionIcon className={`h-6 w-6 ${getPositionColor(analytics.neighborBenchmark)}`} />
              <div>
                <div className={`text-2xl font-bold ${getPositionColor(analytics.neighborBenchmark)}`}>
                  {analytics.neighborBenchmark > 0 ? '+' : ''}
                  <AnimatedCounter 
                    value={analytics.neighborBenchmark} 
                    duration={1.5}
                    delay={0.6}
                  />%
                </div>
                <p className="text-xs text-muted-foreground">vs. Neighborhood</p>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="p-3 rounded-lg bg-muted/30"
            >
              <p className="text-sm font-medium text-foreground">
                👉 {getMarketPositionText(analytics.neighborBenchmark)}
              </p>
            </motion.div>

            {demographics && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="text-xs text-muted-foreground"
              >
                <p>Median SFR Value: ${demographics.median_sfr_market_value.toLocaleString()}</p>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* ROI Benchmark */}  
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-secondary" />
            ROI Benchmark
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <ROIIcon className={`h-6 w-6 ${getROIColor(analytics.potentialROI)}`} />
              <div>
                <div className={`text-2xl font-bold ${getROIColor(analytics.potentialROI)}`}>
                  <AnimatedCounter 
                    value={analytics.potentialROI} 
                    duration={1.5}
                    delay={0.7}
                  />%
                </div>
                <p className="text-xs text-muted-foreground">Annual ROI</p>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="p-3 rounded-lg bg-muted/30"
            >
              <p className="text-sm font-medium text-foreground">
                📊 {getROIBenchmarkText(analytics.potentialROI)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-muted-foreground">Market Average:</span>
              <Badge variant="outline" className="text-xs">
                6.2% ROI
              </Badge>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};