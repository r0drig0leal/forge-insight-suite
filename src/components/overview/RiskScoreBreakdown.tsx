import { motion } from "framer-motion";
import { Shield, DollarSign, Users, CloudLightning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useEffect, useState } from "react";

export const RiskScoreBreakdown = ({ parcelId }: { parcelId: string }) => {
  const [scores, setScores] = useState({
    financial: null,
    social: null,
    climate: null,
  });

  useEffect(() => {
    const fetchScores = async () => {
      const [finRes, socRes, cliRes] = await Promise.all([
        fetch(`/api/financial_risk_score/${parcelId}`),
        fetch(`/api/social_risk_score/${parcelId}`),
        fetch(`/api/climate_risk_score/${parcelId}`)
      ]);
      setScores({
        financial: finRes.ok ? (await finRes.json())[0] : null,
        social: socRes.ok ? (await socRes.json())[0] : null,
        climate: cliRes.ok ? (await cliRes.json())[0] : null,
      });
    };
    fetchScores();
  }, [parcelId]);

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
    if (score < 30) return "Low risk";
    if (score < 60) return "Moderate risk";
    return "High risk";
  };

  const riskBreakdown = [
    scores.financial && {
      category: "Financial",
      score: scores.financial.financial_risk_score,
      icon: DollarSign,
      description: "Tax burden, exemptions, delinquency, and valuation stability",
      color: "primary"
    },
    scores.social && {
      category: "Social",
      score: scores.social.social_risk_score,
      icon: Users,
      description: "Income, crime, poverty, education, unemployment, density, diversity, community",
      color: "secondary"
    },
    scores.climate && {
      category: "Climate",
      score: scores.climate.climate_risk_score,
      icon: CloudLightning,
      description: "Flood, hurricane, fire, tornado, heat, hail, lightning risks",
      color: "accent"
    }
  ].filter(Boolean);

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
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Risk Components</h4>
            {riskBreakdown.length === 0 ? (
              <div className="text-muted-foreground text-sm">No scores available.</div>
            ) : (
              riskBreakdown.map((risk, index) => {
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
              })
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};