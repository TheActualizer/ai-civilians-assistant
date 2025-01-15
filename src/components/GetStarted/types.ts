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
}

export interface FunctionLog {
  timestamp: string;
  function: string;
  status: 'success' | 'error' | 'info';
  message: string;
}