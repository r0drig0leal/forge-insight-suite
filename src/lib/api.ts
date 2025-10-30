// ROI Potential (centralizado para uso em hooks e integração)
export interface PropertyRoiPotential {
  parcel_id: string;
  potential_rent_income: number;
  estimated_renovation_cost: number;
  estimated_eviction_cost: number;
  market_value: number;
  net_annual_income: number;
  roi_potential_percent: number;
  range_low: number;
  range_high: number;
  calculated_at: string;
  num_comps: number;
  market_position_score?: number; // percentual (ex: 7.5)
  market_position?: string; // legacy string, fallback
  market_position_vs_neighborhood_percent?: number;
  market_position_vs_neighborhood_label?: string;
  risk_category?: string;
}
// --- New Types for Additional Property Resources ---
export interface PropertyBuildingFeature {
  parcel_id: string;
  feature_code: string;
  feature_value: string;
  feature_description: string;
}

export interface PropertyBuildingSubarea {
  parcel_id: string;
  subarea_code: string;
  sub_desc: string;
  sub_size: number;
  sub_value: number;
}

export interface PropertyExtraFeature {
  parcel_id: string;
  xfob_code: string;
  desc_short: string;
  xfob_qty: number;
  xfob_value: number;
  date_built: string;
}

export interface PropertyLandArea {
  parcel_id: string;
  acreage: number;
  sqft: number;
  instr_num: string;
}

export interface PropertyLandFeature {
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
}

export interface PropertyLegalDescription {
  parcel_id: string;
  description: string;
}

export interface PropertyNeighborSale {
  parcel_id: string;
  neighbor_id: string;
  property_address: string;
  sale_date: string;
  sale_price: number;
  heated_area: number;
  deed_desc: string;
  beds: number;
  baths: number;
  instr_num: string;
  book: string;
  page: string;
  total_count: number;
}

export interface PropertyNonAdValoremTax {
  parcel_id: string;
  tax_year: number;
  tax_type: string;
  amount: number;
  description: string;
}

export interface PropertyService {
  parcel_id: string;
  serviceCode: string;
  providerName: string;
  navigateURL: string;
  serviceDesc: string;
  serviceDay: string;
}
/**
 * API Configuration and utilities
 */

import { ENV_CONFIG, isDebugMode } from '@/lib/env';
import { API_BASE_URL } from './apiConfig';
import type { Request, Response } from 'express';

// API Endpoints (constantes)
export const API_ENDPOINTS = {
  ADDRESS_SEARCH: '/api/address',
  PARCEL_ID_BY_ADDRESS: '/api/parcel-id-by-address',
  PARCEL_ID_STATUS: '/api/parcel-id-status',
  PROPERTY_LOCATION: '/api/property_location',
  AUCTIONS: '/api/auctions',
  PROPERTY_TAX_RECORDS: '/api/property_tax_records',
  PROPERTY_BUILDINGS: '/api/property_buildings',
  PROPERTY_FLOOD_RISK: '/api/property_flood_risk',
  PROPERTY_SALES_RECORDS: '/api/property_sales_records',
  PROPERTY_DEMOGRAPHICS: '/api/property_demographics',
  PROPERTY_SCHOOLS: '/api/property_schools',
  PROPERTY_DISASTERS_RISKS: '/api/property_disasters_risks',
};

// API Headers (constante)
export const API_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Authorization': `Bearer ${ENV_CONFIG.API.AUTH.BEARER_TOKEN}`,
  'x-api-key': ENV_CONFIG.API.AUTH.API_KEY,
  'Accept': 'application/json',
  'Accept-Charset': 'utf-8',
};

// API Timeout (constante)
export const API_TIMEOUT = ENV_CONFIG.API.TIMEOUT;

// Types
export interface AddressSearchResult {
  id: string;
  address: string;
  address_display?: string; // What the backend actually returns
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  formattedAddress?: string;
  data_internal?: {
    parcel_id?: string;
    parcelId?: string;
    apn?: string;
    pin?: string;
    id?: string;
    [key: string]: unknown; // For other potential fields
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Backend response structure
export interface AddressSearchResponse {
  suggestions: AddressSearchResult[];
}

// Parcel ID response - agora retorna parcel_id imediatamente
export interface ParcelIdResponse {
  parcel_id: string;
  message?: string;
}

// Status response - para polling do status do processamento
export interface ParcelIdStatusResponse {
  parcel_id: string;
  status: "running" | "completed" | "failed" | "not_found";
  message?: string;
  progress?: number; // 0-100 percentage
  current_script?: string; // Script being executed
  total_scripts?: number; // Total number of scripts (11)
  completed_at?: string; // Timestamp when completed
}

// Property data interfaces based on database schema
export interface Property {
  parcel_id: string;
  parcel_id2?: string;
  parcel_url?: string;
  county_id: number;
  tax_year?: number;
  owner_name?: string;
  property_name?: string;
  property_address?: string;
  mail_address?: string;
  mail_city?: string;
  mail_state?: string;
  mail_zip?: string;
  property_city?: string;
  property_state?: string;
  property_zip?: string;
  dor_code?: string;
  dor_description?: string;
  street_number?: number;
  street_name?: string;
  acreage?: number;
  sqft?: number;
  assessed_value?: number;
  occupancy_status?: string;
  current_market_value?: number;
  potential_rent_income?: number;
  estimated_eviction_cost?: number;
  estimated_renovation_cost?: number;
  risk_score?: number;
  beds?: number;
  baths?: number;
}

export interface PropertyLocation {
  id: number;
  parcel_id: string;
  latitude: number;
  longitude: number;
  googlemaps: string;
}

export interface PropertyTaxRecord {
  parcel_id: string;
  tax_year: number;
  market_percent?: number;
  assessed_percent?: number;
  show_flag?: boolean;
  land_value?: number;
  building_value?: number;
  features_value?: number;
  market_value?: number;
  valuation_method?: string;
  assessed_value?: number;
  is_certified?: boolean;
  is_homestead?: boolean | string;
  is_ag?: boolean | string;
  original_hx?: number;
  additional_hx?: number;
  other_exemptions?: number;
  lis?: number;
  soh_cap?: number;
  tax_savings?: number;
  has_benefits?: boolean;
}

export interface PropertyBuilding {
  parcel_id: string;
  building_id: number;
  building_num: number;
  model?: string;
  desc_model?: string;
  bldg_dor_code?: string;
  desc_bldg?: string;
  bldg_value?: number;
  date_built?: string;
  beds?: number;
  baths?: number;
  floors?: number;
  gross_area?: number;
  living_area?: number;
  ext_wall?: string;
  int_wall?: string;
}

export interface PropertyFloodRisk {
  parcel_id: string;
  fld_zone?: string;
  sfha_tf?: string;
  zone_subty?: string;
  firm_pan: string;
  eff_date?: string;
  comm_name?: string;
}

export interface PropertySalesRecord {
  parcel_id: string;
  sale_date: string;
  sale_amt?: number;
  instr_num?: string;
  book?: string;
  page?: string;
  seller?: string;
  buyer?: string;
  deed_desc?: string;
}

export interface PropertyDemographics {
  parcel_id: string;
  block_group_id: string;
  total_population?: number;
  total_area?: number;
  population_density?: number;
  diversity_index?: number;
  total_households?: number;
  median_sfr_market_value?: number;
  median_condo_market_value?: number;
}

export interface PropertySchool {
  parcel_id: string;
  school_id?: number;
  school_name: string;
  school_type?: string;
  school_phone?: string;
  principal_name?: string;
  school_grades?: string;
}

export interface PropertyDisasterRisk {
  parcel_id: string;
  fire_value?: number;
  fire_score?: number;
  fire_rating?: string;
  tornado_value?: number;
  tornado_score?: number;
  tornado_rating?: string;
  hurricane_value?: number;
  hurricane_score?: number;
  hurricane_rating?: string;
}

// Complete property data structure
// Unified CompletePropertyData for compatibility with exportUtils and CompleteReport
import type { PropertyData, TaxRecord, TaxHistoryIssue, NeighborSale, Demographics, Building, PropertyAnalytics, AdValoremTax, BuildingFeature, BuildingSubarea, Community, PropertyDocument, ExtraFeature, PropertyImage, LandArea, LandFeature, LegalDescription, NonAdValoremTax, PropertyOfficial, SalesRecord, School } from './mockData';

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

// API Client class
class ApiClient {
  // --- New Methods for Additional Property Resources ---

  async getPropertyBuildingFeatures(parcelId: string) {
    const endpoint = `/api/property_building_features/${encodeURIComponent(parcelId)}`;
    return this.request<PropertyBuildingFeature[]>(endpoint);
  }

  async addPropertyBuildingFeature(data: PropertyBuildingFeature) {
    const endpoint = `/api/property_building_features`;
    return this.request<PropertyBuildingFeature>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPropertyBuildingSubareas(parcelId: string) {
    const endpoint = `/api/property_building_subareas/${encodeURIComponent(parcelId)}`;
    return this.request<PropertyBuildingSubarea[]>(endpoint);
  }

  async addPropertyBuildingSubarea(data: PropertyBuildingSubarea) {
    const endpoint = `/api/property_building_subareas`;
    return this.request<PropertyBuildingSubarea>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPropertyExtraFeatures(parcelId: string) {
    const endpoint = `/api/property_extra_features/${encodeURIComponent(parcelId)}`;
    return this.request<PropertyExtraFeature[]>(endpoint);
  }

  async addPropertyExtraFeature(data: PropertyExtraFeature) {
    const endpoint = `/api/property_extra_features`;
    return this.request<PropertyExtraFeature>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPropertyLandAreas(parcelId: string) {
    const endpoint = `/api/property_land_areas/${encodeURIComponent(parcelId)}`;
    return this.request<PropertyLandArea[]>(endpoint);
  }

  async addPropertyLandArea(data: PropertyLandArea) {
    const endpoint = `/api/property_land_areas`;
    return this.request<PropertyLandArea>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPropertyLandFeatures(parcelId: string) {
    const endpoint = `/api/property_land_features/${encodeURIComponent(parcelId)}`;
    return this.request<PropertyLandFeature[]>(endpoint);
  }

  async addPropertyLandFeature(data: PropertyLandFeature) {
    const endpoint = `/api/property_land_features`;
    return this.request<PropertyLandFeature>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPropertyLegalDescriptions(parcelId: string) {
    const endpoint = `/api/property_legal_descriptions/${encodeURIComponent(parcelId)}`;
    return this.request<PropertyLegalDescription[]>(endpoint);
  }

  async addPropertyLegalDescription(data: PropertyLegalDescription) {
    const endpoint = `/api/property_legal_descriptions`;
    return this.request<PropertyLegalDescription>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPropertyNeighborSales(parcelId: string) {
    const endpoint = `/api/property_neighbor_sales/${encodeURIComponent(parcelId)}`;
    return this.request<PropertyNeighborSale[]>(endpoint);
  }

  async addPropertyNeighborSale(data: PropertyNeighborSale) {
    const endpoint = `/api/property_neighbor_sales`;
    return this.request<PropertyNeighborSale>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPropertyNonAdValoremTax(parcelId: string) {
    const endpoint = `/api/property_non_ad_valorem_tax/${encodeURIComponent(parcelId)}`;
    return this.request<PropertyNonAdValoremTax[]>(endpoint);
  }

  async addPropertyNonAdValoremTax(data: PropertyNonAdValoremTax) {
    const endpoint = `/api/property_non_ad_valorem_tax`;
    return this.request<PropertyNonAdValoremTax>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPropertyServices(parcelId: string) {
    const endpoint = `/api/property_services/${encodeURIComponent(parcelId)}`;
    return this.request<PropertyService[]>(endpoint);
  }

  async addPropertyService(data: PropertyService) {
    const endpoint = `/api/property_services`;
    return this.request<PropertyService>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.defaultHeaders = API_HEADERS;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log('🌐 DETAILED DEBUG: Making request to:', url);
    console.log('🌐 DETAILED DEBUG: Base URL:', this.baseUrl);
    console.log('🌐 DETAILED DEBUG: Endpoint:', endpoint);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
  signal: AbortSignal.timeout(API_TIMEOUT),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (isDebugMode()) {
        console.log('API Response:', { url, status: response.status, data });
      }
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      if (isDebugMode()) {
        console.error('API Request failed:', { url, error });
      }
      
      return {
        success: false,
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Address search method
  async searchAddresses(query: string): Promise<ApiResponse<AddressSearchResult[]>> {
    if (!query.trim()) {
      return {
        success: true,
        data: [],
      };
    }

    const trimmedQuery = query.trim();
    console.log('🔍 Original query:', trimmedQuery);
    console.log('🔍 Query contains accents:', /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i.test(trimmedQuery));
    
    const encodedQuery = encodeURIComponent(trimmedQuery);
    console.log('🔍 Encoded query:', encodedQuery);
    
  const endpoint = `${API_ENDPOINTS.ADDRESS_SEARCH}?search=${encodedQuery}`;
  console.log('🌐 Full endpoint URL:', `${API_BASE_URL}${endpoint}`);
    
    const response = await this.request<AddressSearchResponse>(endpoint);
    
    console.log('📊 Address search response:', response);
    
    if (response.success && response.data?.suggestions) {
      console.log('✅ Found', response.data.suggestions.length, 'suggestions');
      return {
        success: true,
        data: response.data.suggestions,
      };
    }
    
    console.log('⚠️ No suggestions found or error occurred');
    return {
      success: response.success,
      data: [],
      error: response.error,
    };
  }

  // Get parcel ID by address - agora retorna parcel_id imediatamente e inicia processamento
  async getParcelIdByAddress(address: string): Promise<ApiResponse<ParcelIdResponse>> {
    if (!address.trim()) {
      return {
        success: false,
        data: { parcel_id: "", message: "Address is required" },
        error: 'Address is required',
      };
    }

    const trimmedAddress = address.trim();
    console.log('🏠 Sending address to backend (before comma):', trimmedAddress);

  const endpoint = `${API_ENDPOINTS.PARCEL_ID_BY_ADDRESS}?address=${encodeURIComponent(trimmedAddress)}`;
  console.log('🌐 Full URL:', `${API_BASE_URL}${endpoint}`);
    
    try {
      const response = await this.request<ParcelIdResponse>(endpoint);
      
      if (response.success && response.data?.parcel_id) {
        console.log('✅ Received parcel ID:', response.data.parcel_id);
        console.log('🚀 Backend started Redis processing');
        return {
          success: true,
          data: response.data,
        };
      }
      
      return {
        success: response.success,
        data: { parcel_id: "", message: "Failed to get parcel ID" },
        error: response.error || 'Parcel ID not found',
      };
    } catch (error) {
      console.error('❌ Parcel ID API call failed:', error);
      return {
        success: false,
        data: { parcel_id: "", message: "API call failed" },
        error: error instanceof Error ? error.message : 'Failed to get parcel ID',
      };
    }
  }

  // Check status of parcel ID processing - para polling
  async getParcelIdStatus(parcelId: string): Promise<ApiResponse<ParcelIdStatusResponse>> {
    if (!parcelId.trim()) {
      return {
        success: false,
        data: { parcel_id: "", status: "failed", message: "Parcel ID is required" },
        error: 'Parcel ID is required',
      };
    }

  const endpoint = `${API_ENDPOINTS.PARCEL_ID_STATUS}?parcel_id=${encodeURIComponent(parcelId)}`;
    
    try {
      console.log('🔄 Checking status for parcel ID:', parcelId);
      const response = await this.request<ParcelIdStatusResponse>(endpoint);
      
      if (response.success && response.data) {
        console.log('📊 Status response:', response.data);
        return {
          success: true,
          data: response.data,
        };
      }
      
      return {
        success: response.success,
        data: { parcel_id: parcelId, status: "failed", message: "Failed to get status" },
        error: response.error || 'Failed to get status',
      };
    } catch (error) {
      console.error('❌ Status check failed:', error);
      return {
        success: false,
        data: { parcel_id: parcelId, status: "failed", message: "Status check failed" },
        error: error instanceof Error ? error.message : 'Failed to check status',
      };
    }
  }

  // Get all property data by parcel ID

  async getProperty(parcelId: string): Promise<ApiResponse<Property>> {
    const endpoint = `/api/property/${encodeURIComponent(parcelId)}`;
    return this.request<Property>(endpoint);
  }

  async getPropertyData(parcelId: string) {
    if (!parcelId.trim()) {
      return {
        success: false,
        data: null,
        error: 'Parcel ID is required',
      };
    }

    try {
      console.log('🔍 API: Getting all property data for parcel:', parcelId);

      // Execute all API calls in parallel for better performance
      const [
        location,
        propertyResp,
        taxRecordsResp,
        buildingsResp,
        floodRiskResp,
        salesRecordsResp,
        demographicsResp,
        schoolsResp,
        disasterRisksResp
      ] = await Promise.all([
        this.getPropertyLocation(parcelId),
        this.getProperty(parcelId),
        this.getPropertyTaxRecords(parcelId),
        this.getPropertyBuildings(parcelId),
        this.getPropertyFloodRisk(parcelId),
        this.getPropertySalesRecords(parcelId),
        this.getPropertyDemographics(parcelId),
        this.getPropertySchools(parcelId),
        this.getPropertyDisasterRisks(parcelId)
      ]);


      // Defensive: always provide valid arrays and objects

      // --- Utility mapping functions ---
      function mapPropertyToPropertyData(p: unknown, fallbackParcelId: string): import("./mockData").PropertyData {
        const obj = p as { [key: string]: unknown };
        function safeNumber(val: unknown): number {
          if (typeof val === 'number' && !isNaN(val)) return val;
          if (typeof val === 'string' && val.trim() !== '' && !isNaN(Number(val))) return Number(val);
          return 0;
        }
        console.log('[DEBUG] Raw property data:', obj);
  return {
          parcel_id: typeof obj.parcel_id === 'string' ? obj.parcel_id : fallbackParcelId,
          parcel_id2: typeof obj.parcel_id2 === 'string' ? obj.parcel_id2 : '',
          parcel_url: typeof obj.parcel_url === 'string' ? obj.parcel_url : '',
          county_id: typeof obj.county_id === 'string' ? obj.county_id : (typeof obj.county_id === 'number' ? String(obj.county_id) : ''),
          tax_year: typeof obj.tax_year === 'number' ? obj.tax_year : 2023,
          prc_tax_year: typeof obj.prc_tax_year === 'number' ? obj.prc_tax_year : undefined,
          trim_year: typeof obj.trim_year === 'number' ? obj.trim_year : undefined,
          show_flag: typeof obj.show_flag === 'boolean' ? obj.show_flag : true,
          owner_name: typeof obj.owner_name === 'string' ? obj.owner_name : '',
          property_address: typeof obj.property_address === 'string' ? obj.property_address : '',
          mail_address: typeof obj.mail_address === 'string' ? obj.mail_address : '',
          mail_city: typeof obj.mail_city === 'string' ? obj.mail_city : '',
          mail_state: typeof obj.mail_state === 'string' ? obj.mail_state : '',
          mail_zip: typeof obj.mail_zip === 'string' ? obj.mail_zip : (typeof obj.mail_zip === 'number' ? String(obj.mail_zip) : ''),
          country: typeof obj.country === 'string' ? obj.country : '',
          property_city: typeof obj.property_city === 'string' ? obj.property_city : '',
          property_state: typeof obj.property_state === 'string' ? obj.property_state : '',
          property_zip: typeof obj.property_zip === 'string' ? obj.property_zip : '',
          dor_code: typeof obj.dor_code === 'string' ? obj.dor_code : '',
          dor_description: typeof obj.dor_description === 'string' ? obj.dor_description : '',
          street_number: typeof obj.street_number === 'number' ? String(obj.street_number) : (typeof obj.street_number === 'string' ? obj.street_number : ''),
          street_name: typeof obj.street_name === 'string' ? obj.street_name : '',
          inst_num: typeof obj.inst_num === 'string' ? obj.inst_num : '',
          acreage: typeof obj.acreage === 'number' ? obj.acreage : 0,
          // Não existe sqft no banco, usar apenas heated_area
          sqft: safeNumber(obj.heated_area),
          heated_area: safeNumber(obj.heated_area),
          assessed_value: typeof obj.assessed_value === 'number' ? obj.assessed_value : 0,
          occupancy_status: typeof obj.occupancy_status === 'string' ? obj.occupancy_status : '',
          current_market_value: typeof obj.current_market_value === 'number' ? obj.current_market_value : 0,
          potential_rent_income: typeof obj.potential_rent_income === 'number' ? obj.potential_rent_income : 0,
          estimated_eviction_cost: typeof obj.estimated_eviction_cost === 'number' ? obj.estimated_eviction_cost : 0,
          estimated_renovation_cost: typeof obj.estimated_renovation_cost === 'number' ? obj.estimated_renovation_cost : 0,
          risk_score: typeof obj.risk_score === 'number' ? obj.risk_score : 0,
          beds: safeNumber(obj.beds),
          baths: safeNumber(obj.baths),
        };
      }

      // TODO: Adicionar mapeamentos para TaxRecord, Building, SalesRecord, School se necessário

      let property: import("./mockData").PropertyData | null = null;
      let buildings: import("./mockData").Building[] = [];
      if (propertyResp.success && propertyResp.data) {
        property = mapPropertyToPropertyData(propertyResp.data, parcelId);
      }
      const taxRecords: import("./mockData").TaxRecord[] = [];
      const salesRecords: import("./mockData").SalesRecord[] = [];
      const schools: import("./mockData").School[] = [];
      // Defensive: only map if data exists
      if (taxRecordsResp.success && Array.isArray(taxRecordsResp.data)) {
        // Mapear cada tax record da API para o formato esperado pelo frontend
        for (const tr of taxRecordsResp.data) {
          taxRecords.push({
            parcel_id: tr.parcel_id,
            tax_year: tr.tax_year,
            market_percent: tr.market_percent ?? 0,
            assessed_percent: tr.assessed_percent ?? 0,
            show_flag: tr.show_flag === undefined ? true : tr.show_flag,
            land_value: tr.land_value ?? 0,
            building_value: tr.building_value ?? 0,
            features_value: tr.features_value ?? 0,
            market_value: tr.market_value ?? 0,
            valuation_method: tr.valuation_method ?? '',
            assessed_value: tr.assessed_value ?? 0,
            is_certified: tr.is_certified ?? false,
            is_homestead: tr.is_homestead === true || tr.is_homestead === 'true',
            is_ag: tr.is_ag === true || tr.is_ag === 'true',
            original_hx: tr.original_hx ?? 0,
            additional_hx: tr.additional_hx ?? 0,
            other_exemptions: tr.other_exemptions ?? 0,
            lis: tr.lis ?? 0,
            soh_cap: tr.soh_cap ?? 0,
            tax_savings: tr.tax_savings ?? 0,
            has_benefits: tr.has_benefits ?? false,
          });
        }
      }
      if (buildingsResp.success && Array.isArray(buildingsResp.data)) {
        // Conversor explícito PropertyBuilding -> Building
        function propertyBuildingToBuilding(b: PropertyBuilding): import("./mockData").Building {
          return {
            parcel_id: b.parcel_id,
            building_id: String(b.building_id),
            building_num: b.building_num,
            model: b.model ?? '',
            desc_model: b.desc_model ?? '',
            bldg_dor_code: b.bldg_dor_code ?? '',
            desc_bldg: b.desc_bldg ?? '',
            bldg_value: b.bldg_value ?? 0,
            est_new_cost: 0, // Não existe em PropertyBuilding
            date_built: b.date_built
              ? (typeof b.date_built === 'string' && b.date_built.length >= 4
                  ? parseInt(b.date_built.substring(0, 4))
                  : (typeof b.date_built === 'number' ? b.date_built : 0))
              : 0,
            beds: b.beds ?? 0,
            baths: typeof b.baths === 'string' ? parseFloat(b.baths) : (typeof b.baths === 'number' ? b.baths : 0),
            floors: b.floors ?? 0,
            gross_area: b.gross_area ?? 0,
            living_area: b.living_area ?? 0,
            ext_wall: b.ext_wall ?? '',
            int_wall: b.int_wall ?? '',
            total_count: 0, // Não existe em PropertyBuilding
          };
        }
        buildings = (buildingsResp.data as PropertyBuilding[]).map(propertyBuildingToBuilding);
        // Se existir pelo menos um building, use living_area, beds, baths do primeiro building
        if (property && buildings.length > 0) {
          const b = buildings[0];
          if (typeof b.living_area === 'number' && b.living_area > 0) property.heated_area = b.living_area;
          if (typeof b.beds === 'number' && b.beds > 0) property.beds = b.beds;
          if (typeof b.baths === 'number' && b.baths > 0) property.baths = b.baths;
        }
      }
      if (salesRecordsResp.success && Array.isArray(salesRecordsResp.data)) {
        // TODO: map each sales record to full SalesRecord if needed
      }
      if (schoolsResp.success && Array.isArray(schoolsResp.data)) {
        // TODO: map each school to full School if needed
      }
  const demographics: import("./mockData").Demographics | null = null;
      const floodRisk = floodRiskResp.success && floodRiskResp.data ? floodRiskResp.data : [];
      const disasterRisks = disasterRisksResp.success && disasterRisksResp.data ? disasterRisksResp.data : [];

      // Fallbacks for required fields
      if (!property) {
        return {
          success: false,
          data: null,
          error: 'Property not found',
        };
      }

      // Simulate empty arrays for all required CompletePropertyData fields not fetched above
      const emptyArr: [] = [];
      const nullObj: null = null;



      // Buscar vendas dos vizinhos
      let neighborSales: import("./mockData").NeighborSale[] = [];
      try {
        const neighborSalesResp = await this.getPropertyNeighborSales(parcelId);
        if (neighborSalesResp.success && Array.isArray(neighborSalesResp.data)) {
          neighborSales = neighborSalesResp.data;
        }
      } catch (e) {
        neighborSales = [];
      }

      // Sales Comparison Approach refinado (padrão nacional)
      if (property && neighborSales.length > 0) {
        const heated_area_alvo = property.heated_area || 0;
        const beds_alvo = property.beds || 0;
        const baths_alvo = property.baths || 0;
        const subject_address = property.property_address?.trim().toLowerCase() || '';
        const subject_parcel = property.parcel_id;
        // 1. Exclua a própria venda da subject dos comps
        const validSales = neighborSales.filter(sale => {
          const price = typeof sale.sale_price === 'string' ? parseFloat(sale.sale_price) : sale.sale_price;
          const area = sale.heated_area;
          const addr = (sale.property_address || '').trim().toLowerCase();
          return price > 0 && area > 0 && sale.parcel_id !== subject_parcel && addr !== subject_address;
        });
        if (validSales.length < 3) {
          console.warn('[AVISO] Menos de 3 comps válidos. Estimativa menos confiável.');
        }
        if (validSales.length > 0) {
          // 2. Calcule avg_ppsf
          const ppsfs = validSales.map(sale => {
            const price = typeof sale.sale_price === 'string' ? parseFloat(sale.sale_price) : sale.sale_price;
            const area = sale.heated_area || 1;
            return price / area;
          });
          const avg_ppsf = ppsfs.reduce((acc, v) => acc + v, 0) / ppsfs.length;
          // 3. Ajuste por data
          const now = new Date();
          const AJUSTE_BED = 6000;
          const AJUSTE_BATH = 4000;
          const adjusted_prices = validSales.map((sale) => {
            const price = typeof sale.sale_price === 'string' ? parseFloat(sale.sale_price) : sale.sale_price;
            const area_comp = sale.heated_area || 0;
            const beds_comp = sale.beds || 0;
            const baths_comp = typeof sale.baths === 'string' ? parseFloat(sale.baths) : sale.baths || 0;
            // Ajuste por data
            const saleDate = new Date(sale.sale_date);
            const monthsAgo = Math.max(0, (now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
            let ajuste_data = 0;
            if (monthsAgo > 3) {
              ajuste_data = price * (-0.02 * (monthsAgo));
            }
            const sale_price_ajustada = price + ajuste_data;
            // 4. Ajustes refinados
            let ajuste_area = (heated_area_alvo - area_comp) * avg_ppsf;
            // Cap de +10% se comp <20% menor
            if (area_comp < heated_area_alvo * 0.8 && ajuste_area > 0) {
              const cap = sale_price_ajustada * 0.10;
              ajuste_area = Math.min(ajuste_area, cap);
            }
            const ajuste_quartos = (beds_alvo - beds_comp) * AJUSTE_BED;
            const ajuste_banheiros = (baths_alvo - baths_comp) * AJUSTE_BATH;
            const adjusted_price = sale_price_ajustada + ajuste_area + ajuste_quartos + ajuste_banheiros;
            return adjusted_price;
          });
          const estimated_value = Math.round(adjusted_prices.reduce((acc, v) => acc + v, 0) / adjusted_prices.length);
          const range_low = Math.round(estimated_value * 0.9);
          const range_high = Math.round(estimated_value * 1.1);
          property.current_market_value = estimated_value;
          property.estimated_value = estimated_value;
          property.range_low = range_low;
          property.range_high = range_high;
          console.log('[DEBUG] Market value formula: Sales Comparison Approach (ajustes conservadores padrão nacional)');
          console.log('[DEBUG] avg_ppsf:', avg_ppsf);
          console.log('[DEBUG] adjusted_prices:', adjusted_prices);
          console.log('[DEBUG] estimated_value:', estimated_value, 'range:', range_low, '-', range_high);
        } else {
          property.heated_area = 0;
          property.current_market_value = 0;
          property.estimated_value = 0;
          property.range_low = 0;
          property.range_high = 0;
          console.log('[DEBUG] Nenhum comp válido ou área alvo zero.');
        }
      }

      // Calcular analytics com neighborSales
      let analytics = undefined;
      try {
        const { calculatePropertyAnalytics } = await import('./mockData');
        analytics = calculatePropertyAnalytics(
          property,
          taxRecords,
          [], // taxIssues
          neighborSales,
          demographics,
          buildings[0] || null,
          null // climateRisk
        );
      } catch (e) {
        analytics = undefined;
      }

      const propertyData: import("./api").CompletePropertyData = {
        property,
        adValoremTax: emptyArr,
        buildingFeatures: emptyArr,
        buildingSubareas: emptyArr,
        buildings,
        community: nullObj,
        demographics,
        propertyDocuments: emptyArr,
        extraFeatures: emptyArr,
        propertyImages: emptyArr,
        landAreas: nullObj,
        landFeatures: emptyArr,
        legalDescriptions: nullObj,
        neighborSales,
        nonAdValoremTax: emptyArr,
        propertyOfficials: emptyArr,
        salesRecords,
        schools,
        propertyServices: emptyArr,
        taxRecords,
        taxHistoryIssues: emptyArr,
        analytics,
      };

      console.log('✅ API: Complete property data:', propertyData);

      return {
        success: true,
        data: propertyData,
      };
    } catch (error) {
      console.error('❌ API: Failed to get property data:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get property data',
      };
    }
  }

  // Endpoint agregado: calcula e retorna todos os dados da propriedade, incluindo current_market_value
    async getPropertyDataApi(req: Request<{ parcel_id: string }>, res: Response) {
      // Express params are typed as { parcel_id: string }; coerce safely and trim
      const parcelId = String(req.params.parcel_id || '').trim();
      try {
        const result = await this.getPropertyData(parcelId);
        if (result.success) {
          res.status(200);
          return res.json(result.data);
        } else {
          res.status(404);
          return res.json({ error: result.error || 'Property not found' });
        }
      } catch (error) {
        res.status(500);
        return res.json({ error: error instanceof Error ? error.message : 'Internal error' });
      }
    }
  async getPropertyLocation(parcelId: string): Promise<ApiResponse<PropertyLocation[]>> {
  const endpoint = `${API_ENDPOINTS.PROPERTY_LOCATION}/${encodeURIComponent(parcelId)}`;
  console.log('🔍 DEBUG: getPropertyLocation endpoint:', endpoint);
  console.log('🔍 DEBUG: Base URL:', API_BASE_URL);
  console.log('🔍 DEBUG: Endpoint config:', API_ENDPOINTS.PROPERTY_LOCATION);
  return this.request<PropertyLocation[]>(endpoint);
  }

  async getPropertyTaxRecords(parcelId: string): Promise<ApiResponse<PropertyTaxRecord[]>> {
  const endpoint = `${API_ENDPOINTS.PROPERTY_TAX_RECORDS}/${encodeURIComponent(parcelId)}`;
  return this.request<PropertyTaxRecord[]>(endpoint);
  }

  async getPropertyBuildings(parcelId: string): Promise<ApiResponse<PropertyBuilding[]>> {
  const endpoint = `${API_ENDPOINTS.PROPERTY_BUILDINGS}/${encodeURIComponent(parcelId)}`;
  return this.request<PropertyBuilding[]>(endpoint);
  }

  async getPropertyFloodRisk(parcelId: string): Promise<ApiResponse<PropertyFloodRisk[]>> {
  const endpoint = `${API_ENDPOINTS.PROPERTY_FLOOD_RISK}/${encodeURIComponent(parcelId)}`;
  return this.request<PropertyFloodRisk[]>(endpoint);
  }

  async getPropertySalesRecords(parcelId: string): Promise<ApiResponse<PropertySalesRecord[]>> {
  const endpoint = `${API_ENDPOINTS.PROPERTY_SALES_RECORDS}/${encodeURIComponent(parcelId)}`;
  return this.request<PropertySalesRecord[]>(endpoint);
  }

  async getPropertyDemographics(parcelId: string): Promise<ApiResponse<PropertyDemographics[]>> {
  const endpoint = `${API_ENDPOINTS.PROPERTY_DEMOGRAPHICS}/${encodeURIComponent(parcelId)}`;
  return this.request<PropertyDemographics[]>(endpoint);
  }

  async getPropertySchools(parcelId: string): Promise<ApiResponse<PropertySchool[]>> {
  const endpoint = `${API_ENDPOINTS.PROPERTY_SCHOOLS}/${encodeURIComponent(parcelId)}`;
  return this.request<PropertySchool[]>(endpoint);
  }

  async getPropertyDisasterRisks(parcelId: string): Promise<ApiResponse<PropertyDisasterRisk[]>> {
  const endpoint = `${API_ENDPOINTS.PROPERTY_DISASTERS_RISKS}/${encodeURIComponent(parcelId)}`;
  return this.request<PropertyDisasterRisk[]>(endpoint);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Utility functions
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};