import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";
import OrderHistory from "@/components/OrderHistory";

const Orders = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders & Reports</h1>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <OrderHistory />
        </div>
      </div>
    </div>
  );
};

export default Orders;
