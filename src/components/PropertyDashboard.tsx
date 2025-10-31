import { useState, useEffect, useMemo } from "react";


import { ArrowLeft, Download, MessageCircle, Home, AlertTriangle, TrendingUp, DollarSign, FileText, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/lib/apiConfig";
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
import { getPropertyRoiPotential } from '@/lib/roi';
import { getPropertyValuation } from '@/lib/valuation';
import type { PropertyValuation } from '@/lib/valuation';
import type { PropertyRoiPotential } from '@/lib/api';


// Componente principal

import type { CompletePropertyData } from "@/lib/api";

interface PropertyDashboardProps {
  parcelId: string;
  onBack: () => void;
  propertyData: CompletePropertyData;
}

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

export const PropertyDashboard = ({ parcelId, propertyData, onBack }: PropertyDashboardProps) => {
  // Estado para o total risk score
  const [totalRiskScore, setTotalRiskScore] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract all data from propertyData
  // Substituir valores do property/analytics pelos vindos da API (valuation, roiData, totalRiskScore)
  const { property: origProperty } = propertyData;
  const { taxRecords, taxHistoryIssues, neighborSales, demographics, buildings, analytics: origAnalytics } = propertyData;
  const building = buildings && buildings.length > 0 ? buildings[0] : null;

  // Novo: buscar ROI Potential e Market Position do backend
  const [roiData, setRoiData] = useState<PropertyRoiPotential | null>(null);
  const [roiError, setRoiError] = useState<string | null>(null);
  const [valuation, setValuation] = useState<PropertyValuation | null>(null);
  const [valuationError, setValuationError] = useState<string | null>(null);

  const [propertyState, setPropertyState] = useState(origProperty);
  const [neighborSalesState, setNeighborSalesState] = useState(propertyData.neighborSales || []);
  const [taxRecordsState, setTaxRecordsState] = useState(propertyData.taxRecords || []);
  const [buildingsState, setBuildingsState] = useState(propertyData.buildings || []);

  // Montar property/analytics com sobrescrita dos valores vindos da API (após definição de roiData/valuation)
  const property = useMemo(() => {
    return {
      ...origProperty,
      current_market_value: valuation?.market_value ?? origProperty.current_market_value,
      potential_rent_income: roiData?.potential_rent_income ?? origProperty.potential_rent_income,
    };
  }, [origProperty, valuation, roiData]);
  const [analytics, setAnalytics] = useState(origAnalytics
    ? {
        ...origAnalytics,
        overallRiskScore: totalRiskScore !== null ? totalRiskScore : origAnalytics.overallRiskScore,
        // Corrigir: converter ROI de fração para porcentagem
        potentialROI: roiData?.roi_potential_percent !== undefined
          ? roiData.roi_potential_percent
          : origAnalytics.potentialROI,
      }
    : {
        overallRiskScore: totalRiskScore !== null ? totalRiskScore : 0,
        potentialROI: roiData?.roi_potential_percent ?? 0,
        financialRiskScore: 0,
        socialRiskScore: 0,
        climateRiskScore: 0,
        neighborBenchmark: 0,
        aiNarrative: '',
        actionableRecommendations: [],
      });

  console.log('[DEBUG] roiData:', roiData);
  console.log('[DEBUG] roiData.roi_potential_percent:', roiData?.roi_potential_percent);
  console.log('[DEBUG] origAnalytics.potentialROI:', origAnalytics?.potentialROI);
  console.log('[DEBUG] analytics.potentialROI:', analytics.potentialROI);

  // Corrigir property.heated_area, beds e baths usando o primeiro building se necessário
  if (buildings && buildings.length > 0) {
    const b = buildings[0];
    if ((!property.heated_area || property.heated_area === 0) && b.living_area && b.living_area > 0) property.heated_area = b.living_area;
    if ((!property.beds || property.beds === 0) && b.beds && b.beds > 0) property.beds = b.beds;
    if ((!property.baths || property.baths === 0) && b.baths && b.baths > 0) property.baths = b.baths;
  }

  const [dataLoaded, setDataLoaded] = useState(false);
  const [logsShown, setLogsShown] = useState(false);

  // Consolidar chamadas de API e evitar redundâncias
  useEffect(() => {
    if (dataLoaded) return; // Evitar chamadas repetidas

    const fetchData = async () => {
      try {
        setLoading(true);

        const responses = await Promise.all([
          fetch(`${API_BASE_URL}/api/property/${parcelId}`),
          fetch(`${API_BASE_URL}/api/property_neighbor_sales/${parcelId}`),
          fetch(`${API_BASE_URL}/api/property_tax_records/${parcelId}`),
          fetch(`${API_BASE_URL}/api/property_buildings/${parcelId}`),
          fetch(`${API_BASE_URL}/api/total_risk_score/${parcelId}`),
          getPropertyRoiPotential(parcelId),
          getPropertyValuation(parcelId),
        ]);

        const [
          propertyData,
          neighborSalesData,
          taxRecordsData,
          buildingsData,
          totalScoreRes,
          roiRes,
          valuationRes,
        ] = await Promise.all(
          responses.map((res, index) => {
            if (index < 4 && res instanceof Response) {
              return res.json(); // Apenas para objetos Response
            }
            return res; // Para objetos já processados
          })
        );

        setPropertyState(propertyData);
        setNeighborSalesState(neighborSalesData);
        setTaxRecordsState(taxRecordsData);
        setBuildingsState(buildingsData);

        if (totalScoreRes.ok) {
          setTotalRiskScore(totalScoreRes[0]?.total_risk_score ?? null);
        } else {
          setTotalRiskScore(null);
        }

        if (roiRes.success && roiRes.data) {
          setRoiData(roiRes.data);
        } else {
          setRoiData(null);
          setRoiError(roiRes.error || 'Erro ao buscar ROI Potential');
        }

        if (valuationRes.success && valuationRes.data) {
          setValuation(valuationRes.data);
        } else {
          setValuation(null);
          setValuationError(valuationRes.error || 'Erro ao buscar Property Valuation');
        }

        setDataLoaded(true); // Marcar como carregado
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao buscar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parcelId, dataLoaded, neighborSalesState, propertyState]);

  // Atualizar neighborBenchmark sempre que roiData mudar
  useEffect(() => {
    if (roiData) {
      const { roi_percent, roi_neighborhood_avg, vs_neighborhood, market_value, annual_rent_income } = roiData;

      setAnalytics((prevAnalytics) => ({
        ...prevAnalytics,
        roiPercent: roi_percent,
        neighborBenchmark: roi_neighborhood_avg,
        vsNeighborhood: vs_neighborhood,
        marketValue: market_value,
        annualRentIncome: annual_rent_income,
        potentialROI: parseFloat(roiData.roi_potential_percent.toFixed(2)), // Garantindo precisão de duas casas decimais
      }));
      console.log('[DEBUG] Updated analytics:', {
        roiPercent: roi_percent,
        neighborBenchmark: roi_neighborhood_avg,
        vsNeighborhood: vs_neighborhood,
        marketValue: market_value,
        annualRentIncome: annual_rent_income,
        potentialROI: roiData.roi_potential_percent,
      });
    } else {
      console.log('[DEBUG] ROI Data is null or undefined. Skipping update.');
    }
  }, [roiData]);

  // Consolidar lógica de carregamento de dados
  useEffect(() => {
    if (dataLoaded) return; // Evitar chamadas repetidas

    const fetchData = async () => {
      try {
        setLoading(true);

        const responses = await Promise.all([
          fetch(`${API_BASE_URL}/api/property/${parcelId}`),
          fetch(`${API_BASE_URL}/api/property_neighbor_sales/${parcelId}`),
          fetch(`${API_BASE_URL}/api/property_tax_records/${parcelId}`),
          fetch(`${API_BASE_URL}/api/property_buildings/${parcelId}`),
        ]);

        const [propertyData, neighborSalesData, taxRecordsData, buildingsData] = await Promise.all(
          responses.map((res) => res.json())
        );

        setDataLoaded(true); // Marcar como carregado
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parcelId, dataLoaded]);

  // Validar neighborSales antes de prosseguir
  const hasValidNeighborSales = useMemo(() => {
    return neighborSales && neighborSales.length >= 3;
  }, [neighborSales]);

  // Atualizar logs de depuração com controle mais rigoroso
  useEffect(() => {
    if (typeof window !== 'undefined' && dataLoaded && !logsShown) {
      if (!hasValidNeighborSales) {
        console.warn('[AVISO] Menos de 3 comps válidos. Estimativa menos confiável.');
      }
      console.log('[DEBUG] Dados carregados com sucesso:', { property, neighborSales });
      setLogsShown(true); // Garantir que os logs sejam exibidos apenas uma vez
    }
  }, [dataLoaded, hasValidNeighborSales, logsShown, neighborSales, property]);

  // Log para identificar a origem das atualizações de property e neighborSales
  useEffect(() => {
    if (typeof window !== 'undefined' && !logsShown) {
      console.log('[DEBUG - useEffect Triggered] Dependencies changed:', {
        propertyChanged: JSON.stringify(property),
        neighborSalesChanged: JSON.stringify(neighborSales),
      });
      console.log('[DEBUG - useEffect] property and neighborSales updated:', {
        source: 'useEffect dependency change',
        property,
        neighborSales,
      });
      setLogsShown(true); // Garante que os logs sejam exibidos apenas uma vez
    }
  }, [property, neighborSales, logsShown]);

  // Nova lógica unificada para chamadas de API
  useEffect(() => {
    if (!dataLoaded) {
      console.log('[DEBUG - API Call] Fetching all property-related data:', {
        parcelId,
      });

      const fetchData = async () => {
        try {
          const [
            propertyResponse,
            neighborSalesResponse,
            floodRiskResponse,
            salesRecordsResponse,
            demographicsResponse,
            schoolsResponse,
            disastersRiskResponse,
          ] = await Promise.all([
            fetch(`${API_BASE_URL}/api/property/${parcelId}`),
            fetch(`${API_BASE_URL}/api/property_neighbor_sales/${parcelId}`),
            fetch(`${API_BASE_URL}/api/property_flood_risk/${parcelId}`),
            fetch(`${API_BASE_URL}/api/property_sales_records/${parcelId}`),
            fetch(`${API_BASE_URL}/api/property_demographics/${parcelId}`),
            fetch(`${API_BASE_URL}/api/property_schools/${parcelId}`),
            fetch(`${API_BASE_URL}/api/property_disasters_risks/${parcelId}`),
          ]);

          const [
            propertyData,
            neighborSalesData,
            floodRiskData,
            salesRecordsData,
            demographicsData,
            schoolsData,
            disastersRiskData,
          ] = await Promise.all([
            propertyResponse.json(),
            neighborSalesResponse.json(),
            floodRiskResponse.json(),
            salesRecordsResponse.json(),
            demographicsResponse.json(),
            schoolsResponse.json(),
            disastersRiskResponse.json(),
          ]);

          setPropertyState(propertyData);
          setNeighborSalesState(neighborSalesData);

          console.log('[DEBUG - API Response] All Property Data:', {
            property,
            neighborSales,
            floodRisk: floodRiskData,
            salesRecords: salesRecordsData,
            demographics: demographicsData,
            schools: schoolsData,
            disastersRisk: disastersRiskData,
          });

          setDataLoaded(true);
        } catch (error) {
          console.error('[ERROR - API Call] Failed to fetch data:', error);
        }
      };

      fetchData();
    }
  }, [parcelId, dataLoaded]);

  // Corrigindo dependências ausentes no useEffect
  useEffect(() => {
    if (dataLoaded && analytics?.neighborBenchmark !== undefined) {
      console.log('[DEBUG] Neighbor Benchmark:', {
        neighborBenchmark: analytics.neighborBenchmark,
      });
    }
  }, [dataLoaded, analytics?.neighborBenchmark, neighborSales, property]);

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

  console.log('[DEBUG - PropertyDashboard] analytics.potentialROI:', analytics.potentialROI);

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
                value={valuation?.market_value ?? 0}
                icon={DollarSign}
                colorScheme="primary"
                animationDelay={0.1}
              />
              {valuationError && (
                <div className="text-xs text-red-500 mt-1">{valuationError}</div>
              )}
              <AnimatedMetric
                title="Overall Risk Score"
                value={totalRiskScore !== null ? totalRiskScore : analytics.overallRiskScore}
                format="percentage"
                icon={AlertTriangle}
                colorScheme="accent"
                animationDelay={0.2}
                subtitle={
                  roiData?.risk_category && typeof roiData.risk_category === 'string'
                    ? (roiData.risk_category.toLowerCase().includes('overprice') || roiData.risk_category.toLowerCase().includes('overpriced')
                        ? undefined
                        : roiData.risk_category)
                    : undefined
                }
              />
              <AnimatedMetric
                title="ROI Potential"
                value={roiData?.roi_potential_percent !== undefined ? roiData.roi_potential_percent : 0}
                format="percentage"
                icon={TrendingUp}
                colorScheme="secondary"
                animationDelay={0.3}
              />
              <AnimatedMetric
                title="Market Position"
                value={typeof roiData?.market_position_score === 'number' ? roiData.market_position_score : 0}
                format="percentage"
                icon={Home}
                colorScheme="primary"
                animationDelay={0.4}
                subtitle={undefined}
              />
            </motion.div>

            {/* Risk Score Breakdown */}
            <RiskScoreBreakdown 
              parcelId={parcelId}
            />


            {/* Regional Comparatives */}
            {roiData && (
              <RegionalComparatives 
                roiPotential={roiData}
                property={property}
                demographics={demographics}
              />
            )}

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
              taxRecords={taxRecordsState}
              taxIssues={taxHistoryIssues}
              neighborSales={neighborSalesState}
              demographics={demographics}
              building={building}
              analytics={analytics}
              currentMarketValue={property.current_market_value} // Adicionado
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};