import { AlertTriangle, DollarSign, Users, FileText, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PropertyData, TaxRecord, TaxHistoryIssue, Demographics, PropertyAnalytics } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import { API_BASE_URL } from "@/lib/apiConfig";

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

  // Novo: buscar os scores reais do backend
  const [riskScores, setRiskScores] = useState<null | {
    total_risk_score: number;
    overall_category: string;
    financial_risk_score: number;
    financial_category: string;
    social_risk_score: number;
    social_category: string;
    climate_risk_score: number;
    climate_category: string;
    // Campos extras do financial_risk_score
    total_annual_taxes?: number | string;
    is_homestead?: boolean | string;
    tax_savings?: number | string;
    total_delinquent_balance?: number | string;
    risk_category?: string;
  }>(null);

  useEffect(() => {
    const fetchScores = async () => {
      const res = await fetch(`${API_BASE_URL}/api/total_risk_score/${property.parcel_id}`,
        {
          headers: {
            'x-api-key': '7f2e1c9a-auctions-2025',
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setRiskScores(data[0]);
      }
    };
    fetchScores();
  }, [property.parcel_id]);

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

  // Os fatores agora são os mesmos do backend, removendo qualquer string 'overprice' deste card
  const riskFactors = [
    {
      title: "Financial Risk",
      score: riskScores?.financial_risk_score !== undefined ? parseFloat(String(riskScores.financial_risk_score)) : 0,
      icon: DollarSign,
      description: "Tax burden and financial obligations",
      details: [] // Details only in the detailed card below
    },
    {
      title: "Social Risk", 
      score: riskScores?.social_risk_score !== undefined ? parseFloat(String(riskScores.social_risk_score)) : 0,
      icon: Users,
      description: "Community stability and demographics",
      details: [
        `Diversity index: ${demographics?.diversity_index?.toFixed(2) || 'N/A'}`,
        `Population: ${demographics?.total_population?.toLocaleString() || 'N/A'}`,
        `Households: ${demographics?.total_households?.toLocaleString() || 'N/A'}`,
      ]
    },
    {
      title: "Climate Risk",
      score: riskScores?.climate_risk_score ?? 0,
      icon: AlertTriangle,
      description: "Climate and environmental risks",
      details: [
        `Market value: $${property.current_market_value?.toLocaleString()}`,
        `Assessed value: $${property.assessed_value?.toLocaleString()}`,
        `Assessment ratio: ${property.current_market_value && property.assessed_value ? ((property.assessed_value / property.current_market_value) * 100).toFixed(1) : 'N/A'}%`,
      ].filter(detail => typeof detail === 'string' && !detail.toLowerCase().includes('overprice'))
    }
  ];


  const [selectedRisk, setSelectedRisk] = useState<null | 'financial' | 'social' | 'climate'>(null);

  // Helper to get the selected risk's score and label
  const getSelectedRiskData = () => {
    if (!riskScores) return { score: 0, label: '', color: 'risk-low' };
    if (selectedRisk === 'financial') return {
      score: parseFloat(String(riskScores.financial_risk_score)),
      label: getRiskLabel(parseFloat(String(riskScores.financial_risk_score))),
      color: getRiskColor(parseFloat(String(riskScores.financial_risk_score)))
    };
    if (selectedRisk === 'social') return {
      score: parseFloat(String(riskScores.social_risk_score)),
      label: getRiskLabel(parseFloat(String(riskScores.social_risk_score))),
      color: getRiskColor(parseFloat(String(riskScores.social_risk_score)))
    };
    if (selectedRisk === 'climate') return {
      score: riskScores.climate_risk_score,
      label: getRiskLabel(riskScores.climate_risk_score),
      color: getRiskColor(riskScores.climate_risk_score)
    };
    return { score: 0, label: '', color: 'risk-low' };
  };

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
            <span className="text-muted-foreground">Risk Assessment Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-start gap-6 w-full">
            {/* Overview or Selected Risk Score */}
            <div className="space-y-4 flex-1 min-w-0">
              <motion.div 
                className="text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {selectedRisk === null ? (
                  <>
                    <span className="text-6xl font-bold mb-2" style={{ color: `hsl(var(--${getRiskColor(riskScores?.total_risk_score ?? 0)}))` }}>
                      <AnimatedCounter
                        value={riskScores?.total_risk_score ?? 0}
                        duration={2.5}
                        delay={0.8}
                        suffix="%"
                      />
                    </span>
                    <Badge variant="outline" className={`bg-${getRiskColor(riskScores?.total_risk_score ?? 0)}/10 text-${getRiskColor(riskScores?.total_risk_score ?? 0)} border-${getRiskColor(riskScores?.total_risk_score ?? 0)}/20`}>
                      {getRiskLabel(riskScores?.total_risk_score ?? 0)}
                    </Badge>
                  </>
                ) : (
                  <>
                    <span className="text-6xl font-bold mb-2" style={{ color: `hsl(var(--${getSelectedRiskData().color}))` }}>
                      <AnimatedCounter
                        value={getSelectedRiskData().score}
                        duration={2.5}
                        delay={0.8}
                        suffix="%"
                      />
                    </span>
                    <Badge variant="outline" className={`bg-${getSelectedRiskData().color}/10 text-${getSelectedRiskData().color} border-${getSelectedRiskData().color}/20`}>
                      {getSelectedRiskData().label}
                    </Badge>
                    <div className="mt-4">
                      <button className="text-xs underline text-muted-foreground" onClick={() => setSelectedRisk(null)}>
                        Show overall risk
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, delay: 0.7 }}
              >
                <Progress 
                  value={selectedRisk === null ? (riskScores?.total_risk_score ?? 0) : getSelectedRiskData().score} 
                  className="h-2"
                />
              </motion.div>
            </div>

            {/* Risk Breakdown or Selected Risk Indices */}
              <div className="space-y-3 flex-1 min-w-0">
                  <div>
                    <h4 className="font-semibold text-muted-foreground capitalize m-0">{selectedRisk} risk indices</h4>
                    <div>
                      {selectedRisk === 'financial' && (
                        <div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Total annual property taxes: $8,043.06</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Market value: $495,710.00</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Assessed value: $438,552.00</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Homestead exemption: No</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Tax savings: $554.00</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Delinquent balance: $0</div>
                        </div>
                      )}
                      {selectedRisk === 'social' && (
                        <div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Income risk: 50%</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Crime risk: 17.5%</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Poverty risk: 1.01%</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Inequality risk: 45%</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Education risk: 65%</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Unemployment risk: 0.27%</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />School quality risk: 20%</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Population density risk: 12.89%</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Diversity index: 33%</div>
                        </div>
                      )}
                      {selectedRisk === 'climate' && (
                        <div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Flood risk: Low (Minimal hazard)</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Hurricane risk: High (High impact in FL coastal areas)</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Fire risk: High (Medium risk in dry areas)</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Tornado risk: High (Low in FL but possible)</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Heat risk: Low</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Hail risk: High</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Lightning risk: High</div>
                        </div>
                      )}
                    </div>
                  </div>
                    <Progress value={riskScores?.climate_risk_score ?? 0} className="h-1" />
                  </div>
              ) : (
                <div>
                  <h4 className="font-semibold text-muted-foreground capitalize m-0">{selectedRisk} risk indices</h4>
                  {selectedRisk === 'financial' && (
                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Total annual property taxes: $8,043.06</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Market value: $495,710.00</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Assessed value: $438,552.00</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Homestead exemption: No</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Tax savings: $554.00</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Delinquent balance: $0</div>
                    </div>
                  )}
                  {selectedRisk === 'social' && (
                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Income risk: 50%</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Crime risk: 17.5%</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Poverty risk: 1.01%</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Inequality risk: 45%</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Education risk: 65%</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Unemployment risk: 0.27%</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />School quality risk: 20%</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Population density risk: 12.89%</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Diversity index: 33%</div>
                    </div>
                  )}
                  {selectedRisk === 'climate' && (
                    <div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Flood risk: Low (Minimal hazard)</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Hurricane risk: High (High impact in FL coastal areas)</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Fire risk: High (Medium risk in dry areas)</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Tornado risk: High (Low in FL but possible)</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Heat risk: Low</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Hail risk: High</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-muted-foreground" />Lightning risk: High</div>
                    </div>
                  )}

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
              <Card
                className={`shadow-soft animate-fade-in hover-scale transition-smooth h-full cursor-pointer ${selectedRisk === (index === 0 ? 'financial' : index === 1 ? 'social' : 'climate') ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedRisk(index === 0 ? 'financial' : index === 1 ? 'social' : 'climate')}
                tabIndex={0}
                aria-pressed={selectedRisk === (index === 0 ? 'financial' : index === 1 ? 'social' : 'climate')}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconComponent className="h-5 w-5" style={{ color: `hsl(var(--${getRiskColor(factor.score)}))` }} />
                    <span className="text-muted-foreground">{factor.title}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div 
                    className="flex flex-col items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                  >
                    <span className="text-3xl font-bold mb-1" style={{ color: `hsl(var(--${getRiskColor(factor.score)}))` }}>
                      {typeof factor.score === 'number' && !isNaN(factor.score) ? `${factor.score}%` : '0%'}
                    </span>
                    <Badge variant="outline" className={`mt-1 bg-${getRiskColor(factor.score)}/10 text-${getRiskColor(factor.score)} border-${getRiskColor(factor.score)}/20`}>
                      {getRiskLabel(factor.score)}
                    </Badge>
                  </motion.div>
                
                {/* Detalhes do Financial Risk: mostrar apenas se for o card Financial Risk (index === 0) */}
                {index === 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      {`Total annual property taxes: $8,043.06`}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      {`Market value: $495,710.00`}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      {`Assessed value: $438,552.00`}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      {`Homestead exemption: No`}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      {`Tax savings: $554.00`}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      {`Delinquent balance: $0`}
                    </div>
                  </div>
                )}
                {/* Detalhes do Social Risk: mostrar apenas se for o card Social Risk (index === 1) */}
                {index === 1 && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Income risk: 50%
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Crime risk: 17.5%
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Poverty risk: 1.01%
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Inequality risk: 45%
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Education risk: 65%
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Unemployment risk: 0.27%
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      School quality risk: 20%
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Population density risk: 12.89%
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Diversity index: 33%
                    </div>
                  </div>
                )}
                {/* Detalhes do Climate Risk: mostrar apenas se for o card Climate Risk (index === 2) */}
                {index === 2 && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Flood risk: Low (Minimal hazard)
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Hurricane risk: High (High impact in FL coastal areas)
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Fire risk: High (Medium risk in dry areas)
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Tornado risk: High (Low in FL but possible)
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Heat risk: Low
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Hail risk: High
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      Lightning risk: High
                    </div>
                  </div>
                )}
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