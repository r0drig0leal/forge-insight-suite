import { motion } from "framer-motion";
import { MessageCircle, Database, FileText, MapPin, CloudLightning, Users, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TaxRecord, Demographics, ClimateRisk } from "@/lib/mockData";

interface AIConfidenceScoreProps {
  taxRecords: TaxRecord[];
  demographics: Demographics | null;
  climateRisk: ClimateRisk | null;
}

export const AIConfidenceScore = ({ taxRecords, demographics, climateRisk }: AIConfidenceScoreProps) => {
  // Calculate confidence based on data sources available
  const dataSources = [
    {
      name: "Tax Records",
      available: taxRecords.length > 0,
      icon: FileText,
      description: "Property tax assessment data",
      weight: 25
    },
    {
      name: "Census Data",  
      available: demographics !== null,
      icon: Users,
      description: "Demographic and population data",
      weight: 20
    },
    {
      name: "FEMA Climate",
      available: climateRisk !== null,
      icon: CloudLightning,
      description: "Flood zones and climate risk data",
      weight: 20
    },
    {
      name: "MLS Records",
      available: true, // Always available in our mock
      icon: Building,
      description: "Market and neighbor sales data", 
      weight: 20
    },
    {
      name: "Public Records",
      available: true, // Always available in our mock  
      icon: Database,
      description: "Property characteristics and history",
      weight: 15
    }
  ];

  const availableSources = dataSources.filter(source => source.available);
  const totalWeight = availableSources.reduce((sum, source) => sum + source.weight, 0);
  const maxWeight = dataSources.reduce((sum, source) => sum + source.weight, 0);
  
  const baseConfidence = (totalWeight / maxWeight) * 100;
  const confidenceScore = Math.min(95, Math.max(75, baseConfidence + Math.random() * 10)); // 75-95% range

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return "text-secondary";
    if (score >= 80) return "text-primary";
    return "text-orange-500";
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 90) return "Very High";
    if (score >= 80) return "High";
    return "Moderate";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            AI Analysis Confidence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Confidence Score */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center p-4 rounded-lg bg-gradient-to-br from-background via-background to-muted/20"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getConfidenceColor(confidenceScore)}`}>
                  <AnimatedCounter 
                    value={confidenceScore} 
                    duration={2}
                    delay={0.8}
                  />%
                </div>
                <p className="text-sm text-muted-foreground">Analysis Accuracy</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${getConfidenceColor(confidenceScore)} bg-current/10 border-current/20`}
            >
              {getConfidenceLabel(confidenceScore)} Confidence
            </Badge>
          </motion.div>

          {/* Confidence Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Data Completeness</span>
              <span className="font-medium">{Math.round(baseConfidence)}%</span>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="origin-left"
            >
              <Progress value={baseConfidence} className="h-2" />
            </motion.div>
          </motion.div>

          {/* Data Sources */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Data Sources</h4>
            <div className="grid grid-cols-1 gap-3">
              {dataSources.map((source, index) => {
                const Icon = source.icon;
                return (
                  <motion.div
                    key={source.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1, duration: 0.3 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      source.available 
                        ? "bg-secondary/10 border border-secondary/20" 
                        : "bg-muted/30 border border-border/50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${
                      source.available ? "text-secondary" : "text-muted-foreground"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{source.name}</span>
                        <Badge 
                          variant={source.available ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {source.available ? "Available" : "Limited"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {source.description}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      {source.weight}%
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Analysis Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-lg"
          >
            <p>
              Analysis confidence based on {availableSources.length} of {dataSources.length} primary data sources. 
              AI model continuously learns from market patterns and property characteristics for enhanced accuracy.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};