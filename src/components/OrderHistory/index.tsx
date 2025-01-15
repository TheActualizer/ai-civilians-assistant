import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OrderCard from "./OrderCard";
import { Order } from "./types";

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders();
    }
  }, [session?.user?.id]);

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders for user:", session?.user.id);
      
      const { data, error } = await supabase
        .from("reports_orders")
        .select(`
          *,
          report:reports (
            description,
            created_at,
            metadata
          )
        `)
        .eq('user_id', session?.user.id)
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
      toast({
        title: "Error",
        description: "Failed to load order history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleShare = async (order: Order) => {
    try {
      const { data, error } = await supabase.storage
        .from("reports")
        .createSignedUrl(order.download_url, 3600); // URL valid for 1 hour

      if (error) {
        throw error;
      }

      await navigator.clipboard.writeText(data.signedUrl);
      toast({
        title: "Success",
        description: "Share link copied to clipboard! Link expires in 1 hour.",
      });
    } catch (error) {
      console.error("Error sharing report:", error);
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (order: Order) => {
    try {
      const { error: deleteStorageError } = await supabase.storage
        .from("reports")
        .remove([order.download_url]);

      if (deleteStorageError) {
        throw deleteStorageError;
      }

      const { error: deleteOrderError } = await supabase
        .from("reports_orders")
        .delete()
        .eq("id", order.id);

      if (deleteOrderError) {
        throw deleteOrderError;
      }

      setOrders(orders.filter((o) => o.id !== order.id));
      toast({
        title: "Success",
        description: "Report deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-40">
          <Receipt className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-600">Please log in to view your order history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Order History</h2>
        <p className="text-gray-600">View and manage your purchased reports</p>
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
            <OrderCard
              key={order.id}
              order={order}
              onDownload={handleDownload}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
