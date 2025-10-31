import { FileText, Download, Database, TrendingUp, AlertTriangle, Home, Users, DollarSign, Calendar, MapPin, Building2, Shield, FileCheck, School, Wrench, Gavel, Zap, Image, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { motion } from "framer-motion";
import { 
  PropertyData, 
  TaxRecord, 
  TaxHistoryIssue, 
  NeighborSale, 
  Demographics, 
  Building, 
  PropertyAnalytics,
  AdValoremTax,
  BuildingFeature,
  BuildingSubarea,
  Community,
  PropertyDocument,
  ExtraFeature,
  PropertyImage,
  LandArea,
  LandFeature,
  LegalDescription,
  NonAdValoremTax,
  PropertyOfficial,
  SalesRecord,
  School as SchoolType,
  PropertyService
} from "@/lib/mockData";
import { CompletePropertyData, exportToPDF, exportToJSON, exportToCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import floorPlanImage from "@/assets/floor-plan.jpg";
import { formatDollar } from '@/lib/utils';

interface CompleteReportProps {
  property: PropertyData;
  taxRecords: TaxRecord[];
  taxIssues: TaxHistoryIssue[];
  neighborSales: NeighborSale[];
  demographics: Demographics | null;
  building: Building | null;
  analytics: PropertyAnalytics;
}

// Define the expected type for fairMarketRent
interface FairMarketRent {
  efficiency?: number;
  one_bedroom?: number;
  two_bedroom?: number;
  three_bedroom?: number;
  four_bedroom?: number;
}

// Mock or fetch Fair Market Rent Data
const fairMarketRentData = {
  efficiency: 1.9,
  one_bedroom: 2.0,
  two_bedroom: 2.3,
  three_bedroom: 2.9,
  four_bedroom: 3.4,
};

export const CompleteReport = ({
  property,
  taxRecords,
  taxIssues,
  neighborSales,
  demographics,
  building,
  analytics
}: CompleteReportProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [countyName, setCountyName] = useState("");
  const [currentMarketValue, setCurrentMarketValue] = useState<number | null>(null);
  const [loadingMarketValue, setLoadingMarketValue] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch additional data on component mount
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        // Simulate document and image data fetching
        const documentsData = documents.length > 0 ? documents : [
          { parcel_id: property.parcel_id, doc_type: "Deed", doc_number: `DOC${property.parcel_id}`, doc_date: "2023-01-15", file_url: "#", description: "Property Deed" },
          { parcel_id: property.parcel_id, doc_type: "Survey", doc_number: `SUR${property.parcel_id}`, doc_date: "2023-02-10", file_url: "#", description: "Property Survey" },
          { parcel_id: property.parcel_id, doc_type: "Appraisal", doc_number: `APR${property.parcel_id}`, doc_date: "2023-03-05", file_url: "#", description: "Property Appraisal" },
        ];
        
        const imagesData = images.length > 0 ? images : [
          { parcel_id: property.parcel_id, image_url: "https://placeholder.com/800x600/4f46e5/ffffff?text=Front+View", description: "Front Exterior View" },
          { parcel_id: property.parcel_id, image_url: "https://placeholder.com/800x600/059669/ffffff?text=Pool+Area", description: "Pool & Deck Area" },
          { parcel_id: property.parcel_id, image_url: floorPlanImage, description: "Property Floor Plan" },
          { parcel_id: property.parcel_id, image_url: "https://placeholder.com/800x600/dc2626/ffffff?text=Living+Room", description: "Main Living Room" },
        ];
        
        setDocuments(documentsData);
        setImages(imagesData);
      } catch (error) {
        console.error("Error fetching additional data:", error);
      } finally {
        setLoadingAssets(false);
      }
    };

    fetchAdditionalData();
  }, [property.parcel_id, documents, images]);

  useEffect(() => {
    async function fetchCountyName() {
      if (property.county_id) {
        try {
          const res = await fetch(`/api/counties/${property.county_id}`, {
            headers: { 'x-api-key': '7f2e1c9a-auctions-2025' }
          });
          if (res.ok) {
            const data = await res.json();
            setCountyName(data.county?.county_name || "");
          }
        } catch (e) {
          // fallback: keep county_id
        }
      }
    }
    fetchCountyName();
  }, [property.county_id]);
  
  // Fetch current market value from dedicated endpoint
  useEffect(() => {
    console.log("[DEBUG] useEffect triggered with property.parcel_id:", property.parcel_id);
    if (!property.parcel_id || loadingMarketValue) {
      console.log("[DEBUG] Skipping fetchMarketValue due to invalid parcel_id or ongoing fetch.");
      return;
    }

    const fetchMarketValue = async () => {
      try {
        console.log("[DEBUG] Fetching market value for parcel_id:", property.parcel_id);
        setLoadingMarketValue(true);
        const response = await fetch(`/api/properties/${property.parcel_id}/market-value`);
        if (!response.ok) {
          throw new Error('Failed to fetch market value.');
        }
        const data = await response.json();
        console.log("[DEBUG] Market value fetched successfully:", data.market_value);
        setCurrentMarketValue(data.market_value);
      } catch (err) {
        console.error("[DEBUG] Error fetching market value:", err);
        setError('Failed to fetch market value.');
      } finally {
        setLoadingMarketValue(false);
      }
    };

    fetchMarketValue();
  }, [property.parcel_id, loadingMarketValue]);

  const completeData: CompletePropertyData = {
    property,
    adValoremTax: [], // Populated from mock data
    buildingFeatures: [],
    buildingSubareas: [],
    buildings: building ? [building] : [],
    community: null,
    demographics,
    propertyDocuments: documents,
    extraFeatures: [],
    propertyImages: images,
    landAreas: null,
    landFeatures: [],
    legalDescriptions: null,
    neighborSales,
    nonAdValoremTax: [],
    propertyOfficials: [],
    salesRecords: [],
    schools: [],
    propertyServices: [],
    taxRecords,
    taxHistoryIssues: taxIssues,
    analytics
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(completeData);
      toast({
        title: "Report exported!",
        description: "The PDF report was downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export error",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportJSON = () => {
    try {
      exportToJSON(completeData);
      toast({
        title: "Data exported!",
        description: "The JSON data was downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export error", 
        description: "Could not generate JSON. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(completeData);
      toast({
        title: "Data exported!",
        description: "The CSV data was downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export error",
        description: "Could not generate CSV. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Select the latest valid tax record with show_flag true and building_value > 0
  const currentTax = taxRecords
    .filter(tr => {
      // Accept building_value as valid if it's a number > 0, or a string that parses to a number > 0
      const bv = typeof tr.building_value === 'string' ? parseFloat(tr.building_value) : tr.building_value;
      return tr.show_flag && typeof bv === 'number' && bv > 0;
    })
    .sort((a, b) => b.tax_year - a.tax_year)[0] || taxRecords[0];

  // Novo: Pega o último tax record válido para assessed_value
  // Corrigido: usar o tax record mais recente com show_flag e ambos market_value e assessed_value > 0
  const lastValidTax = taxRecords
    .filter(tr => {
      const assessed = typeof tr.assessed_value === 'number' ? tr.assessed_value : parseFloat(tr.assessed_value);
      const market = typeof tr.market_value === 'number' ? tr.market_value : parseFloat(tr.market_value);
      return tr.show_flag && assessed > 0 && market > 0;
    })
    .sort((a, b) => b.tax_year - a.tax_year)[0] || { market_value: 0, assessed_value: 0 }; // Fallback para evitar undefined
  const currentIssue = taxIssues[0];

  // Substituir lastValidTax.market_value pelo valor correto vindo do endpoint
  // const marketValue = property.current_market_value; // Atualizado para usar o valor correto do endpoint

  // Atualizar cálculos dependentes
  const valueDifference =
    property.current_market_value && lastValidTax.assessed_value
      ? property.current_market_value - lastValidTax.assessed_value
      : 0;

  const assessmentRatio =
    property.current_market_value && lastValidTax.assessed_value && property.current_market_value > 0
      ? ((lastValidTax.assessed_value / property.current_market_value) * 100).toFixed(1)
      : '0.0';

  // Garantir que lastValidTax e market_value sejam válidos
  const validMarketValue = lastValidTax && lastValidTax.market_value > 0 ? lastValidTax.market_value : 0;

  // Adicionar logs para depuração de lastValidTax e market_value
  console.log('lastValidTax:', lastValidTax);
  console.log('lastValidTax.market_value:', lastValidTax?.market_value);

  // Adicionar logs para depurar valores usados no cálculo de Assessment Ratio
  console.log('Assessed Value:', lastValidTax.assessed_value);
  console.log('Market Value:', lastValidTax.market_value);
  console.log('Assessment Ratio:', assessmentRatio);

  // Adicionar logs para depurar valores usados no cálculo de Value Difference
  console.log('Market Value (para Value Difference):', lastValidTax.market_value);
  console.log('Assessed Value (para Value Difference):', lastValidTax.assessed_value);
  console.log('Value Difference:', valueDifference);

  // Relacionar número de quartos com os dados do endpoint
  console.log("Fair Market Rent Data:", fairMarketRentData);
  console.log("Number of Bedrooms:", property?.beds);

  // Calculate Monthly Rent Est. based on Fair Market Rent Data and number of bedrooms
  const numberOfBedrooms = property?.beds || 0;
  const fairMarketRentValue = fairMarketRentData[`${numberOfBedrooms}_bedroom`] || fairMarketRentData.four_bedroom;
  const monthlyRentEst = fairMarketRentValue * 1000; // Assuming rent is in thousands

  console.log(`Fair Market Rent Data:`, fairMarketRentData);
  console.log(`Number of Bedrooms:`, numberOfBedrooms);
  console.log(`Calculated Monthly Rent Est.:`, monthlyRentEst);

  const potentialAnnualRent = monthlyRentEst * 12;
  console.log("Calculated Potential Annual Rent:", potentialAnnualRent);

  if (currentMarketValue && lastValidTax.assessed_value) {
    console.log(`Market Value: ${currentMarketValue}`);
    console.log(`Assessed Value: ${lastValidTax.assessed_value}`);
    console.log(`Value Difference Calculation: ${currentMarketValue} - ${lastValidTax.assessed_value} = ${valueDifference}`);
  } else {
    console.log('Invalid values for Market Value or Assessed Value.');
  }

  // Consolidated log for Monthly Rent Est. and Potential Annual Rent
  console.log(`Monthly Rent Est.: ${monthlyRentEst}, Potential Annual Rent: ${potentialAnnualRent}`);

  console.log("Debugging Investment Metrics:");
  console.log("Number of Bedrooms (property.beds):", property.beds);
  console.log("Fair Market Rent Data:", fairMarketRentData);
  console.log("Calculated Monthly Rent Est.:", monthlyRentEst);

  // Exibir ROI Potential no relatório completo
  const roiPotential = analytics?.roiPercent || 0;

  console.log('[DEBUG] ROI Potential:', roiPotential);
  console.log('[DEBUG - CompleteReport] analytics.potentialROI:', analytics.potentialROI);

  // Consolidando logs importantes em um único ponto
  useEffect(() => {
    if (property && monthlyRentEst && potentialAnnualRent) {
      console.log('[DEBUG] Investment Metrics:', {
        numberOfBedrooms: property.beds,
        fairMarketRentData,
        monthlyRentEst,
        potentialAnnualRent,
      });
    }
  }, [property, monthlyRentEst, potentialAnnualRent]);

  const formattedMarketValue = formatDollar(currentMarketValue);
  const formattedAssessedValue = formatDollar(lastValidTax.assessed_value);
  const formattedValueDifference = formatDollar(valueDifference);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Export Options */}
      <Card className="shadow-medium animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-6 w-6 text-primary" />
                Complete Property Report - {property.parcel_id}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Comprehensive analysis of all available property data and records
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleExportPDF} className="hero-gradient">
                <Download className="h-4 w-4 mr-2" />
                PDF Report
              </Button>
              <Button onClick={handleExportJSON} variant="outline">
                <Database className="h-4 w-4 mr-2" />
                JSON Data
              </Button>
              <Button onClick={handleExportCSV} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                CSV Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Executive Summary */}
      <Card className="shadow-medium animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Market Value */}
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatDollar(property.current_market_value)}
              </div>
              <p className="text-sm text-muted-foreground font-medium">Current Market Value</p>
            </div>
            {/* Risk Score */}
            <div className="text-center p-4 rounded-lg bg-secondary/10">
              <div className="text-3xl font-bold text-secondary mb-2">
                <AnimatedCounter value={parseFloat(analytics.overallRiskScore.toFixed(0))} duration={2.5} delay={0.5} />%
              </div>
              <p className="text-sm text-muted-foreground font-medium">Overall Risk Score</p>
            </div>
            {/* ROI Potential */}
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-3xl font-bold text-accent mb-2">
                <AnimatedCounter value={parseFloat(analytics.potentialROI.toFixed(2))} decimals={2} duration={2.5} delay={0.7} />%
              </div>
              <p className="text-sm text-muted-foreground font-medium">ROI Potential</p>
            </div>
            {/* Rent Potential */}
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-3xl font-bold text-foreground mb-2">
                {formatDollar(property.potential_rent_income)}
              </div>
              <p className="text-sm text-muted-foreground font-medium">Annual Rent Potential</p>
            </div>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">AI Analysis Summary</h4>
            <p className="text-muted-foreground leading-relaxed">{analytics.aiNarrative}</p>
          </div>
        </CardContent>
      </Card>

      {/* Property Identification & Ownership */}
      <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Property Identification & Ownership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Details */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Property Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parcel ID:</span>
                  <Badge variant="outline">{property.parcel_id}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">County:</span>
                  <span className="font-medium">{countyName || property.county_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Year:</span>
                  <span className="font-medium">{property.tax_year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instrument Number:</span>
                  <span className="font-medium">{property.inst_num}</span>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Owner Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner Name:</span>
                  <span className="font-medium">{property.owner_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Occupancy:</span>
                  <Badge variant="secondary">{property.occupancy_status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium text-right whitespace-nowrap">{property.mail_address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City, State ZIP:</span>
                  <span className="font-medium">{property.mail_city}{property.mail_city ? ',' : ''} {property.mail_state} {property.mail_zip}</span>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Location Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Street Number:</span>
                  <span className="font-medium">{property.street_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Street Name:</span>
                  <span className="font-medium">{property.street_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Address:</span>
                  <span className="font-medium text-right max-w-[200px]">{property.property_address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City, State ZIP:</span>
                  <span className="font-medium">{property.property_city}, {property.property_state} {property.property_zip}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Property Details */}
      {building && (
        <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Physical Property Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Basic Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Building ID:</span>
                    <span className="font-medium">{building.building_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Building Number:</span>
                    <span className="font-medium">{building.building_num}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description:</span>
                    <span className="font-medium text-right max-w-[150px]">{building.desc_bldg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DOR Code:</span>
                    <span className="font-medium">{building.bldg_dor_code}</span>
                  </div>
                </div>
              </div>

              {/* Size & Layout */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Size & Layout</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bedrooms:</span>
                    <span className="font-bold text-primary">
                      <AnimatedCounter value={building.beds} duration={1.5} delay={1.1} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bathrooms:</span>
                    <span className="font-bold text-primary">
                      <AnimatedCounter value={building.baths} duration={1.5} delay={1.2} decimals={1} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Floors:</span>
                    <span className="font-medium">
                      <AnimatedCounter value={building.floors} duration={1.5} delay={1.3} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Living Area:</span>
                    <span className="font-bold text-secondary">
                      <AnimatedCounter value={building.living_area} duration={2} delay={1.4} /> sq ft
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross Area:</span>
                    <span className="font-medium">
                      <AnimatedCounter value={building.gross_area} duration={2} delay={1.5} /> sq ft
                    </span>
                  </div>
                </div>
              </div>

              {/* Construction & Value */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Construction & Value</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year Built:</span>
                    <span className="font-medium">
                      <AnimatedCounter value={building.date_built} duration={2} delay={1.6} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">
                      <AnimatedCounter value={new Date().getFullYear() - building.date_built} duration={1.5} delay={1.7} /> years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exterior Wall:</span>
                    <span className="font-medium">{building.ext_wall}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interior Wall:</span>
                    <span className="font-medium">{building.int_wall}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Building Value:</span>
                    <span className="font-bold text-primary">
                      {formatDollar(
                        (typeof currentTax?.building_value === 'string'
                          ? parseFloat(currentTax.building_value)
                          : currentTax?.building_value) > 0
                          ? (typeof currentTax.building_value === 'string'
                              ? parseFloat(currentTax.building_value)
                              : currentTax.building_value)
                          : building.bldg_value
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Land Information */}
      <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Land Information & Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Land Size</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Acreage:</span>
                  <span className="font-bold text-primary">{property.acreage.toFixed(2)} acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Square Feet:</span>
                  <span className="font-bold text-secondary">{property.sqft.toLocaleString()} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Land per SqFt:</span>
                  <span className="font-medium">${(
                    property.sqft && currentTax?.land_value
                      ? currentTax.land_value / property.sqft
                      : 0
                  ).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Zoning & Use</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Use:</span>
                  <Badge variant="outline">Residential</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Development Potential:</span>
                  <Badge variant="secondary">Standard</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Land Value</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Land Value:</span>
                  <span className="font-bold text-primary">${currentTax?.land_value.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">% of Total Value:</span>
                  <span className="font-medium">
                    {currentTax ? ((currentTax.land_value / currentTax.market_value) * 100).toFixed(1) : 'N/A'}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demographics & Community */}
      {demographics && (
        <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Demographics & Community Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Population Data</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Population:</span>
                    <span className="font-bold text-primary">{demographics.total_population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Area:</span>
                    <span className="font-medium">{demographics.total_area} sq mi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Population Density:</span>
                    <span className="font-medium">{demographics.population_density.toLocaleString()}/sq mi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diversity Index:</span>
                    <span className="font-medium">{demographics.diversity_index.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Housing Market</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Households:</span>
                    <span className="font-medium">{demographics.total_households.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SFR Homes:</span>
                    <span className="font-medium">{demographics.sfr_home_count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condos:</span>
                    <span className="font-medium">{demographics.residential_condo_count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SFR/Condo Ratio:</span>
                    <span className="font-medium">{(demographics.sfr_home_count / demographics.residential_condo_count).toFixed(1)}:1</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Market Values</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Median SFR Value:</span>
                    <span className="font-bold text-secondary">${demographics.median_sfr_market_value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Median Condo Value:</span>
                    <span className="font-medium">${demographics.median_condo_market_value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Median SFR Size:</span>
                    <span className="font-medium">{demographics.median_sfr_living_area.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Median Condo Size:</span>
                    <span className="font-medium">{demographics.median_condo_living_area.toLocaleString()} sq ft</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Neighbor Sales Analysis */}
      {neighborSales.length > 0 && (
        <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Comparative Market Analysis - Neighbor Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <div className="text-2xl font-bold text-primary mb-1">
                    ${(neighborSales.reduce((sum, sale) => sum + sale.sale_price, 0) / neighborSales.length).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Average Sale Price</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/10">
                  <div className="text-2xl font-bold text-secondary mb-1">
                    {neighborSales.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Recent Sales</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/10">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {Math.round(neighborSales.reduce((sum, sale) => sum + sale.heated_area, 0) / neighborSales.length).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Size (sq ft)</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Recent Sales Details</h4>
                {neighborSales.map((sale, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/20 border border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="font-medium">{sale.property_address}</p>
                        <p className="text-sm text-muted-foreground">Neighbor ID: {sale.neighbor_id}</p>
                      </div>
                      <div>
                        <p className="font-bold text-primary">${sale.sale_price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(sale.sale_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">{sale.beds} bed, {sale.baths} bath</p>
                        <p className="text-sm text-muted-foreground">{sale.heated_area.toLocaleString()} sq ft</p>
                      </div>
                      <div>
                        <p className="text-sm">${(sale.sale_price / sale.heated_area).toFixed(0)}/sq ft</p>
                        <p className="text-sm text-muted-foreground">{sale.deed_desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Items & Recommendations */}
      <Card className="shadow-medium animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Strategic Recommendations & Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.actionableRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-secondary/5 to-primary/5 border border-secondary/20">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-secondary">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{recommendation}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {index < 2 ? 'High Priority' : index < 4 ? 'Medium Priority' : 'Low Priority'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {index % 3 === 0 ? 'Financial' : index % 3 === 1 ? 'Legal' : 'Operational'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Documents */}
      <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Property Documents & Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAssets ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
              <span className="ml-3 text-muted-foreground">Loading documents...</span>
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <div className="text-2xl font-bold text-primary mb-1">{documents.length}</div>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/10">
                  <div className="text-2xl font-bold text-secondary mb-1">
                    {documents.filter(doc => doc.doc_type === "Deed").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Legal Documents</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent/10">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {documents.filter(doc => doc.doc_type === "Survey" || doc.doc_type === "Appraisal").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Technical Reports</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Document List</h4>
                {documents.map((doc, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/20 border border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="font-medium">{doc.doc_type}</p>
                        <p className="text-sm text-muted-foreground">#{doc.doc_number}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{new Date(doc.doc_date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">Document Date</p>
                      </div>
                      <div>
                        <p className="text-sm">{doc.description}</p>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="h-3 w-3" />
                          View Document
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents available for this property</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Images Gallery */}
      <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            Property Images & Visual Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAssets ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
              <span className="ml-3 text-muted-foreground">Loading images...</span>
            </div>
          ) : images.length > 0 ? (
            <div className="space-y-6">
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary mb-1">{images.length}</div>
                <p className="text-sm text-muted-foreground">Property Images Available</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img, index) => (
                  <div key={index} className="space-y-3">
                    <div className="relative group rounded-lg overflow-hidden bg-muted/20 border border-border/50">
                      <img 
                        src={img.image_url} 
                        alt={img.description}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placeholder.com/400x300/e5e7eb/6b7280?text=Image+Not+Available";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm" className="gap-2">
                          <ExternalLink className="h-3 w-3" />
                          View Full Size
                        </Button>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">{img.description}</p>
                      {img.description.toLowerCase().includes('floor plan') && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Floor Plan
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Floor Plan Highlight */}
              {images.some(img => img.description.toLowerCase().includes('floor plan')) && (
                <div className="p-6 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Professional Floor Plan Available
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Detailed architectural floor plan showing room layouts, dimensions, and spatial relationships. 
                    Perfect for understanding the property's flow and potential renovation opportunities.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No images available for this property</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Data Summary & Report Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">{taxRecords.length}</div>
              <p className="text-sm text-muted-foreground">Tax Records</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-1">{neighborSales.length}</div>
              <p className="text-sm text-muted-foreground">Neighbor Sales</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">{taxIssues.length}</div>
              <p className="text-sm text-muted-foreground">Tax Issues</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {new Date().toLocaleDateString()}
              </div>
              <p className="text-sm text-muted-foreground">Report Generated</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h4 className="font-semibold">PropertyForge AI Complete Analysis</h4>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                This comprehensive report was generated using PropertyForge AI advanced analytics engine, 
                incorporating all available property data, market comparisons, and predictive modeling 
                to provide actionable insights for real estate professionals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-muted-foreground">
              <div>
                <strong>Data Sources:</strong> Public records, MLS data, demographic databases
              </div>
              <div>
                <strong>Analysis Date:</strong> {new Date().toLocaleDateString()}
              </div>
              <div>
                <strong>Report Version:</strong> 2.1.0
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};