import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Order } from "./types";

const OrderHistory = () => {
  const session = useSession();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) return;

      try {
        console.log("=== Fetching Orders Process Started ===");
        console.log("User ID:", session.user.id);
        console.log("User timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);

        const { data: ordersData, error } = await supabase
          .from("reports_orders")
          .select(`
            *,
            report:reports (
              metadata,
              created_at,
              description
            )
          `)
          .eq("user_id", session.user.id)
          .order("purchase_date", { ascending: false });

        if (error) {
          console.error("=== Error Fetching Orders ===");
          console.error("Error details:", error);
          throw error;
        }

        console.log("=== Orders Fetched Successfully ===");
        console.log("Number of orders:", ordersData?.length);
        console.log("Orders data:", ordersData);

        setOrders(ordersData || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your orders",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, toast]);

  const handleDownload = async (order: Order) => {
    try {
      console.log("=== Download Process Started ===");
      console.log("Download requested for order:", {
        orderId: order.id,
        reportName: order.report_name,
        downloadUrl: order.download_url
      });

      // Remove the bucket name prefix if it exists
      const filePath = order.download_url.replace(/^reports\//, '');
      console.log("Using file path:", filePath);

      console.log("Requesting signed URL from Supabase storage...");
      const { data, error } = await supabase.storage
        .from("reports")
        .createSignedUrl(filePath, 60); // URL valid for 1 minute

      if (error) {
        console.error("=== Storage Error Getting Signed URL ===");
        console.error("Storage Error Details:", {
          message: error.message,
          name: error.name,
          filePath
        });
        throw error;
      }

      if (!data?.signedUrl) {
        throw new Error("No signed URL received from storage");
      }

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = filePath; // Set suggested filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("=== Download Process Completed Successfully ===");
      toast({
        title: "Success",
        description: "Your download has started",
      });
    } catch (error) {
      console.error("=== Download Process Failed ===");
      console.error("Error Details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download the report",
      });
    }
  };

  const handleShare = async (order: Order) => {
    try {
      console.log("=== Share Process Started ===");
      console.log("Generating share link for order:", {
        orderId: order.id,
        reportName: order.report_name
      });

      // Remove the bucket name prefix if it exists
      const filePath = order.download_url.replace(/^reports\//, '');
      console.log("Using file path for share link:", filePath);

      const { data, error } = await supabase.storage
        .from("reports")
        .createSignedUrl(filePath, 3600); // URL valid for 1 hour

      if (error) {
        console.error("=== Share Link Generation Failed ===");
        console.error("Error details:", error);
        throw error;
      }

      if (!data?.signedUrl) {
        console.error("=== No Signed URL Received ===");
        throw new Error("Failed to generate share link");
      }

      await navigator.clipboard.writeText(data.signedUrl);
      console.log("=== Share Process Completed Successfully ===");
      
      toast({
        title: "Success",
        description: "Share link copied to clipboard! Link expires in 1 hour.",
      });
    } catch (error) {
      console.error("=== Share Process Failed ===");
      console.error("Error sharing report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate share link",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Loading your orders...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>You haven't placed any orders yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and manage your orders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{order.report_name}</h3>
                  <p className="text-sm text-gray-500">
                    Purchased on {format(new Date(order.purchase_date), "PPP")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: ${order.amount.toFixed(2)}
                  </p>
                  {order.report?.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {order.report.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleShare(order)}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleDownload(order)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;