export interface ProcessingStatusProps {
  requestId: string;
}

export interface PropertyRequest {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  description?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  status_details: {
    address_validation: string | null;
    geospatial_analysis: string | null;
    zoning_analysis: string | null;
    report_generation: string | null;
  };
  processing_steps: {
    address_validated: boolean;
    coordinates_mapped: boolean;
    zoning_checked: boolean;
    report_generated: boolean;
    completed: boolean;
  };
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
  api_data: {
    parcel: any | null;
    zoning: any | null;
    geocoding: any | null;
    assessment: AssessmentData | null;
    structures: any | null;
    transactions: any | null;
    historical_tax: any | null;
    historical_assessment: any | null;
  };
  api_progress: {
    parcel_completed: boolean;
    zoning_completed: boolean;
    geocoding_completed: boolean;
    assessment_completed: boolean;
    structures_completed: boolean;
    transactions_completed: boolean;
    historical_tax_completed: boolean;
    historical_assessment_completed: boolean;
  };
  lightbox_data?: any;
  lightbox_processed_at?: string;
  lightbox_request_id?: string;
  lightbox_endpoints: LightBoxEndpoints;
  lightbox_raw_responses: Record<string, any>;
  lightbox_parsed_data: Record<string, any>;
  api_execution_logs: ApiExecutionLog[];
}

export interface AssessmentData {
  assessmentYear: number;
  totalValue: number;
  landValue: number;
  improvementValue: number;
  taxRate: number;
  assessmentDate: string;
  propertyClass: string;
  taxStatus: string;
  lastSalePrice: number;
  lastSaleDate: string;
}

export interface LightBoxResponse {
  parcelId?: string;
  address?: {
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    county?: string;
  };
  propertyDetails?: {
    landUse?: string;
    lotSize?: string;
    zoning?: string;
    yearBuilt?: string;
  };
  coordinates?: {
    lat: number | null;
    lng: number | null;
  };
  rawResponse?: any;
  timestamp?: string;
  lightbox_processed: boolean;
  processed_at: string;
  status?: string;
  lightbox_request_id?: string;
  api_progress?: {
    parcel_completed: boolean;
    zoning_completed: boolean;
    geocoding_completed: boolean;
    assessment_completed: boolean;
    structures_completed: boolean;
    transactions_completed: boolean;
    historical_tax_completed: boolean;
    historical_assessment_completed: boolean;
  };
}

export interface FunctionLog {
  timestamp: string;
  function: string;
  status: 'success' | 'error' | 'info';
  message: string;
}

export interface LightBoxEndpoint {
  status: string | null;
  last_updated: string | null;
  error: string | null;
}

export interface LightBoxEndpoints {
  property_search: LightBoxEndpoint;
  property_details: LightBoxEndpoint;
  property_valuation: LightBoxEndpoint;
  property_tax: LightBoxEndpoint;
  property_ownership: LightBoxEndpoint;
  property_liens: LightBoxEndpoint;
  property_permits: LightBoxEndpoint;
  property_zoning: LightBoxEndpoint;
  property_flood: LightBoxEndpoint;
  property_environmental: LightBoxEndpoint;
  property_demographics: LightBoxEndpoint;
  property_schools: LightBoxEndpoint;
  property_crime: LightBoxEndpoint;
  property_boundaries: LightBoxEndpoint;
  property_aerial: LightBoxEndpoint;
}

export interface ApiExecutionLog {
  timestamp: string;
  endpoint: string;
  status: string;
  message: string;
  details?: any;
}

export interface ApiCallHistoryEntry {
  timestamp: string;
  event: string;
  details?: any;
}

export interface ApiError {
  message: string;
  details?: any;
  timestamp: string;
}

export interface DebugPanelProps {
  isLoading: boolean;
  error: string | null;
  requestId: string | null;
  lightboxData: LightBoxResponse | null;
  apiCallHistory: ApiCallHistoryEntry[];
  apiError: ApiError | null;
  onRetry: () => void;
  onMessageSubmit: (message: string) => void;
}