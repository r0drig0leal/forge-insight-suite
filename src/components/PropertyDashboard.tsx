import { useState, useEffect } from "react";

interface Property {
  // Adapte conforme necessário
  property_address?: string;
  property_city?: string;
  property_state?: string;
  property_zip?: string;
  current_market_value?: number;
}

interface NeighborSale {
  // Adapte conforme necessário
  neighbor_id?: string | number;
  property_address?: string;
  sale_date?: string;
  sale_price?: number;
}
import { ArrowLeft, Download, MessageCircle, Home, AlertTriangle, TrendingUp, DollarSign, FileText, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RiskReport } from "./RiskReport";
import { InvestmentReport } from "./InvestmentReport";
import { CompleteReport } from "./CompleteReport";
import { LoadingSpinner } from "./LoadingSpinner";
import { AIStoryEngine } from "./interactive/AIStoryEngine";
import { AnimatedMetric } from "./interactive/AnimatedMetrics";
import { GamificationBadge } from "./interactive/GamificationBadge";
import { RiskScoreBreakdown } from "./overview/RiskScoreBreakdown";
import { RegionalComparatives } from "./overview/RegionalComparatives";
import { TrendSparklines } from "./overview/TrendSparklines";
import { AIConfidenceScore } from "./overview/AIConfidenceScore";
import { GamificationProgress } from "./overview/GamificationProgress";


// Componente principal

import type { CompletePropertyData } from "@/lib/api";

interface PropertyDashboardProps {
  parcelId: string;
  onBack: () => void;
  propertyData: CompletePropertyData;
}


export const PropertyDashboard = ({ parcelId, propertyData, onBack }: PropertyDashboardProps) => {
  // Estado para o total risk score
  const [totalRiskScore, setTotalRiskScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalScore = async () => {
      try {
        const res = await fetch(`/api/total_risk_score/${parcelId}`);
        if (res.ok) {
          const data = await res.json();
          setTotalRiskScore(data[0]?.total_risk_score ?? null);
        } else {
          setTotalRiskScore(null);
        }
      } catch {
        setTotalRiskScore(null);
      }
      //#teste

    };
    fetchTotalScore();
  }, [parcelId]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract all data from propertyData
  const { property } = propertyData;
  const { taxRecords, taxHistoryIssues, neighborSales, demographics, buildings, analytics } = propertyData;
  const building = buildings && buildings.length > 0 ? buildings[0] : null;

  // Corrigir property.heated_area, beds e baths usando o primeiro building se necessário
  if (buildings && buildings.length > 0) {
    const b = buildings[0];
    if ((!property.heated_area || property.heated_area === 0) && b.living_area && b.living_area > 0) property.heated_area = b.living_area;
    if ((!property.beds || property.beds === 0) && b.beds && b.beds > 0) property.beds = b.beds;
    if ((!property.baths || property.baths === 0) && b.baths && b.baths > 0) property.baths = b.baths;
  }
  // Debug: logar dados usados no cálculo do market value
  if (typeof window !== 'undefined') {
    console.log('[DEBUG] property:', property);
    console.log('[DEBUG] property.heated_area:', property && property.heated_area);
    console.log('[DEBUG] property.beds:', property && property.beds);
    console.log('[DEBUG] property.baths:', property && property.baths);
    console.log('[DEBUG] neighborSales:', neighborSales);
  }

  // Novo: buscar valuation do backend
  const [valuation, setValuation] = useState(null);
  const [valuationError, setValuationError] = useState(null);
  useEffect(() => {
    const fetchValuation = async () => {
      try {
        const res = await fetch(`/api/property_valuation/${property.parcel_id}`);
        if (res.status === 200) {
          const data = await res.json();
          if (typeof window !== 'undefined') {
            console.log('[VAL_DEBUG] GET /api/property_valuation:', data);
          }
          setValuation(data);
        } else if (res.status === 404) {
          if (typeof window !== 'undefined') {
            console.log('[VAL_DEBUG] GET /api/property_valuation: 404 - Valuation not found');
          }
          setValuation(null);
          setValuationError('Valuation not found');
        } else {
          const err = await res.json();
          if (typeof window !== 'undefined') {
            console.log('[VAL_DEBUG] GET /api/property_valuation: error', err);
          }
          setValuation(null);
          setValuationError(err.error || 'Unknown error');
        }
      } catch (e) {
        if (typeof window !== 'undefined') {
          console.log('[VAL_DEBUG] GET /api/property_valuation: exception', e);
        }
        setValuation(null);
        setValuationError('Erro ao buscar valuation');
      }
    };
    fetchValuation();
  }, [property.parcel_id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !property || !analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "Unable to load property data"}
          </p>
          <Button onClick={onBack} className="w-full">
            Try Another Property
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden xs:inline">Back</span>
              </Button>
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                <Home className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h1 className="font-semibold text-sm md:text-lg truncate">{property.property_address}</h1>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                    {property.property_city}, {property.property_state} {property.property_zip}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="px-2 md:px-3">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline ml-2">AI Chat</span>
              </Button>
              <Button size="sm" className="hero-gradient px-2 md:px-3">
                <Download className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Export</span>
              </Button>
              <Button variant="ghost" size="sm" className="px-2 md:px-3">
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-fit lg:grid-cols-4 h-auto p-1">
            <TabsTrigger value="overview" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
              <Home className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Overview</span>
              <span className="xs:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
              <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Risk Analysis</span>
              <span className="xs:hidden">Risk</span>
            </TabsTrigger>
            <TabsTrigger value="investment" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Investment Report</span>
              <span className="xs:hidden">ROI</span>
            </TabsTrigger>
            <TabsTrigger value="complete" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3">
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden xs:inline">Complete Report</span>
              <span className="xs:hidden">Full</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics - Now Animated */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatedMetric
                title="Market Value"
                value={valuation?.range_low ?? 0}
                format="currency"
                icon={DollarSign}
                colorScheme="primary"
                animationDelay={0.1}
              />
              {/* Removido Range da tela conforme solicitado */}
              {valuationError && (
                <div className="text-xs text-red-500 mt-1">{valuationError}</div>
              )}
              <AnimatedMetric
                title="Risk Score"
                value={totalRiskScore !== null ? totalRiskScore : analytics.overallRiskScore}
                format="number"
                icon={AlertTriangle}
                colorScheme="accent"
                animationDelay={0.2}
              />
              <AnimatedMetric
                title="ROI Potential"
                value={analytics.potentialROI}
                format="percentage"
                icon={TrendingUp}
                colorScheme="secondary"
                animationDelay={0.3}
              />
              <AnimatedMetric
                title="Market Position"
                value={analytics.neighborBenchmark}
                format="percentage"
                icon={Home}
                colorScheme="primary"
                animationDelay={0.4}
              />
            </motion.div>

            {/* Risk Score Breakdown */}
            <RiskScoreBreakdown 
              parcelId={parcelId}
            />


            {/* Regional Comparatives */}
            <RegionalComparatives 
              analytics={analytics}
              property={property}
              demographics={demographics}
            />

            {/* Temporal Trends */}
            <TrendSparklines 
              marketHistory={undefined}
            />


            {/* AI Story Engine */}
            <AIStoryEngine
              property={property}
              demographics={demographics}
              analytics={analytics}
              taxRecords={taxRecords}
            />

            {/* AI Confidence Score */}
            <AIConfidenceScore
              taxRecords={taxRecords}
              demographics={demographics}
              climateRisk={undefined}
            />

            {/* Enhanced Gamification */}
            <GamificationProgress 
              analytics={analytics}
              userLevel={2}
              analysisCount={5}
            />
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk">
            <RiskReport
              property={property}
              taxRecords={taxRecords}
              taxIssues={taxHistoryIssues}
              demographics={demographics}
              analytics={analytics}
            />
          </TabsContent>

          {/* Investment Report Tab */}
          <TabsContent value="investment">
            <InvestmentReport
              property={property}
              taxRecords={taxRecords}
              neighborSales={neighborSales}
              building={building}
              analytics={analytics}
            />
          </TabsContent>

          {/* Complete Report Tab */}
          <TabsContent value="complete">
            <CompleteReport
              property={property}
              taxRecords={taxRecords}
              taxIssues={taxHistoryIssues}
              neighborSales={neighborSales}
              demographics={demographics}
              building={building}
              analytics={analytics}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};