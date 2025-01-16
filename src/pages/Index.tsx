import { useSession } from "@supabase/auth-helpers-react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { LoggingAnalyzer } from "@/components/SystemIntelligence/LoggingAnalyzer";

export default function Index() {
  const session = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Hero />
      <Features />
      {session && <LoggingAnalyzer />}
    </div>
  );
}