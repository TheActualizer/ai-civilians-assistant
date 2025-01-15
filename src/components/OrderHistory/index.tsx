import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Order } from "./types";
import OrderList from "./OrderList";

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    fetchOrders();
  }, [session, toast]);

  const fetchOrders = async () => {
    try {
      console.log("=== Fetching Orders Process Started ===");
      console.log("User ID:", session?.user.id);
      console.log("User timezone:", userTimeZone);
      
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
        .order("purchase_date", { ascending: false });

      if (error) {
        console.error("=== Error Fetching Orders ===");
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        toast({
          title: "Error",
          description: "Failed to load order history",
          variant: "destructive",
        });
        return;
      }

      console.log("=== Orders Fetched Successfully ===");
      console.log("Number of orders:", data?.length || 0);
      console.log("Orders data:", data);
      setOrders(data || []);
    } catch (error) {
      console.error("=== Unexpected Error in fetchOrders ===");
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (order: Order) => {
    try {
      console.log("=== Download Process Started ===");
      console.log("Download requested for order:", {
        orderId: order.id,
        reportName: order.report_name,
        downloadUrl: order.download_url
      });
      
      setDownloadingOrderId(order.id);
      
      // Extract just the filename from the path, removing any directory structure
      const filePath = order.download_url.split('/').pop();
      if (!filePath) {
        throw new Error("Invalid file path");
      }
      console.log("Using file path:", filePath);
      
      console.log("Requesting signed URL from Supabase storage...");
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("reports")
        .createSignedUrl(filePath, 60);

      if (signedUrlError) {
        console.error("=== Storage Error Getting Signed URL ===");
        console.error("Storage Error Details:", {
          message: signedUrlError.message,
          name: signedUrlError.name,
          filePath: filePath
        });
        throw new Error(`Failed to generate download URL: ${signedUrlError.message}`);
      }

      if (!signedUrlData?.signedUrl) {
        console.error("=== No Signed URL Received ===");
        throw new Error("No signed URL received from storage");
      }

      console.log("Successfully obtained signed URL:", signedUrlData.signedUrl);
      console.log("Initiating file download with signed URL...");
      
      const response = await fetch(signedUrlData.signedUrl);
      console.log("Download response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("=== HTTP Error Response ===");
        console.error("Response details:", {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
          url: signedUrlData.signedUrl
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      console.log("File blob created:", {
        size: blob.size,
        type: blob.type
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${order.report_name}.pdf`;
      
      console.log("Triggering download with filename:", link.download);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      console.log("Cleaning up download resources...");
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      console.log("=== Download Process Completed Successfully ===");
      
      toast({
        title: "Success",
        description: "Report downloaded successfully",
      });
    } catch (error) {
      console.error("=== Download Process Failed ===");
      console.error("Error Details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      toast({
        title: "Error",
        description: error.message || "Failed to download report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingOrderId(null);
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

  if (!session) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Order History</h2>
        <p className="text-gray-600">View and manage your purchased reports</p>
        <p className="text-sm text-gray-500 mt-1">All times shown in {userTimeZone}</p>
      </div>

      <OrderList
        orders={orders}
        loading={loading}
        downloadingOrderId={downloadingOrderId}
        onDownload={handleDownload}
        onShare={handleShare}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default OrderHistory;