import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

const NewReport = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Report</h1>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Zoning Analysis</CardTitle>
                <CardDescription>Get detailed zoning information and regulations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/get-started")} className="w-full">
                  Start Analysis
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Building Code Review</CardTitle>
                <CardDescription>Comprehensive building code compliance check</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/get-started")} className="w-full">
                  Start Review
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Assessment</CardTitle>
                <CardDescription>Environmental impact and compliance report</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/get-started")} className="w-full">
                  Start Assessment
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Report</CardTitle>
                <CardDescription>Create a customized analysis report</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/get-started")} className="w-full">
                  Start Custom Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReport;
