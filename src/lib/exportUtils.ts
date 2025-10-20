import jsPDF from 'jspdf';
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
  School,
  PropertyService
} from './mockData';

// Updated interface for complete property data export
export interface CompletePropertyData {
  property: PropertyData;
  adValoremTax: AdValoremTax[];
  buildingFeatures: BuildingFeature[];
  buildingSubareas: BuildingSubarea[];
  buildings: Building[];
  community: Community | null;
  demographics: Demographics | null;
  propertyDocuments: PropertyDocument[];
  extraFeatures: ExtraFeature[];
  propertyImages: PropertyImage[];
  landAreas: LandArea | null;
  landFeatures: LandFeature[];
  legalDescriptions: LegalDescription | null;
  neighborSales: NeighborSale[];
  nonAdValoremTax: NonAdValoremTax[];
  propertyOfficials: PropertyOfficial[];
  salesRecords: SalesRecord[];
  schools: School[];
  propertyServices: PropertyService[];
  taxRecords: TaxRecord[];
  taxHistoryIssues: TaxHistoryIssue[];
  analytics: PropertyAnalytics;
}

export const exportToPDF = (data: CompletePropertyData): void => {
  const doc = new jsPDF();
  const { property, analytics } = data;
  
  // Title
  doc.setFontSize(20);
  doc.text('PropertyForge AI - Complete Property Report', 20, 30);
  
  // Property Info
  doc.setFontSize(16);
  doc.text('Property Information', 20, 50);
  doc.setFontSize(12);
  doc.text(`Address: ${property.property_address}`, 20, 65);
  doc.text(`City: ${property.property_city}, ${property.property_state} ${property.property_zip}`, 20, 75);
  doc.text(`Owner: ${property.owner_name}`, 20, 85);
  doc.text(`Market Value: $${property.current_market_value.toLocaleString()}`, 20, 95);
  doc.text(`Assessed Value: $${property.assessed_value.toLocaleString()}`, 20, 105);
  doc.text(`Occupancy: ${property.occupancy_status}`, 20, 115);
  doc.text(`Land Size: ${property.acreage} acres (${property.sqft.toLocaleString()} sq ft)`, 20, 125);
  
  // Analytics
  doc.setFontSize(16);
  doc.text('Risk and Investment Analysis', 20, 145);
  doc.setFontSize(12);
  doc.text(`Overall Risk Score: ${analytics.overallRiskScore.toFixed(1)}%`, 20, 160);
  doc.text(`Potential ROI: ${analytics.potentialROI.toFixed(1)}%`, 20, 170);
  doc.text(`Neighborhood Benchmark: ${analytics.neighborBenchmark.toFixed(1)}%`, 20, 180);
  doc.text(`Potential Annual Rent: $${property.potential_rent_income.toLocaleString()}`, 20, 190);
  
  // AI Narrative
  doc.setFontSize(14);
  doc.text('AI Analysis:', 20, 210);
  doc.setFontSize(10);
  const splitText = doc.splitTextToSize(analytics.aiNarrative, 170);
  doc.text(splitText, 20, 220);
  
  // Recommendations
  doc.setFontSize(14);
  doc.text('Recommendations:', 20, 250);
  doc.setFontSize(10);
  let yPos = 260;
  analytics.actionableRecommendations.forEach((rec, index) => {
    doc.text(`${index + 1}. ${rec}`, 20, yPos);
    yPos += 10;
  });
  
  // Save
  doc.save(`PropertyForge-Complete-Report-${property.parcel_id}.pdf`);
};

export const exportToJSON = (data: CompletePropertyData): void => {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `PropertyForge-Data-${data.property.parcel_id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (data: CompletePropertyData): void => {
  const { property, analytics } = data;
  
  // Create comprehensive CSV headers and data
  const headers = [
    'Parcel ID', 'Owner Name', 'Address', 'City', 'State', 'ZIP',
    'Market Value', 'Assessed Value', 'Overall Risk Score', 'Financial Risk Score',
    'Social Risk Score', 'Potential ROI', 'Neighbor Benchmark', 'AI Narrative',
    'Occupancy Status', 'Acreage', 'Square Feet', 'County ID', 'Tax Year',
    'Estimated Rent Income', 'Renovation Cost', 'Eviction Cost'
  ];
  
  const row = [
    property.parcel_id,
    property.owner_name,  
    property.property_address,
    property.property_city,
    property.property_state,
    property.property_zip,
    property.current_market_value,
    property.assessed_value,
    analytics.overallRiskScore.toFixed(2),
    analytics.financialRiskScore.toFixed(2),
    analytics.socialRiskScore.toFixed(2),
    analytics.potentialROI.toFixed(2),
    analytics.neighborBenchmark.toFixed(2),
    `"${analytics.aiNarrative.replace(/"/g, '""')}"`,
    property.occupancy_status,
    property.acreage,
    property.sqft,
    property.county_id,
    property.tax_year,
    property.potential_rent_income,
    property.estimated_renovation_cost,
    property.estimated_eviction_cost
  ];
  
  const csvContent = [
    headers.join(','),
    row.join(',')
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `PropertyForge-Data-${property.parcel_id}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};