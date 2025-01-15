import { Order } from "./types";
import OrderCard from "./OrderCard";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt } from "lucide-react";

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  downloadingOrderId: string | null;
  onDownload: (order: Order) => Promise<void>;
  onShare: (order: Order) => Promise<void>;
  onDelete: (order: Order) => Promise<void>;
}

const OrderList = ({ 
  orders, 
  loading, 
  downloadingOrderId,
  onDownload, 
  onShare, 
  onDelete 
}: OrderListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-40">
          <Receipt className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-600">No orders found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onDownload={onDownload}
          onShare={onShare}
          onDelete={onDelete}
          downloadingOrderId={downloadingOrderId}
        />
      ))}
    </div>
  );
};

export default OrderList;