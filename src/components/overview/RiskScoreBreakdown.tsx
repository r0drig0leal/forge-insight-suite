import { motion } from "framer-motion";
import { Shield, DollarSign, Users, CloudLightning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { API_BASE_URL } from "@/lib/apiConfig";
import { useEffect, useState } from "react";

export const RiskScoreBreakdown = ({ parcelId }: { parcelId: string }) => {
  type TotalRiskScore = {
    parcel_id: string;
    social_risk_score: number;
    social_category: string;
    climate_risk_score: number;
    climate_category: string;
    financial_risk_score: number;
    financial_category: string;
    total_risk_score: number;
    risk_score: number;
    overall_category: string;
  } | null;

  const [totalScore, setTotalScore] = useState<TotalRiskScore>(null);
  const [scores, setScores] = useState({
    financial: null,
    social: null,
    climate: null,
  });

  useEffect(() => {
    const fetchTotalScore = async () => {
  const res = await fetch(`${API_BASE_URL}/api/total_risk_score/${parcelId}`);
      setTotalScore(res.ok ? (await res.json())[0] : null);
    };
    fetchTotalScore();

    // Detalhes continuam sendo buscados para breakdowns detalhados
    const fetchScores = async () => {
      const [finRes, socRes, cliRes] = await Promise.all([
  fetch(`${API_BASE_URL}/api/financial_risk_score/${parcelId}`),
  fetch(`${API_BASE_URL}/api/social_risk_score/${parcelId}`),
  fetch(`${API_BASE_URL}/api/climate_risk_score/${parcelId}`)
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

  // Helper to parse score as number (handles string or number)
  const parseScore = (val: unknown) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.trim() !== '' && !isNaN(Number(val))) return Number(val);
    return 0.0;
  };

  const riskBreakdown = [
    {
      category: "Financial",
      score: totalScore ? parseScore(totalScore.financial_risk_score) : 0.0,
      label: totalScore ? totalScore.financial_category : '',
      icon: DollarSign,
      description: "Tax burden, exemptions, delinquency, and valuation stability",
      color: "primary"
    },
    {
      category: "Social",
      score: totalScore ? parseScore(totalScore.social_risk_score) : 0.0,
      label: totalScore ? totalScore.social_category : '',
      icon: Users,
      description: "Income, crime, poverty, education, unemployment, density, diversity, community",
      color: "secondary"
    },
    {
      category: "Climate",
      score: totalScore ? parseScore(totalScore.climate_risk_score) : 0.0,
      label: totalScore ? totalScore.climate_category : '',
      icon: CloudLightning,
      description: "Flood, hurricane, fire, tornado, heat, hail, lightning risks",
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
            <span className="text-muted-foreground">Risk Score Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Risk Score from total_risk_score endpoint */}
          {totalScore ? (
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-background via-background to-muted/20">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className={`text-4xl font-bold ${getRiskColor(totalScore.total_risk_score)}`}>
                  <AnimatedCounter 
                    value={totalScore.total_risk_score}
                    duration={1.5}
                    delay={0.5}
                    decimals={1}
                  />%
                </span>
                <Badge variant="outline" className={`ml-2 ${getRiskBgColor(totalScore.total_risk_score)} ${getRiskColor(totalScore.total_risk_score)} border-current/20`}>
                  {totalScore.overall_category}
                </Badge>
              </div>
              <div className="text-muted-foreground text-sm">Overall Risk Score</div>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">No overall score available.</div>
          )}
          {/* Risk Component Breakdown (details) */}
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
                            value={typeof risk.score === 'number' && !isNaN(risk.score) ? risk.score : 0} 
                            duration={1.5}
                            delay={0.7 + index * 0.1}
                            decimals={1}
                          />%
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getRiskBgColor(risk.score)} ${getRiskColor(risk.score)} border-current/20`}
                        >
                          {risk.label}
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