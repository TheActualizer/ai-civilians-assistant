import { useSession } from "@supabase/auth-helpers-react";
import { Settings2 } from "lucide-react";
import AccountInfo from "@/components/AccountInfo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const session = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Settings2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        
        <div className="grid gap-6">
          {/* Account Settings Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
              <p className="text-sm text-gray-500">Manage your account preferences and personal information</p>
            </div>
            <AccountInfo />
          </section>

          <Separator className="my-4" />
          
          {/* Notifications Section */}
          <section>
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Notifications
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">
                  Notification settings will be available soon.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Security Section */}
          <section>
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Security
                </CardTitle>
                <CardDescription>
                  Manage your security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-500">
                  Security settings will be available soon.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;