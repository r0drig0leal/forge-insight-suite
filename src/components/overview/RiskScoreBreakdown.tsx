import { motion } from "framer-motion";
import { Shield, AlertTriangle, CloudLightning, DollarSign, Users, ThermometerSun, Flame, Droplet, Percent, Home, TrendingUp, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { PropertyAnalytics, ClimateRisk, TaxRecord, Demographics } from "@/lib/mockData";

interface RiskScoreBreakdownProps {
  analytics: PropertyAnalytics;
  climateRisk: ClimateRisk | null;
  taxRecords: TaxRecord[];
  demographics: Demographics | null;
}

export const RiskScoreBreakdown = ({ analytics, climateRisk, taxRecords, demographics }: RiskScoreBreakdownProps) => {
  const getRiskColor = (score: number) => {
    if (score < 30) return "text-secondary";
    if (score < 60) return "text-primary";
    return "text-destructive";
  };

  const getRiskBgColor = (score: number) => {
    if (score < 30) return "bg-secondary/10";
    if (score < 60) return "bg-primary/10";
    return "bg-destructive/10";
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return "Low Risk";
    if (score < 60) return "Moderate Risk";
    return "High Risk";
  };

  const riskBreakdown = [
    {
      category: "Financial",
      score: analytics.financialRiskScore,
      icon: DollarSign,
  description: "Tax Burden, Exemptions, Delinquency, and Valuation Stability",
      color: "primary"
    },
    {
      category: "Social",
      score: analytics.socialRiskScore,
      icon: Users,
      description: "Diversity index, population density",
      color: "secondary"
    },
    {
      category: "Climate",
      score: analytics.climateRiskScore,
      icon: CloudLightning,
      description: "Flood, fire, storm, and heat risks",
      color: "accent"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Risk Score Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Risk Score */}
          <motion.div 
            className="text-center p-6 rounded-lg bg-gradient-to-br from-background via-background to-muted/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <AlertTriangle className={`h-8 w-8 ${getRiskColor(analytics.overallRiskScore)}`} />
              <div className="text-center">
                <div className={`text-4xl font-bold ${getRiskColor(analytics.overallRiskScore)}`}>
                  <AnimatedCounter 
                    value={analytics.overallRiskScore} 
                    duration={2}
                    delay={0.5}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Overall Risk Score</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${getRiskBgColor(analytics.overallRiskScore)} ${getRiskColor(analytics.overallRiskScore)} border-current/20`}
            >
              {getRiskLabel(analytics.overallRiskScore)}
            </Badge>
          </motion.div>

          {/* Risk Component Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Risk Components</h4>
            {riskBreakdown.map((risk, index) => {
              const Icon = risk.icon;
              return (
                <motion.div
                  key={risk.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 text-${risk.color}`} />
                      <span className="font-medium">{risk.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getRiskColor(risk.score)}`}>
                        <AnimatedCounter 
                          value={risk.score} 
                          duration={1.5}
                          delay={0.7 + index * 0.1}
                        />
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getRiskBgColor(risk.score)} ${getRiskColor(risk.score)} border-current/20`}
                      >
                        {getRiskLabel(risk.score)}
                      </Badge>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                    className="origin-left"
                  >
                    <Progress 
                      value={risk.score} 
                      className="h-2"
                    />
                  </motion.div>
                  <p className="text-xs text-muted-foreground">{risk.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Climate Risk Details */}
          {climateRisk && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-6 p-4 rounded-lg bg-muted/30"
            >
              <h5 className="font-medium mb-4 flex items-center gap-2">
                <ThermometerSun className="h-4 w-4 text-accent" />
                Climate Risk Details
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Flood Risk */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-accent" />
                      <span className="text-sm text-muted-foreground">Flood Risk</span>
                    </div>
                    <span className={`font-semibold ${getRiskColor(climateRisk.flood_risk)} whitespace-nowrap`}>
                      <AnimatedCounter value={climateRisk.flood_risk} duration={1} delay={1.3} />%
                    </span>
                  </div>
                  <Progress value={climateRisk.flood_risk} className="h-2 mt-2" />
                </div>

                {/* Fire Risk */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-muted-foreground">Fire Risk</span>
                    </div>
                    <span className={`font-semibold ${getRiskColor(climateRisk.fire_risk)} whitespace-nowrap`}>
                      <AnimatedCounter value={climateRisk.fire_risk} duration={1} delay={1.4} />%
                    </span>
                  </div>
                  <Progress value={climateRisk.fire_risk} className="h-2 mt-2" />
                </div>

                {/* Storm Risk */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CloudLightning className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Storm Risk</span>
                    </div>
                    <span className={`font-semibold ${getRiskColor(climateRisk.storm_risk)} whitespace-nowrap`}>
                      <AnimatedCounter value={climateRisk.storm_risk} duration={1} delay={1.5} />%
                    </span>
                  </div>
                  <Progress value={climateRisk.storm_risk} className="h-2 mt-2" />
                </div>

                {/* Heat Risk */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ThermometerSun className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-muted-foreground">Heat Risk</span>
                    </div>
                    <span className={`font-semibold ${getRiskColor(climateRisk.heat_risk)} whitespace-nowrap`}>
                      <AnimatedCounter value={climateRisk.heat_risk} duration={1} delay={1.6} />%
                    </span>
                  </div>
                  <Progress value={climateRisk.heat_risk} className="h-2 mt-2" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Financial Risk Details */}
          {taxRecords && taxRecords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="mt-6 p-4 rounded-lg bg-muted/30"
            >
              <h5 className="font-medium mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Financial Risk Details
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tax Rate */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Tax Rate</span>
                    </div>
                    <span className={`font-semibold ${getRiskColor((taxRecords[0].assessed_value * 0.012 / taxRecords[0].assessed_value) * 1000)} whitespace-nowrap`}>
                      <AnimatedCounter value={Math.round((taxRecords[0].assessed_value * 0.012 / taxRecords[0].assessed_value) * 1000) / 10} duration={1} delay={1.1} />%
                    </span>
                  </div>
                  <Progress value={(taxRecords[0].assessed_value * 0.012 / taxRecords[0].assessed_value) * 1000} className="h-2 mt-2" />
                </div>

                {/* Homestead Status */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-muted-foreground">Homestead</span>
                    </div>
                    <span className={`font-semibold ${taxRecords[0].is_homestead ? 'text-secondary' : 'text-destructive'} whitespace-nowrap`}>
                      {taxRecords[0].is_homestead ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <Progress value={taxRecords[0].is_homestead ? 25 : 75} className="h-2 mt-2" />
                </div>

                {/* Assessment Value */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="text-sm text-muted-foreground">Assessment</span>
                    </div>
                    <span className={`font-semibold ${getRiskColor(Math.min(100, (taxRecords[0].assessed_value / 10000)))} whitespace-nowrap`}>
                      ${(taxRecords[0].assessed_value / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <Progress value={Math.min(100, (taxRecords[0].assessed_value / 10000))} className="h-2 mt-2" />
                </div>

                {/* Tax Savings */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-muted-foreground">Tax Savings</span>
                    </div>
                    <span className={`font-semibold ${getRiskColor(100 - (taxRecords[0].tax_savings || 0) * 10)} whitespace-nowrap`}>
                      ${taxRecords[0].tax_savings || 0}
                    </span>
                  </div>
                  <Progress value={Math.min(100, (taxRecords[0].tax_savings || 0) * 2)} className="h-2 mt-2" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Social Risk Details */}
          {demographics && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="mt-6 p-4 rounded-lg bg-muted/30"
            >
              <h5 className="font-medium mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                Social Risk Details
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Diversity Index */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-muted-foreground">Diversity</span>
                    </div>
                    <span className={`font-semibold ${getRiskColor((1 - demographics.diversity_index) * 100)} whitespace-nowrap`}>
                      <AnimatedCounter value={Math.round(demographics.diversity_index * 100)} duration={1} delay={1.2} />%
                    </span>
                  </div>
                  <Progress value={demographics.diversity_index * 100} className="h-2 mt-2" />
                </div>

                {/* Population Density */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="text-sm text-muted-foreground">Density</span>
                    </div>
                    <span className={`font-semibold ${getRiskColor(Math.min(100, demographics.population_density / 50))} whitespace-nowrap`}>
                      <AnimatedCounter value={Math.round(demographics.population_density)} duration={1} delay={1.3} />/sq mi
                    </span>
                  </div>
                  <Progress value={Math.min(100, demographics.population_density / 50)} className="h-2 mt-2" />
                </div>

                {/* Total Population */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Population</span>
                    </div>
                    <span className={`font-semibold ${getRiskColor(Math.min(100, demographics.total_population / 200))} whitespace-nowrap`}>
                      <AnimatedCounter value={demographics.total_population} duration={1} delay={1.4} />
                    </span>
                  </div>
                  <Progress value={Math.min(100, demographics.total_population / 200)} className="h-2 mt-2" />
                </div>

                {/* SFR Homes */}
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-secondary" />
                      <span className="text-sm text-muted-foreground">SFR Homes</span>
                    </div>
                    <span className={`font-semibold ${getRiskColor(100 - Math.min(100, (demographics.sfr_home_count / demographics.total_households) * 100))} whitespace-nowrap`}>
                      <AnimatedCounter value={demographics.sfr_home_count} duration={1} delay={1.5} />
                    </span>
                  </div>
                  <Progress value={(demographics.sfr_home_count / demographics.total_households) * 100} className="h-2 mt-2" />
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};