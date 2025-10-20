import { motion } from "framer-motion";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { MarketHistory } from "@/lib/mockData";

interface TrendSparklinesProps {
  marketHistory: MarketHistory | null;
}

export const TrendSparklines = ({ marketHistory }: TrendSparklinesProps) => {
  if (!marketHistory) return null;

  const { historical_values } = marketHistory;
  
  // Calculate trends
  const firstValue = historical_values[0];
  const lastValue = historical_values[historical_values.length - 1];
  
  const marketValueChange = ((lastValue.market_value - firstValue.market_value) / firstValue.market_value) * 100;
  const riskScoreChange = lastValue.risk_score - firstValue.risk_score;

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-secondary";
    if (change < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? "↗" : "↘";
  };

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Market Value Trend */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-primary" />
            Market Value Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">
                  {formatCurrency(lastValue.market_value)}
                </div>
                <div className={`text-sm flex items-center gap-1 ${getChangeColor(marketValueChange)}`}>
                  <span>{getChangeIcon(marketValueChange)}</span>
                  <span>{marketValueChange >= 0 ? '+' : ''}{marketValueChange.toFixed(1)}%</span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                12 months
              </Badge>
            </div>
            
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-16 origin-bottom"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historical_values}>
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Line 
                    type="monotone" 
                    dataKey="market_value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <div className="text-xs text-muted-foreground">
              <Calendar className="inline h-3 w-3 mr-1" />
              Last 12 months • {formatCurrency(firstValue.market_value)} → {formatCurrency(lastValue.market_value)}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Risk Score Trend */}
      <Card className="shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-accent" />
            Risk Score Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">
                  {lastValue.risk_score.toFixed(1)}
                </div>
                <div className={`text-sm flex items-center gap-1 ${getChangeColor(-riskScoreChange)}`}>
                  <span>{getChangeIcon(-riskScoreChange)}</span>
                  <span>{riskScoreChange === 0 ? 'Stable' : `${riskScoreChange > 0 ? '+' : ''}${riskScoreChange.toFixed(1)}`}</span>
                </div> 
              </div>
              <Badge variant="outline" className="text-xs">
                12 months
              </Badge>
            </div>
            
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="h-16 origin-bottom"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historical_values}>
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Line 
                    type="monotone" 
                    dataKey="risk_score" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3, fill: "hsl(var(--accent))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <div className="text-xs text-muted-foreground">
              <Calendar className="inline h-3 w-3 mr-1" />
              Last 12 months • {firstValue.risk_score.toFixed(1)} → {lastValue.risk_score.toFixed(1)}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};