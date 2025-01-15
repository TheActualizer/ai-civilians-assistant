import { format } from "date-fns";
import { Calendar, Download, Receipt, DollarSign, MapPin, FileText, Info, Share2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "./types";
import OrderDetails from "./OrderDetails";

interface OrderCardProps {
  order: Order;
  onDownload: (order: Order) => void;
  onShare: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrderCard = ({ order, onDownload, onShare, onDelete }: OrderCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">{order.report_name}</h3>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(order.purchase_date), "MMM d, yyyy")}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  ${order.amount.toFixed(2)}
                </div>
                <div className="flex items-center">
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "completed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <Button 
                onClick={() => onDownload(order)}
                variant="outline"
                className="flex-1 md:flex-none"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                onClick={() => onShare(order)}
                variant="outline"
                className="flex-1 md:flex-none"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                onClick={() => onDelete(order)}
                variant="destructive"
                className="flex-1 md:flex-none"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {(order.shipping_address || order.notes || order.report) && (
            <OrderDetails order={order} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;