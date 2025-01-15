import { format } from "date-fns";
import { MapPin, FileText, Info } from "lucide-react";
import { Order } from "./types";

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {order.shipping_address && (
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-700">Shipping Address</p>
              <p className="text-sm text-gray-600">{order.shipping_address}</p>
            </div>
          </div>
        )}
        
        {order.notes && (
          <div className="flex items-start space-x-2">
            <FileText className="h-4 w-4 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-700">Notes</p>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          </div>
        )}
        
        {order.report && (
          <div className="flex items-start space-x-2 col-span-full">
            <Info className="h-4 w-4 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-700">Report Details</p>
              {order.report.description && (
                <p className="text-sm text-gray-600 mt-1">{order.report.description}</p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Created: {format(new Date(order.report.created_at), "MMM d, yyyy")}
              </p>
              {order.report.metadata && Object.keys(order.report.metadata).length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Additional Information</p>
                  {Object.entries(order.report.metadata).map(([key, value]) => (
                    <p key={key} className="text-sm text-gray-600">
                      {key}: {value as string}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;