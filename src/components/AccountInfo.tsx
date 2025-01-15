import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const AccountInfo = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!session?.user?.id) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch account information",
          });
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [session, supabase, toast]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8 text-gray-500">
        No account information available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Account Information</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Email</TableCell>
            <TableCell>{profile.email || "Not set"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Full Name</TableCell>
            <TableCell>{profile.full_name || "Not set"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Member Since</TableCell>
            <TableCell>
              {new Date(profile.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Last Updated</TableCell>
            <TableCell>
              {new Date(profile.updated_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default AccountInfo;