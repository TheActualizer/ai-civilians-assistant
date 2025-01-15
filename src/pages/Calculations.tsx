import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";
import { ProcessingStatus } from "@/components/GetStarted/ProcessingStatus";

const Calculations = () => {
  const session = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Calculation Dashboard</h1>
        <ProcessingStatus requestId="latest" />
      </div>
    </div>
  );
};

export default Calculations;