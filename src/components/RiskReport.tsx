import { AlertTriangle, DollarSign, Users, FileText, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PropertyData, TaxRecord, TaxHistoryIssue, Demographics, PropertyAnalytics } from "@/lib/mockData";
import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";

interface RiskReportProps {
  property: PropertyData;
  taxRecords: TaxRecord[];
  taxIssues: TaxHistoryIssue[];
  demographics: Demographics | null;
  analytics: PropertyAnalytics;
}

export const RiskReport = ({ property, taxRecords, taxIssues, demographics, analytics }: RiskReportProps) => {
  const currentTax = taxRecords[0];
  const currentIssue = taxIssues[0];

  const getRiskColor = (score: number) => {
    if (score < 30) return "risk-low";
    if (score < 60) return "risk-medium"; 
    return "risk-high";
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return "Low Risk";
    if (score < 60) return "Moderate Risk";
    return "High Risk";
  };

  const riskFactors = [
    {
      title: "Financial Risk",
      score: analytics.financialRiskScore,
      icon: DollarSign,
      description: "Tax burden and financial obligations",
      details: [
        `Property taxes: ${currentTax ? '$' + (currentTax.assessed_value * 0.012).toLocaleString() : 'N/A'}`,
        `Homestead exemption: ${currentTax?.is_homestead ? 'Yes' : 'No'}`,
        `Tax savings: ${currentTax ? '$' + currentTax.tax_savings.toLocaleString() : 'N/A'}`,
      ]
    },
    {
      title: "Social Risk", 
      score: analytics.socialRiskScore,
      icon: Users,
      description: "Community stability and demographics",
      details: [
        `Diversity index: ${demographics?.diversity_index.toFixed(2) || 'N/A'}`,
        `Population: ${demographics?.total_population.toLocaleString() || 'N/A'}`,
        `Households: ${demographics?.total_households.toLocaleString() || 'N/A'}`,
      ]
    },
    {
      title: "Market Risk",
      score: currentIssue?.risk_score || 0,
      icon: AlertTriangle,
      description: "Market volatility and trends",
      details: [
        `Market value: $${property.current_market_value.toLocaleString()}`,
        `Assessed value: $${property.assessed_value.toLocaleString()}`,
        `Assessment ratio: ${((property.assessed_value / property.current_market_value) * 100).toFixed(1)}%`,
      ]
    }
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Risk Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="shadow-medium animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Risk Assessment Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Risk Score */}
            <div className="space-y-4">
              <motion.div 
                className="text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <AnimatedCounter
                  value={analytics.overallRiskScore}
                  duration={2.5}
                  delay={0.8}
                  className="text-6xl font-bold mb-2"
                  style={{ color: `hsl(var(--${getRiskColor(analytics.overallRiskScore)}))` }}
                />
                <Badge variant="outline" className={`bg-${getRiskColor(analytics.overallRiskScore)}/10 text-${getRiskColor(analytics.overallRiskScore)} border-${getRiskColor(analytics.overallRiskScore)}/20`}>
                  {getRiskLabel(analytics.overallRiskScore)}
                </Badge>
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, delay: 0.7 }}
              >
                <Progress 
                  value={analytics.overallRiskScore} 
                  className="h-2"
                />
              </motion.div>
            </div>

            {/* Risk Breakdown */}
            <div className="space-y-3">
              <h4 className="font-semibold">Risk Components</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Financial Risk</span>
                    <motion.span 
                      className="font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <AnimatedCounter 
                        value={analytics.financialRiskScore} 
                        duration={1.5}
                        delay={1.0}
                      />%
                    </motion.span>
                  </div>
                <Progress value={analytics.financialRiskScore} className="h-1" />
              </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Social Risk</span>
                    <motion.span 
                      className="font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 }}
                    >
                      <AnimatedCounter 
                        value={analytics.socialRiskScore} 
                        duration={1.5}
                        delay={1.2}
                      />%
                    </motion.span>
                  </div>
                <Progress value={analytics.socialRiskScore} className="h-1" />
              </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Risk</span>
                    <motion.span 
                      className="font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      <AnimatedCounter 
                        value={currentIssue?.risk_score || 0} 
                        duration={1.5}
                        delay={1.4}
                      />%
                    </motion.span>
                  </div>
                <Progress value={currentIssue?.risk_score || 0} className="h-1" />
              </div>
            </div>
          </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Risk Factors */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {riskFactors.map((factor, index) => {
          const IconComponent = factor.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.6 + (index * 0.1),
                type: "spring",
                stiffness: 100 
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="shadow-soft animate-fade-in hover-scale transition-smooth h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconComponent className="h-5 w-5" style={{ color: `hsl(var(--${getRiskColor(factor.score)}))` }} />
                  {factor.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{factor.description}</p>
              </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div 
                    className="text-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                  >
                    <AnimatedCounter
                      value={factor.score}
                      duration={1.8}
                      delay={1.0 + (index * 0.15)}
                      className="text-3xl font-bold mb-2"
                      style={{ color: `hsl(var(--${getRiskColor(factor.score)}))` }}
                    />
                  <Badge variant="outline" className={`bg-${getRiskColor(factor.score)}/10 text-${getRiskColor(factor.score)} border-${getRiskColor(factor.score)}/20`}>
                    {getRiskLabel(factor.score)}
                  </Badge>
                  </motion.div>
                
                <div className="space-y-2">
                  {factor.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      {detail}
                    </div>
                  ))}
                </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Risk Timeline & History */}
      {currentIssue && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Risk History & Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {currentIssue.tax_year}
                </div>
                <p className="text-sm text-muted-foreground">Latest Tax Year</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  ${currentIssue.potential_rent_income.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Potential Annual Rent</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  ${currentIssue.estimated_renovation_cost.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Est. Renovation Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}

      {/* Risk Mitigation Strategies */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-secondary" />
            Risk Mitigation Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.actionableRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-secondary">{index + 1}</span>
                </div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
};