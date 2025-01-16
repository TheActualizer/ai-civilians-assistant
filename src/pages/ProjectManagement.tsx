import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "@/components/Navbar";

const ProjectManagement = () => {
  const session = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Management</h1>
        <p className="text-xl text-gray-600 mb-8">
          Efficiently manage and track all your construction and development projects.
        </p>
      </div>
    </div>
  );
};

export default ProjectManagement;