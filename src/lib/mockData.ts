// Mock API responses based on tabelas_campos.txt structure
// Simulates data fetches for PropertyForge AI - COMPLETE DATABASE STRUCTURE

export interface PropertyData {
  // From property_tax_history_issues table - main property data
  parcel_id: string;
  parcel_id2?: string;
  parcel_url?: string;
  county_id: string;
  tax_year: number;
  prc_tax_year?: number;
  trim_year?: number;
  show_flag: boolean;
  owner_name: string;
  property_name?: string;
  property_address: string;
  mail_address?: string;
  mail_city?: string;
  mail_state?: string;
  mail_zip?: string;
  country: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  dor_code?: string;
  dor_description?: string;
  city_description?: string;
  street_number: string;
  street_name: string;
  inst_num?: string;
  acreage: number;
  sqft: number;
  assessed_value: number;
  occupancy_status: string;
  current_market_value: number;
  potential_rent_income: number;
  estimated_eviction_cost: number;
  estimated_renovation_cost: number;
  risk_score: number;
  beds?: number;
  baths?: number;
  heated_area?: number;
  // Cálculo avançado de valor de mercado
  estimated_value?: number;
  range_low?: number;
  range_high?: number;
}

// Climate Risk Data Interface
export interface ClimateRisk {
  parcel_id: string;
  flood_risk: number; // 0-100 scale
  fire_risk: number; // 0-100 scale
  storm_risk: number; // 0-100 scale
  heat_risk: number; // 0-100 scale
  overall_climate_score: number;
  fema_flood_zone?: string;
  wildfire_risk_level?: string;
  hurricane_zone?: string;
}

export interface AdValoremTax {
  // From property_ad_valorem_tax table
  parcel_id: string;
  tax_year: number;
  tax_type: string;
  taxing_authority: string;
  assessed_value: number;
  exemption: number;
  tax_value: number;
  millage_rate: number;
  previous_millage_rate: number;
  millage_percent: number;
  is_certified: boolean;
  is_homestead: boolean;
  taxes: number;
  rate_change_percent: number;
}

export interface BuildingFeature {
  // From property_building_features table
  parcel_id: string;
  feature_code: string;
  feature_value: number;
  feature_description: string;
}

export interface BuildingSubarea {
  // From property_building_subareas table
  parcel_id: string;
  subarea_code: string;
  sub_desc: string;
  sub_size: number;
  sub_value: number;
}

export interface Building {
  // From property_buildings table
  parcel_id: string;
  building_id: string;
  building_num: number;
  model?: string;
  desc_model?: string;
  bldg_dor_code: string;
  desc_bldg: string;
  bldg_value: number;
  est_new_cost: number;
  date_built: number;
  beds: number;
  baths: number;
  floors: number;
  gross_area: number;
  living_area: number;
  ext_wall: string;
  int_wall: string;
  total_count: number;
}

export interface Community {
  // From property_community table
  parcel_id: string;
  community_name: string;
  navigate_url?: string;
  is_gated: boolean;
  is_mandatory: boolean;
  households_count: number;
  sunbiz_url?: string;
}

export interface Demographics {
  // From property_demographics table
  parcel_id: string;
  block_group_id: string;
  total_population: number;
  total_area: number;
  population_density: number;
  diversity_index: number;
  total_households: number;
  sfr_home_count: number;
  residential_condo_count: number;
  median_sfr_market_value: number;
  median_condo_market_value: number;
  median_sfr_living_area: number;
  median_condo_living_area: number;
}

export interface PropertyDocument {
  // From property_documents table
  parcel_id: string;
  doc_type: string;
  doc_number: string;
  doc_date: string;
  file_url: string;
  description: string;
}

export interface ExtraFeature {
  // From property_extra_features table
  parcel_id: string;
  xfob_code: string;
  desc_short: string;
  xfob_qty: number;
  xfob_value: number;
  date_built?: number;
}

export interface PropertyImage {
  // From property_images table
  parcel_id: string;
  image_url: string;
  description: string;
}

export interface LandArea {
  // From property_land_areas table
  parcel_id: string;
  acreage: number;
  sqft: number;
  instr_num?: string;
}

export interface LandFeature {
  // From property_land_features table
  parcel_id: string;
  landDorCode: string;
  descShort: string;
  zoning: string;
  landQty: number;
  landQtyCode: string;
  unitPrice: number;
  landValue: number;
  classUnitPrice: number;
  classValue: number;
  totalCount: number;
}

export interface LegalDescription {
  // From property_legal_descriptions table
  parcel_id: string;
  description: string;
}

export interface NeighborSale {
  // From property_neighbor_sales table
  parcel_id: string;
  neighbor_id: string;
  property_address: string;
  sale_date: string;
  sale_price: number;
  deed_desc: string;
  beds: number;
  baths: number;
  heated_area: number;
  instr_num: string;
  book: string;
  page: string;
  total_count: number;
}

export interface NonAdValoremTax {
  // From property_non_ad_valorem_tax table
  parcel_id: string;
  tax_year: number;
  levying_authority: string;
  description: string;
  units: number;
  rate: number;
  assessment: number;
}

export interface PropertyOfficial {
  // From property_officials table
  parcel_id: string;
  official_id: string;
  official_name: string;
  navigate_url?: string;
  office_type_desc: string;
}

export interface SalesRecord {
  // From property_sales_records table
  parcel_id: string;
  sale_date: string;
  sale_amt: number;
  instr_num: string;
  book: string;
  page: string;
  seller: string;
  buyer: string;
  deed_desc: string;
  vac_imp_code: string;
}

export interface School {
  // From property_schools table
  parcel_id: string;
  school_id: string;
  school_name: string;
  school_type: string;
  school_phone: string;
  principal_name: string;
  navigate_url?: string;
  image_url?: string;
  zone_map_url?: string;
  school_grades: string;
}

export interface PropertyService {
  // From property_services table
  parcel_id: string;
  serviceCode: string;
  providerName: string;
  navigateURL?: string;
  serviceDesc: string;
  serviceDay: string;
}

export interface TaxRecord {
  // From property_tax_records table
  parcel_id: string;
  tax_year: number;
  market_percent: number;
  assessed_percent: number;
  show_flag: boolean;
  land_value: number;
  building_value: number;
  features_value: number;
  market_value: number;
  valuation_method: string;
  assessed_value: number;
  is_certified: boolean;
  is_homestead: boolean;
  is_ag: boolean;
  original_hx: number;
  additional_hx: number;
  other_exemptions: number;
  lis: number;
  soh_cap: number;
  tax_savings: number;
  has_benefits: boolean;
}

// Legacy interface for backward compatibility
export interface TaxHistoryIssue {
  parcel_id: string;
  tax_year: number;
  risk_score: number;
  potential_rent_income: number;
  estimated_renovation_cost: number;
}

// Comprehensive Mock Data with ALL Database Fields
export const mockPropertyData: Record<string, PropertyData> = {
  "12345": {
    parcel_id: "12345",
    county_id: "MIA001",
    tax_year: 2023,
    show_flag: true,
    owner_name: "Sarah Johnson",
    property_address: "1247 Ocean Drive",
    property_city: "Miami Beach",
    property_state: "FL",
    property_zip: "33139",
    country: "USA",
    street_number: "1247",
    street_name: "Ocean Drive",
    acreage: 0.15,
    sqft: 6534,
    assessed_value: 820000,
    occupancy_status: "Owner Occupied",
    current_market_value: 875000,
    potential_rent_income: 52000,
    estimated_eviction_cost: 3500,
    estimated_renovation_cost: 15000,
    risk_score: 25,
  },
  "67890": {
    parcel_id: "67890",
    county_id: "ORL002",
    tax_year: 2023,
    show_flag: true,
    owner_name: "Michael Chen",
    property_address: "456 Sunset Boulevard",
    property_city: "Orlando",
    property_state: "FL",
    property_zip: "32801",
    country: "USA", 
    street_number: "456",
    street_name: "Sunset Boulevard",
    acreage: 0.22,
    sqft: 9583,
    assessed_value: 398000,
    occupancy_status: "Investment Property",
    current_market_value: 425000,
    potential_rent_income: 28000,
    estimated_eviction_cost: 2800,
    estimated_renovation_cost: 8000,
    risk_score: 45,
  },
  "1234567890": {
    parcel_id: "1234567890",
    county_id: "TAM003",
    tax_year: 2023,
    show_flag: true,
    owner_name: "Emma Rodriguez",
    property_address: "789 Bay Shore Drive",
    property_city: "Tampa",
    property_state: "FL",
    property_zip: "33602",
    country: "USA",
    street_number: "789",
    street_name: "Bay Shore Drive",
    acreage: 0.18,
    sqft: 7840,
    assessed_value: 650000,
    occupancy_status: "Investment Property",
    current_market_value: 685000,
    potential_rent_income: 42000,
    estimated_eviction_cost: 3200,
    estimated_renovation_cost: 12000,
    risk_score: 35,
  },
  "0987654321": {
    parcel_id: "0987654321",
    county_id: "JAX004", 
    tax_year: 2023,
    show_flag: true,
    owner_name: "David Kim",
    property_address: "321 Riverside Avenue",
    property_city: "Jacksonville",
    property_state: "FL",
    property_zip: "32202",
    country: "USA",
    street_number: "321",
    street_name: "Riverside Avenue",
    acreage: 0.25,
    sqft: 10890,
    assessed_value: 485000,
    occupancy_status: "Owner Occupied",
    current_market_value: 520000,
    potential_rent_income: 35000,
    estimated_eviction_cost: 2900,
    estimated_renovation_cost: 9500,
    risk_score: 28,
  },
  "1122334455": {
    parcel_id: "1122334455",
    county_id: "FTL005",
    tax_year: 2023,
    show_flag: true,
    owner_name: "Lisa Thompson", 
    property_address: "555 Las Olas Boulevard",
    property_city: "Fort Lauderdale",
    property_state: "FL",
    property_zip: "33301",
    country: "USA",
    street_number: "555",
    street_name: "Las Olas Boulevard",
    acreage: 0.12,
    sqft: 5220,
    assessed_value: 890000,
    occupancy_status: "Investment Property",
    current_market_value: 925000,
    potential_rent_income: 58000,
    estimated_eviction_cost: 4000,
    estimated_renovation_cost: 18000,
    risk_score: 52,
  }
};

export const mockAdValoremTax: Record<string, AdValoremTax[]> = {
  "12345": [{
    parcel_id: "12345",
    tax_year: 2023,
    tax_type: "Real Estate",
    taxing_authority: "Miami-Dade County",
    assessed_value: 820000,
    exemption: 50000,
    tax_value: 9240,
    millage_rate: 12.5,
    previous_millage_rate: 12.2,
    millage_percent: 2.5,
    is_certified: true,
    is_homestead: true,
    taxes: 9240,
    rate_change_percent: 2.46,
  }],
  "67890": [{
    parcel_id: "67890",
    tax_year: 2023,
    tax_type: "Real Estate",
    taxing_authority: "Orange County",
    assessed_value: 398000,
    exemption: 0,
    tax_value: 6567,
    millage_rate: 16.5,
    previous_millage_rate: 15.8,
    millage_percent: 4.4,
    is_certified: true,
    is_homestead: false,
    taxes: 6567,
    rate_change_percent: 4.43,
  }],
  "1234567890": [{
    parcel_id: "1234567890",
    tax_year: 2023,
    tax_type: "Real Estate",
    taxing_authority: "Hillsborough County",
    assessed_value: 650000,
    exemption: 50000,
    tax_value: 8750,
    millage_rate: 14.6,
    previous_millage_rate: 14.1,
    millage_percent: 3.5,
    is_certified: true,
    is_homestead: false,
    taxes: 8750,
    rate_change_percent: 3.55,
  }],
  "0987654321": [{
    parcel_id: "0987654321",
    tax_year: 2023,
    tax_type: "Real Estate",
    taxing_authority: "Duval County",
    assessed_value: 485000,
    exemption: 50000,
    tax_value: 6090,
    millage_rate: 14.0,
    previous_millage_rate: 13.7,
    millage_percent: 2.2,
    is_certified: true,
    is_homestead: true,
    taxes: 6090,
    rate_change_percent: 2.19,
  }],
  "1122334455": [{
    parcel_id: "1122334455",
    tax_year: 2023,
    tax_type: "Real Estate",
    taxing_authority: "Broward County",
    assessed_value: 890000,
    exemption: 0,
    tax_value: 15830,
    millage_rate: 17.8,
    previous_millage_rate: 17.2,
    millage_percent: 3.5,
    is_certified: true,
    is_homestead: false,
    taxes: 15830,
    rate_change_percent: 3.49,
  }]
};

export const mockBuildingFeatures: Record<string, BuildingFeature[]> = {
  "12345": [
    { parcel_id: "12345", feature_code: "AC", feature_value: 15000, feature_description: "Central Air Conditioning" },
    { parcel_id: "12345", feature_code: "FP", feature_value: 8000, feature_description: "Fireplace" },
    { parcel_id: "12345", feature_code: "POOL", feature_value: 25000, feature_description: "Swimming Pool" },
  ],
  "67890": [
    { parcel_id: "67890", feature_code: "AC", feature_value: 12000, feature_description: "Central Air Conditioning" },
    { parcel_id: "67890", feature_code: "GAR", feature_value: 18000, feature_description: "2-Car Garage" },
  ]
};

export const mockBuildingSubareas: Record<string, BuildingSubarea[]> = {
  "12345": [
    { parcel_id: "12345", subarea_code: "LIV", sub_desc: "Living Area", sub_size: 1200, sub_value: 180000 },
    { parcel_id: "12345", subarea_code: "KIT", sub_desc: "Kitchen", sub_size: 300, sub_value: 45000 },
    { parcel_id: "12345", subarea_code: "BAT", sub_desc: "Bathrooms", sub_size: 200, sub_value: 30000 },
  ],
  "67890": [
    { parcel_id: "67890", subarea_code: "LIV", sub_desc: "Living Area", sub_size: 980, sub_value: 147000 },
    { parcel_id: "67890", subarea_code: "KIT", sub_desc: "Kitchen", sub_size: 250, sub_value: 37500 },
  ]
};

export const mockBuildings: Record<string, Building[]> = {
  "12345": [{
    parcel_id: "12345",
    building_id: "MAIN",
    building_num: 1,
    desc_model: "Contemporary Single Family",
    bldg_dor_code: "SF",
    desc_bldg: "Single Family Residence",
    bldg_value: 500000,
    est_new_cost: 720000,
    date_built: 1985,
    beds: 3,
    baths: 2,
    floors: 2,
    gross_area: 2100,
    living_area: 1920,
    ext_wall: "Concrete Block",
    int_wall: "Drywall",
    total_count: 1,
  }],
  "67890": [{
    parcel_id: "67890",
    building_id: "MAIN", 
    building_num: 1,
    desc_model: "Ranch Style Single Family",
    bldg_dor_code: "SF",
    desc_bldg: "Single Family Residence",
    bldg_value: 248000,
    est_new_cost: 380000,
    date_built: 1992,
    beds: 3,
    baths: 2,
    floors: 1,
    gross_area: 1680,
    living_area: 1580,
    ext_wall: "Frame",
    int_wall: "Drywall",
    total_count: 1,
  }],
  "1234567890": [{
    parcel_id: "1234567890",
    building_id: "MAIN",
    building_num: 1,
    desc_model: "Modern Single Family",
    bldg_dor_code: "SF",
    desc_bldg: "Single Family Residence",
    bldg_value: 420000,
    est_new_cost: 580000,
    date_built: 2005,
    beds: 4,
    baths: 3,
    floors: 2,
    gross_area: 2200,
    living_area: 2050,
    ext_wall: "Stucco",
    int_wall: "Drywall",
    total_count: 1,
  }],
  "0987654321": [{
    parcel_id: "0987654321",
    building_id: "MAIN",
    building_num: 1,
    desc_model: "Traditional Single Family",
    bldg_dor_code: "SF",
    desc_bldg: "Single Family Residence",
    bldg_value: 315000,
    est_new_cost: 460000,
    date_built: 1998,
    beds: 3,
    baths: 2,
    floors: 1,
    gross_area: 1850,
    living_area: 1720,
    ext_wall: "Brick",
    int_wall: "Drywall",
    total_count: 1,
  }],
  "1122334455": [{
    parcel_id: "1122334455",
    building_id: "MAIN",
    building_num: 1,
    desc_model: "Luxury Condo",
    bldg_dor_code: "CD",
    desc_bldg: "Condominium",
    bldg_value: 625000,
    est_new_cost: 850000,
    date_built: 2010,
    beds: 2,
    baths: 3,
    floors: 1,
    gross_area: 1650,
    living_area: 1520,
    ext_wall: "Glass/Steel",
    int_wall: "Premium Finishes",
    total_count: 1,
  }]
};

export const mockCommunity: Record<string, Community> = {
  "12345": {
    parcel_id: "12345",
    community_name: "Ocean Bay Estates",
    is_gated: true,
    is_mandatory: false,
    households_count: 245,
  },
  "67890": {
    parcel_id: "67890",
    community_name: "Sunset Gardens",
    is_gated: false,
    is_mandatory: false,
    households_count: 820,
  }
};

export const mockDemographics: Record<string, Demographics> = {
  "12345": {
    parcel_id: "12345",
    block_group_id: "BG12345",
    total_population: 87779,
    total_area: 15.2,
    population_density: 5775,
    diversity_index: 0.72,
    total_households: 42500,
    sfr_home_count: 28600,
    residential_condo_count: 13900,
    median_sfr_market_value: 785000,
    median_condo_market_value: 425000,
    median_sfr_living_area: 1850,
    median_condo_living_area: 1200,
  },
  "67890": {
    parcel_id: "67890",
    block_group_id: "BG67890", 
    total_population: 307573,
    total_area: 48.7,
    population_density: 6316,
    diversity_index: 0.68,
    total_households: 125000,
    sfr_home_count: 89500,
    residential_condo_count: 35500,
    median_sfr_market_value: 385000,
    median_condo_market_value: 285000,
    median_sfr_living_area: 1650,
    median_condo_living_area: 1100,
  },
  "1234567890": {
    parcel_id: "1234567890",
    block_group_id: "BG1234567890",
    total_population: 198543,
    total_area: 32.4,
    population_density: 6128,
    diversity_index: 0.75,
    total_households: 78200,
    sfr_home_count: 52000,
    residential_condo_count: 26200,
    median_sfr_market_value: 615000,
    median_condo_market_value: 385000,
    median_sfr_living_area: 1750,
    median_condo_living_area: 1150,
  },
  "0987654321": {
    parcel_id: "0987654321",
    block_group_id: "BG0987654321",
    total_population: 145680,
    total_area: 28.9,
    population_density: 5044,
    diversity_index: 0.63,
    total_households: 58400,
    sfr_home_count: 42800,
    residential_condo_count: 15600,
    median_sfr_market_value: 475000,
    median_condo_market_value: 325000,
    median_sfr_living_area: 1680,
    median_condo_living_area: 1050,
  },
  "1122334455": {
    parcel_id: "1122334455",
    block_group_id: "BG1122334455",
    total_population: 95234,
    total_area: 18.7,
    population_density: 5092,
    diversity_index: 0.81,
    total_households: 48500,
    sfr_home_count: 15200,
    residential_condo_count: 33300,
    median_sfr_market_value: 925000,
    median_condo_market_value: 675000,
    median_sfr_living_area: 2150,
    median_condo_living_area: 1450,
  }
};

export const mockPropertyDocuments: Record<string, PropertyDocument[]> = {
  "12345": [
    { parcel_id: "12345", doc_type: "Deed", doc_number: "DOC2023001", doc_date: "2023-01-15", file_url: "https://records.miami.gov/deed123", description: "Warranty Deed - Original Purchase" },
    { parcel_id: "12345", doc_type: "Survey", doc_number: "SUR2023045", doc_date: "2023-02-10", file_url: "https://records.miami.gov/survey123", description: "Professional Land Survey" },
    { parcel_id: "12345", doc_type: "Title Insurance", doc_number: "TI2023078", doc_date: "2023-01-12", file_url: "https://records.miami.gov/title123", description: "Owner's Title Insurance Policy" },
    { parcel_id: "12345", doc_type: "Appraisal", doc_number: "APR2023156", doc_date: "2023-03-05", file_url: "https://records.miami.gov/appraisal123", description: "Professional Property Appraisal" },
    { parcel_id: "12345", doc_type: "Inspection Report", doc_number: "INS2023089", doc_date: "2023-01-08", file_url: "https://records.miami.gov/inspection123", description: "Complete Home Inspection Report" },
  ],
  "67890": [
    { parcel_id: "67890", doc_type: "Deed", doc_number: "DOC2023789", doc_date: "2023-03-22", file_url: "https://records.orange.gov/deed789", description: "Quit Claim Deed" },
    { parcel_id: "67890", doc_type: "Survey", doc_number: "SUR2023234", doc_date: "2023-03-20", file_url: "https://records.orange.gov/survey789", description: "Boundary Survey" },
    { parcel_id: "67890", doc_type: "Environmental Report", doc_number: "ENV2023145", doc_date: "2023-03-18", file_url: "https://records.orange.gov/env789", description: "Environmental Assessment Report" },
  ]
};

export const mockExtraFeatures: Record<string, ExtraFeature[]> = {
  "12345": [
    { parcel_id: "12345", xfob_code: "DECK", desc_short: "Wooden Deck", xfob_qty: 1, xfob_value: 8500, date_built: 1985 },
    { parcel_id: "12345", xfob_code: "PATIO", desc_short: "Covered Patio", xfob_qty: 1, xfob_value: 12000, date_built: 1995 },
  ],
  "67890": [
    { parcel_id: "67890", xfob_code: "SHED", desc_short: "Storage Shed", xfob_qty: 1, xfob_value: 3500, date_built: 2000 },
  ]
};

export const mockPropertyImages: Record<string, PropertyImage[]> = {
  "12345": [
    { parcel_id: "12345", image_url: "https://placeholder.com/800x600/4f46e5/ffffff?text=Front+View", description: "Front Exterior View" },
    { parcel_id: "12345", image_url: "https://placeholder.com/800x600/059669/ffffff?text=Pool+Area", description: "Swimming Pool & Deck Area" },
    { parcel_id: "12345", image_url: "https://placeholder.com/800x600/dc2626/ffffff?text=Living+Room", description: "Main Living Room" },
    { parcel_id: "12345", image_url: "https://placeholder.com/800x600/7c3aed/ffffff?text=Kitchen", description: "Modern Kitchen" },
    { parcel_id: "12345", image_url: "https://placeholder.com/800x600/ea580c/ffffff?text=Master+Bedroom", description: "Master Bedroom Suite" },
    { parcel_id: "12345", image_url: "https://placeholder.com/800x600/0891b2/ffffff?text=Floor+Plan", description: "Property Floor Plan" },
  ],
  "67890": [
    { parcel_id: "67890", image_url: "https://placeholder.com/800x600/4f46e5/ffffff?text=Front+View", description: "Street Front View" },
    { parcel_id: "67890", image_url: "https://placeholder.com/800x600/059669/ffffff?text=Backyard", description: "Backyard Garden" },
    { parcel_id: "67890", image_url: "https://placeholder.com/800x600/dc2626/ffffff?text=Interior", description: "Interior Living Space" },
    { parcel_id: "67890", image_url: "https://placeholder.com/800x600/0891b2/ffffff?text=Floor+Plan", description: "Property Floor Plan" },
  ]
};

export const mockLandAreas: Record<string, LandArea> = {
  "12345": { parcel_id: "12345", acreage: 0.15, sqft: 6534 },
  "67890": { parcel_id: "67890", acreage: 0.22, sqft: 9583 }
};

export const mockLandFeatures: Record<string, LandFeature[]> = {
  "12345": [{
    parcel_id: "12345",
    landDorCode: "01",
    descShort: "Single Family Lot",
    zoning: "R-1",
    landQty: 6534,
    landQtyCode: "SF",
    unitPrice: 45,
    landValue: 320000,
    classUnitPrice: 45,
    classValue: 320000,
    totalCount: 1,
  }],
  "67890": [{
    parcel_id: "67890",
    landDorCode: "01", 
    descShort: "Single Family Lot",
    zoning: "R-2",
    landQty: 9583,
    landQtyCode: "SF",
    unitPrice: 28,
    landValue: 150000,
    classUnitPrice: 28,
    classValue: 150000,
    totalCount: 1,
  }]
};

export const mockLegalDescriptions: Record<string, LegalDescription> = {
  "12345": { parcel_id: "12345", description: "LOT 15, BLOCK 3, OCEAN BAY ESTATES, ACCORDING TO THE PLAT THEREOF AS RECORDED IN PLAT BOOK 87, PAGE 45, PUBLIC RECORDS OF MIAMI-DADE COUNTY, FLORIDA" },
  "67890": { parcel_id: "67890", description: "LOT 8, BLOCK 12, SUNSET GARDENS SUBDIVISION, ACCORDING TO THE PLAT THEREOF AS RECORDED IN PLAT BOOK 156, PAGE 23, PUBLIC RECORDS OF ORANGE COUNTY, FLORIDA" }
};

export const mockNeighborSales: Record<string, NeighborSale[]> = {
  "12345": [
    {
      parcel_id: "12345",
      neighbor_id: "12340",
      property_address: "1243 Ocean Drive", 
      sale_date: "2023-08-15",
      sale_price: 825000,
      deed_desc: "Warranty Deed",
      beds: 3,
      baths: 2,
      heated_area: 1850,
      instr_num: "20230815001",
      book: "15432",
      page: "123",
      total_count: 1,
    },
    {
      parcel_id: "12345",
      neighbor_id: "12350",
      property_address: "1251 Ocean Drive",
      sale_date: "2023-06-22", 
      sale_price: 950000,
      deed_desc: "Warranty Deed",
      beds: 4,
      baths: 3,
      heated_area: 2200,
      instr_num: "20230622001",
      book: "15401",
      page: "87",
      total_count: 1,
    }
  ],
  "67890": [
    {
      parcel_id: "67890",
      neighbor_id: "67885",
      property_address: "452 Sunset Boulevard",
      sale_date: "2023-09-10",
      sale_price: 410000,
      deed_desc: "Warranty Deed",
      beds: 3,
      baths: 2,
      heated_area: 1650,
      instr_num: "20230910001",
      book: "18765",
      page: "234",
      total_count: 1,
    }
  ],
  "1234567890": [
    {
      parcel_id: "1234567890",
      neighbor_id: "1234567885",
      property_address: "785 Bay Shore Drive",
      sale_date: "2023-07-20",
      sale_price: 695000,
      deed_desc: "Warranty Deed",
      beds: 4,
      baths: 3,
      heated_area: 2100,
      instr_num: "20230720001",
      book: "19234",
      page: "456",
      total_count: 1,
    },
    {
      parcel_id: "1234567890",  
      neighbor_id: "1234567895",
      property_address: "793 Bay Shore Drive",
      sale_date: "2023-05-12",
      sale_price: 670000,
      deed_desc: "Warranty Deed",
      beds: 3,
      baths: 2,
      heated_area: 1980,
      instr_num: "20230512001",
      book: "19201",
      page: "89",
      total_count: 1,
    }
  ],
  "0987654321": [
    {
      parcel_id: "0987654321",
      neighbor_id: "0987654316",
      property_address: "317 Riverside Avenue",
      sale_date: "2023-04-18",
      sale_price: 515000,
      deed_desc: "Warranty Deed",
      beds: 3,
      baths: 2,
      heated_area: 1750,
      instr_num: "20230418001",
      book: "20123",
      page: "345",
      total_count: 1,
    },
    {
      parcel_id: "0987654321",
      neighbor_id: "0987654326",
      property_address: "325 Riverside Avenue",
      sale_date: "2023-03-08",
      sale_price: 535000,
      deed_desc: "Warranty Deed",
      beds: 4,
      baths: 2,
      heated_area: 1920,
      instr_num: "20230308001",
      book: "20098",
      page: "567",
      total_count: 1,
    }
  ],
  "1122334455": [
    {
      parcel_id: "1122334455",
      neighbor_id: "1122334450",
      property_address: "551 Las Olas Boulevard",
      sale_date: "2023-10-15",
      sale_price: 935000,
      deed_desc: "Warranty Deed",
      beds: 2,
      baths: 2,
      heated_area: 1500,
      instr_num: "20231015001",
      book: "21456",
      page: "789",
      total_count: 1,
    },
    {
      parcel_id: "1122334455",
      neighbor_id: "1122334460",
      property_address: "559 Las Olas Boulevard",
      sale_date: "2023-08-28",
      sale_price: 910000,
      deed_desc: "Warranty Deed", 
      beds: 3,
      baths: 2,
      heated_area: 1620,
      instr_num: "20230828001",
      book: "21420",
      page: "234",
      total_count: 1,
    }
  ]
};

export const mockNonAdValoremTax: Record<string, NonAdValoremTax[]> = {
  "12345": [
    { parcel_id: "12345", tax_year: 2023, levying_authority: "Miami Beach CRA", description: "Community Redevelopment", units: 1, rate: 0.5, assessment: 410 },
    { parcel_id: "12345", tax_year: 2023, levying_authority: "Street Lighting District", description: "Street Lighting", units: 1, rate: 0.2, assessment: 164 },
  ],
  "67890": [
    { parcel_id: "67890", tax_year: 2023, levying_authority: "Orange County Fire", description: "Fire Protection", units: 1, rate: 0.8, assessment: 318 },
  ]
};

export const mockPropertyOfficials: Record<string, PropertyOfficial[]> = {
  "12345": [
    { parcel_id: "12345", official_id: "MAYOR001", official_name: "Dan Gelber", office_type_desc: "Mayor - Miami Beach" },
    { parcel_id: "12345", official_id: "COMM001", official_name: "Joy Malakoff", office_type_desc: "City Commissioner" },
  ],
  "67890": [
    { parcel_id: "67890", official_id: "MAYOR002", official_name: "Buddy Dyer", office_type_desc: "Mayor - Orlando" },
  ]
};

export const mockSalesRecords: Record<string, SalesRecord[]> = {
  "12345": [{
    parcel_id: "12345",
    sale_date: "2020-03-15",
    sale_amt: 765000,
    instr_num: "20200315001",
    book: "14876",
    page: "456",
    seller: "Johnson Family Trust",
    buyer: "Sarah Johnson",
    deed_desc: "Warranty Deed",
    vac_imp_code: "I",
  }],
  "67890": [{
    parcel_id: "67890",
    sale_date: "2019-11-22",
    sale_amt: 385000,
    instr_num: "20191122001",
    book: "17234",
    page: "789",
    seller: "Legacy Properties LLC",
    buyer: "Michael Chen",
    deed_desc: "Warranty Deed", 
    vac_imp_code: "I",
  }]
};

export const mockSchools: Record<string, School[]> = {
  "12345": [
    { parcel_id: "12345", school_id: "SCH001", school_name: "Miami Beach Elementary", school_type: "Elementary", school_phone: "(305) 672-7688", principal_name: "Maria Rodriguez", school_grades: "K-5" },
    { parcel_id: "12345", school_id: "SCH002", school_name: "Nautilus Middle School", school_type: "Middle", school_phone: "(305) 868-1463", principal_name: "James Wilson", school_grades: "6-8" },
    { parcel_id: "12345", school_id: "SCH003", school_name: "Miami Beach Senior High", school_type: "High", school_phone: "(305) 532-4515", principal_name: "Dr. Susan Martinez", school_grades: "9-12" },
  ],
  "67890": [
    { parcel_id: "67890", school_id: "SCH004", school_name: "Sunset Park Elementary", school_type: "Elementary", school_phone: "(407) 555-0123", principal_name: "Patricia Brown", school_grades: "K-5" },
    { parcel_id: "67890", school_id: "SCH005", school_name: "Colonial High School", school_type: "High", school_phone: "(407) 555-0456", principal_name: "Robert Davis", school_grades: "9-12" },
  ]
};

export const mockPropertyServices: Record<string, PropertyService[]> = {
  "12345": [
    { parcel_id: "12345", serviceCode: "WASTE", providerName: "Miami-Dade Waste Management", serviceDesc: "Garbage and Recycling Collection", serviceDay: "Tuesday/Friday" },
    { parcel_id: "12345", serviceCode: "WATER", providerName: "Miami-Dade Water", serviceDesc: "Water and Sewer Service", serviceDay: "Daily" },
    { parcel_id: "12345", serviceCode: "ELEC", providerName: "Florida Power & Light", serviceDesc: "Electrical Service", serviceDay: "Daily" },
  ],
  "67890": [
    { parcel_id: "67890", serviceCode: "WASTE", providerName: "Orange County Waste", serviceDesc: "Garbage Collection", serviceDay: "Monday/Thursday" },
    { parcel_id: "67890", serviceCode: "WATER", providerName: "City of Orlando Utilities", serviceDesc: "Water and Sewer", serviceDay: "Daily" },
  ]
};

export const mockTaxRecords: Record<string, TaxRecord[]> = {
  "12345": [{
    parcel_id: "12345",
    tax_year: 2023,
    market_percent: 100,
    assessed_percent: 93.7,
    show_flag: true,
    land_value: 320000,
    building_value: 500000,
    features_value: 48500,
    market_value: 875000,
    valuation_method: "Sales Comparison",
    assessed_value: 820000,
    is_certified: true,
    is_homestead: true,
    is_ag: false,
    original_hx: 50000,
    additional_hx: 0,
    other_exemptions: 0,
    lis: 0,
    soh_cap: 0,
    tax_savings: 8500,
    has_benefits: true,
  }],
  "67890": [{
    parcel_id: "67890",
    tax_year: 2023,
    market_percent: 100,
    assessed_percent: 93.6,
    show_flag: true,
    land_value: 150000,
    building_value: 248000,
    features_value: 30000,
    market_value: 425000,
    valuation_method: "Cost Approach",
    assessed_value: 398000,
    is_certified: true,
    is_homestead: false,
    is_ag: false,
    original_hx: 0,
    additional_hx: 0,
    other_exemptions: 0,
    lis: 0,
    soh_cap: 0,
    tax_savings: 0,
    has_benefits: false,
  }],
  "1234567890": [{
    parcel_id: "1234567890",
    tax_year: 2023,
    market_percent: 100,
    assessed_percent: 94.9,
    show_flag: true,
    land_value: 230000,
    building_value: 420000,
    features_value: 35000,
    market_value: 685000,
    valuation_method: "Sales Comparison",
    assessed_value: 650000,
    is_certified: true,
    is_homestead: false,
    is_ag: false,
    original_hx: 0,
    additional_hx: 0,
    other_exemptions: 0,
    lis: 0,
    soh_cap: 0,
    tax_savings: 0,
    has_benefits: false,
  }],
  "0987654321": [{
    parcel_id: "0987654321",
    tax_year: 2023,
    market_percent: 100,
    assessed_percent: 93.3,
    show_flag: true,
    land_value: 170000,
    building_value: 315000,
    features_value: 35000,
    market_value: 520000,
    valuation_method: "Sales Comparison",
    assessed_value: 485000,
    is_certified: true,
    is_homestead: true,
    is_ag: false,
    original_hx: 50000,
    additional_hx: 0,
    other_exemptions: 0,
    lis: 0,
    soh_cap: 0,
    tax_savings: 7800,
    has_benefits: true,
  }],
  "1122334455": [{
    parcel_id: "1122334455",
    tax_year: 2023,
    market_percent: 100,
    assessed_percent: 96.2,
    show_flag: true,
    land_value: 265000,
    building_value: 625000,
    features_value: 35000,
    market_value: 925000,
    valuation_method: "Sales Comparison",
    assessed_value: 890000,
    is_certified: true,
    is_homestead: false,
    is_ag: false,
    original_hx: 0,
    additional_hx: 0,
    other_exemptions: 0,
    lis: 0,
    soh_cap: 0,
    tax_savings: 0,
    has_benefits: false,
  }]
};

// Climate Risk Mock Data
export const mockClimateRisk: Record<string, ClimateRisk> = {
  "12345": {
    parcel_id: "12345",
    flood_risk: 35,
    fire_risk: 15,
    storm_risk: 45,
    heat_risk: 25,
    overall_climate_score: 30,
    fema_flood_zone: "AE",
    wildfire_risk_level: "Low",
    hurricane_zone: "Zone 1",
  },
  "67890": {
    parcel_id: "67890",
    flood_risk: 60,
    fire_risk: 30,
    storm_risk: 40,
    heat_risk: 55,
    overall_climate_score: 46,
    fema_flood_zone: "X",
    wildfire_risk_level: "Moderate",
    hurricane_zone: "Zone 2",
  },
  "1234567890": {
    parcel_id: "1234567890",
    flood_risk: 25,
    fire_risk: 20,
    storm_risk: 35,
    heat_risk: 30,
    overall_climate_score: 28,
    fema_flood_zone: "AE",
    wildfire_risk_level: "Low",
    hurricane_zone: "Zone 1",
  },
  "0987654321": {
    parcel_id: "0987654321",
    flood_risk: 40,
    fire_risk: 25,
    storm_risk: 30,
    heat_risk: 35,
    overall_climate_score: 33,
    fema_flood_zone: "X",
    wildfire_risk_level: "Moderate",
    hurricane_zone: "Zone 1",
  },
  "1122334455": {
    parcel_id: "1122334455",
    flood_risk: 70,
    fire_risk: 10,
    storm_risk: 55,
    heat_risk: 40,
    overall_climate_score: 44,
    fema_flood_zone: "VE",
    wildfire_risk_level: "Very Low",
    hurricane_zone: "Zone 1",
  }
};

// Historical Market Data for Sparklines
export interface MarketHistory {
  parcel_id: string;
  historical_values: Array<{
    date: string;
    market_value: number;
    risk_score: number;
  }>;
}

export const mockMarketHistory: Record<string, MarketHistory> = {
  "12345": {
    parcel_id: "12345",
    historical_values: [
      { date: "2023-01", market_value: 820000, risk_score: 28 },
      { date: "2023-02", market_value: 825000, risk_score: 27 },
      { date: "2023-03", market_value: 830000, risk_score: 26 },
      { date: "2023-04", market_value: 835000, risk_score: 25 },
      { date: "2023-05", market_value: 845000, risk_score: 24 },
      { date: "2023-06", market_value: 850000, risk_score: 25 },
      { date: "2023-07", market_value: 860000, risk_score: 24 },
      { date: "2023-08", market_value: 865000, risk_score: 25 },
      { date: "2023-09", market_value: 870000, risk_score: 25 },
      { date: "2023-10", market_value: 875000, risk_score: 25 },
      { date: "2023-11", market_value: 875000, risk_score: 25 },
      { date: "2023-12", market_value: 875000, risk_score: 25 }
    ]
  },
  "67890": {
    parcel_id: "67890",
    historical_values: [
      { date: "2023-01", market_value: 395000, risk_score: 48 },
      { date: "2023-02", market_value: 400000, risk_score: 47 },
      { date: "2023-03", market_value: 405000, risk_score: 46 },
      { date: "2023-04", market_value: 410000, risk_score: 46 },
      { date: "2023-05", market_value: 415000, risk_score: 45 },
      { date: "2023-06", market_value: 418000, risk_score: 45 },
      { date: "2023-07", market_value: 420000, risk_score: 45 },
      { date: "2023-08", market_value: 422000, risk_score: 45 },
      { date: "2023-09", market_value: 424000, risk_score: 45 },
      { date: "2023-10", market_value: 425000, risk_score: 45 },
      { date: "2023-11", market_value: 425000, risk_score: 45 },
      { date: "2023-12", market_value: 425000, risk_score: 45 }
    ]
  }
};

// Legacy compatibility - map new data to old interfaces
export const mockTaxHistoryIssues: Record<string, TaxHistoryIssue[]> = {
  "12345": [{
    parcel_id: "12345",
    tax_year: 2023,
    risk_score: 25,
    potential_rent_income: 52000,
    estimated_renovation_cost: 15000,
  }],
  "67890": [{
    parcel_id: "67890", 
    tax_year: 2023,
    risk_score: 45,
    potential_rent_income: 28000,
    estimated_renovation_cost: 8000,
  }],
  "1234567890": [{
    parcel_id: "1234567890",
    tax_year: 2023,
    risk_score: 35,
    potential_rent_income: 42000,
    estimated_renovation_cost: 12000,
  }],
  "0987654321": [{
    parcel_id: "0987654321",
    tax_year: 2023,
    risk_score: 28,
    potential_rent_income: 35000,
    estimated_renovation_cost: 9500,
  }],
  "1122334455": [{
    parcel_id: "1122334455",
    tax_year: 2023,
    risk_score: 52,
    potential_rent_income: 58000,
    estimated_renovation_cost: 18000,
  }]
};

// Comprehensive Mock API Functions for ALL Database Tables
export const mockFetchProperty = async (parcelId: string): Promise<PropertyData | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockPropertyData[parcelId] || null;
};

export const mockFetchAdValoremTax = async (parcelId: string): Promise<AdValoremTax[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockAdValoremTax[parcelId] || [];
};

export const mockFetchBuildingFeatures = async (parcelId: string): Promise<BuildingFeature[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockBuildingFeatures[parcelId] || [];
};

export const mockFetchBuildingSubareas = async (parcelId: string): Promise<BuildingSubarea[]> => {
  await new Promise(resolve => setTimeout(resolve, 450));
  return mockBuildingSubareas[parcelId] || [];
};

export const mockFetchBuildings = async (parcelId: string): Promise<Building[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockBuildings[parcelId] || [];
};

export const mockFetchCommunity = async (parcelId: string): Promise<Community | null> => {
  await new Promise(resolve => setTimeout(resolve, 350));
  return mockCommunity[parcelId] || null;
};

export const mockFetchDemographics = async (parcelId: string): Promise<Demographics | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDemographics[parcelId] || null;
};

export const mockFetchPropertyDocuments = async (parcelId: string): Promise<PropertyDocument[]> => {
  await new Promise(resolve => setTimeout(resolve, 650));
  return mockPropertyDocuments[parcelId] || [];
};

export const mockFetchPropertyImages = async (parcelId: string): Promise<PropertyImage[]> => {
  await new Promise(resolve => setTimeout(resolve, 750));
  return mockPropertyImages[parcelId] || [];
};

export const mockFetchLandAreas = async (parcelId: string): Promise<LandArea | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLandAreas[parcelId] || null;
};

export const mockFetchLandFeatures = async (parcelId: string): Promise<LandFeature[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockLandFeatures[parcelId] || [];
};

export const mockFetchLegalDescriptions = async (parcelId: string): Promise<LegalDescription | null> => {
  await new Promise(resolve => setTimeout(resolve, 350));
  return mockLegalDescriptions[parcelId] || null;
};

export const mockFetchNeighborSales = async (parcelId: string): Promise<NeighborSale[]> => {
  await new Promise(resolve => setTimeout(resolve, 900));
  return mockNeighborSales[parcelId] || [];
};

export const mockFetchNonAdValoremTax = async (parcelId: string): Promise<NonAdValoremTax[]> => {
  await new Promise(resolve => setTimeout(resolve, 550));
  return mockNonAdValoremTax[parcelId] || [];
};

export const mockFetchPropertyOfficials = async (parcelId: string): Promise<PropertyOfficial[]> => {
  await new Promise(resolve => setTimeout(resolve, 450));
  return mockPropertyOfficials[parcelId] || [];
};

export const mockFetchSalesRecords = async (parcelId: string): Promise<SalesRecord[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockSalesRecords[parcelId] || [];
};

export const mockFetchSchools = async (parcelId: string): Promise<School[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSchools[parcelId] || [];
};

export const mockFetchPropertyServices = async (parcelId: string): Promise<PropertyService[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockPropertyServices[parcelId] || [];
};

export const mockFetchTaxRecords = async (parcelId: string): Promise<TaxRecord[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockTaxRecords[parcelId] || [];
};

export const mockFetchTaxHistoryIssues = async (parcelId: string): Promise<TaxHistoryIssue[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return mockTaxHistoryIssues[parcelId] || [];
};

export const mockFetchClimateRisk = async (parcelId: string): Promise<ClimateRisk | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockClimateRisk[parcelId] || null;
};

export const mockFetchMarketHistory = async (parcelId: string): Promise<MarketHistory | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockMarketHistory[parcelId] || null;
};

// Legacy compatibility functions
export const mockFetchBuilding = async (parcelId: string): Promise<Building | null> => {
  const buildings = await mockFetchBuildings(parcelId);
  return buildings[0] || null;
};

// Calculated Analytics
export interface PropertyAnalytics {
  // New calculated fields for reports
  financialRiskScore: number;
  socialRiskScore: number;
  climateRiskScore: number;
  overallRiskScore: number;
  potentialROI: number;
  neighborBenchmark: number;
  aiNarrative: string;
  actionableRecommendations: string[];
}

export const calculatePropertyAnalytics = (
  property: PropertyData,
  taxRecords: TaxRecord[],
  taxIssues: TaxHistoryIssue[],
  neighborSales: NeighborSale[],
  demographics: Demographics | null,
  building: Building | null,
  climateRisk: ClimateRisk | null = null
): PropertyAnalytics => {
  const currentTax = taxRecords[0];
  const currentIssue = taxIssues[0];
  
  // Financial Risk Score (0-100)
  const taxRate = currentTax ? (currentTax.assessed_value * 0.012) / currentTax.assessed_value * 100 : 50;
  const financialRiskScore = Math.min(100, Math.max(0, 
    (taxRate * 2) + 
    (currentTax?.is_homestead ? -10 : 10) +
    (currentIssue?.risk_score || 0)
  ));
  
  // Social Risk Score
  const diversityScore = demographics ? (1 - demographics.diversity_index) * 100 : 50;
  const socialRiskScore = Math.min(100, Math.max(0, diversityScore));
  
  // Climate Risk Score
  const climateRiskScore = climateRisk ? climateRisk.overall_climate_score : 30;
  
  // Overall Risk (weighted average)
  const w1 = 0.4; // Financial weight
  const w2 = 0.3; // Social weight  
  const w3 = 0.3; // Climate weight
  const overallRiskScore = (w1 * financialRiskScore + w2 * socialRiskScore + w3 * climateRiskScore) / (w1 + w2 + w3);
  
  // Potential ROI
  const annualRent = currentIssue?.potential_rent_income || 0;
  const potentialROI = property.current_market_value > 0 ? 
    (annualRent / property.current_market_value) * 100 : 0;
  
  // Neighbor Benchmark
  const avgNeighborPrice = neighborSales.length > 0 ? 
    neighborSales.reduce((sum, sale) => sum + sale.sale_price, 0) / neighborSales.length : 0;
  const neighborBenchmark = avgNeighborPrice > 0 ? 
    ((property.current_market_value - avgNeighborPrice) / avgNeighborPrice) * 100 : 0;
  
  // AI Narrative (simulated)
  const riskLevel = overallRiskScore < 30 ? "Low" : overallRiskScore < 60 ? "Moderate" : "High";
  const roiLevel = potentialROI > 8 ? "Excellent" : potentialROI > 5 ? "Good" : "Fair";
  
  const aiNarrative = `${riskLevel} risk property with ${roiLevel} investment potential. ${
    currentTax?.is_homestead ? "Homestead exemption provides tax stability." : "No homestead protection increases tax risk."
  } Market position is ${neighborBenchmark > 0 ? "above" : "below"} neighborhood average by ${Math.abs(neighborBenchmark).toFixed(1)}%.`;
  
  // Actionable Recommendations
  const recommendations: string[] = [];
  
  if (financialRiskScore > 60) {
    recommendations.push("Consider appealing property tax assessment - current rate appears elevated");
  }
  if (potentialROI > 6) {
    recommendations.push("Strong rental potential - consider investment strategy");
  }
  if (neighborBenchmark < -10) {
    recommendations.push("Property undervalued vs neighbors - potential appreciation opportunity");
  }
  if (!currentTax?.is_homestead && property.owner_name) {
    recommendations.push("Apply for homestead exemption to reduce tax burden");
  }
  
  return {
    financialRiskScore,
    socialRiskScore,
    climateRiskScore,
    overallRiskScore,
    potentialROI,
    neighborBenchmark,
    aiNarrative,
    actionableRecommendations: recommendations,
  };
};