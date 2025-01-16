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
  };
  propertyDetails?: {
    landUse?: string;
    lotSize?: string;
    zoning?: string;
    yearBuilt?: string;
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
