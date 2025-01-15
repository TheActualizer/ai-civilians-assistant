export interface Order {
  id: string;
  report_name: string;
  purchase_date: string;
  amount: number;
  status: string;
  download_url: string;
  shipping_address?: string;
  notes?: string;
  report?: {
    description?: string;
    created_at: string;
    metadata: any;
  };
}

export interface OrderCardProps {
  order: Order;
  onDownload: (order: Order) => Promise<void>;
  onShare: (order: Order) => Promise<void>;
  onDelete: (order: Order) => Promise<void>;
  downloadingOrderId: string | null;
}