import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PricingComparison = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Unbeatable Value</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>AI Civil Engineer</CardTitle>
              <CardDescription>Fast, Accurate, Affordable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-4">$99</div>
              <p className="text-gray-600">Report delivered in under a minute</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Traditional Engineering Firms</CardTitle>
              <CardDescription>Standard Industry Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-600 mb-4">$1,500</div>
              <p className="text-gray-600">2-4 weeks delivery time</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};