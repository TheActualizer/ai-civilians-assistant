import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";

const LearnMore = () => {
  const session = useSession();
  
  return (
    <div>
      <Navbar session={session} />
      <div className="min-h-screen bg-gray-50">
        <div className="pt-24">
          <section className="py-12 px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Learn More About Our Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover how our AI-driven solutions can help you with your building analysis needs.
            </p>
          </section>
          <section className="max-w-2xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Our Features</h2>
            <ul className="list-disc list-inside">
              <li>Fast and accurate zoning analysis</li>
              <li>Feasibility reports at a fraction of the cost</li>
              <li>Maximum buildable area calculations</li>
              <li>24/7 customer support</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
