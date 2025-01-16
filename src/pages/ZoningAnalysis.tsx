import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";

const ZoningAnalysis = () => {
  const session = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Zoning Analysis</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Property Zoning Details</h2>
          <p className="text-gray-600 mb-6">
            Analyze zoning regulations, restrictions, and development potential for your property.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Current Zoning</h3>
              <p className="text-gray-600">View current zoning designation and permitted uses.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Development Potential</h3>
              <p className="text-gray-600">Analyze maximum buildable area and development options.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoningAnalysis;