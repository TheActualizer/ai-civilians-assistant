import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Download, Receipt, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface Order {
  id: string;
  report_name: string;
  purchase_date: string;
  amount: number;
  status: string;
  download_url: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders for user:", session?.user.id);
        const { data, error } = await supabase
          .from("reports_orders")
          .select("*")
          .order("purchase_date", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
          toast({
            title: "Error",
            description: "Failed to load order history",
            variant: "destructive",
          });
          return;
        }

        console.log("Fetched orders:", data);
        setOrders(data || []);
      } catch (error) {
        console.error("Error in fetchOrders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session, toast]);

  const handleDownload = async (order: Order) => {
    try {
      const { data, error } = await supabase.storage
        .from("reports")
        .download(order.download_url);

      if (error) {
        console.error("Error downloading file:", error);
        toast({
          title: "Error",
          description: "Failed to download report",
          variant: "destructive",
        });
        return;
      }

      // Create a download link and trigger the download
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${order.report_name}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Report downloaded successfully",
      });
    } catch (error) {
      console.error("Error in handleDownload:", error);
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      });
    }
  };

  if (!session) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Order History</h2>
        <p className="text-gray-600">View and download your purchased reports</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <Receipt className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-600">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
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
                  
                  <div className="mt-4 md:mt-0">
                    <Button 
                      onClick={() => handleDownload(order)}
                      className="w-full md:w-auto"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;