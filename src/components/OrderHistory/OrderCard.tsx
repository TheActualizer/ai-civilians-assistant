import { Calendar, Download, Receipt, DollarSign, MapPin, FileText, Info, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatInTimeZone } from 'date-fns-tz';
import { OrderCardProps } from "./types";

const OrderCard = ({ order, onDownload, onShare, onDelete, downloadingOrderId }: OrderCardProps) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatDate = (dateString: string) => {
    return formatInTimeZone(
      new Date(dateString),
      userTimeZone,
      'MMM d, yyyy h:mm a zzz'
    );
  };

  return (
    <Card key={order.id} className="hover:shadow-md transition-shadow">
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
                  {formatDate(order.purchase_date)}
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
                disabled={downloadingOrderId === order.id}
              >
                {downloadingOrderId === order.id ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                    Downloading...
                  </div>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </>
                )}
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
                        Created: {formatDate(order.report.created_at)}
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;