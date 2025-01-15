import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Edit2, X } from "lucide-react";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const AccountInfo = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!session?.user?.id) {
          console.log("🔴 No user session found");
          return;
        }

        console.log("🟢 Starting profile fetch...");
        console.log("👤 User ID:", session.user.id);
        console.log("📧 User Email:", session.user.email);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("🔴 Error fetching profile:", error.message);
          console.error("Full error details:", error);
          throw error;
        }

        if (!data) {
          console.log("🔴 No profile data found for user");
          toast({
            variant: "destructive",
            title: "Error",
            description: "No profile found",
          });
          return;
        }

        console.log("🟢 Profile data retrieved successfully!");
        console.log("📝 Profile details:", {
          id: data.id,
          email: data.email,
          full_name: data.full_name || "Not set",
          phone_number: data.phone_number || "Not set",
          created_at: new Date(data.created_at).toLocaleString(),
          updated_at: new Date(data.updated_at).toLocaleString()
        });

        setProfile(data);
        setEditedName(data.full_name || "");
        setEditedPhone(data.phone_number || "");
      } catch (error) {
        console.error("🔴 Error in getProfile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
      } finally {
        setLoading(false);
      }
    };

    console.log("🔄 Profile component mounted, fetching data...");
    getProfile();
  }, [session, supabase, toast]);

  const handleSave = async () => {
    if (!session?.user?.id) return;

    setSaving(true);
    try {
      console.log("Updating profile for user:", session.user.id);
      console.log("New values:", { full_name: editedName, phone_number: editedPhone });

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editedName,
          phone_number: editedPhone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      setProfile((prev) => 
        prev ? {
          ...prev,
          full_name: editedName,
          phone_number: editedPhone,
          updated_at: new Date().toISOString(),
        } : null
      );

      console.log("Profile updated successfully");
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditedName(profile.full_name || "");
      setEditedPhone(profile.phone_number || "");
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    console.log("No profile data available to display");
    return null;
  }

  return (
    <Card className="border-0 shadow-md bg-white">
      <CardHeader className="border-b bg-gray-50/50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Account Information
            </CardTitle>
            <CardDescription className="text-gray-500 mt-1">
              Manage your personal information and contact details
            </CardDescription>
          </div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Email Address</label>
            <Input 
              value={profile.email || ""} 
              disabled 
              className="bg-gray-50 border-gray-200"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Full Name</label>
            {isEditing ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter your full name"
                className="border-gray-200"
              />
            ) : (
              <Input 
                value={profile.full_name || ""} 
                disabled 
                className="bg-gray-50 border-gray-200"
              />
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Phone Number</label>
            {isEditing ? (
              <Input
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
                placeholder="Enter your phone number"
                type="tel"
                className="border-gray-200"
              />
            ) : (
              <Input 
                value={profile.phone_number || ""} 
                disabled 
                className="bg-gray-50 border-gray-200"
              />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Member Since</label>
              <Input 
                value={new Date(profile.created_at).toLocaleDateString()} 
                disabled 
                className="bg-gray-50 border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Last Updated</label>
              <Input 
                value={new Date(profile.updated_at).toLocaleDateString()} 
                disabled 
                className="bg-gray-50 border-gray-200"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInfo;