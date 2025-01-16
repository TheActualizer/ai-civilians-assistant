import { useSession } from "@supabase/auth-helpers-react";
import Navbar from "../Navbar";
import { NavigationControls } from "../navigation/NavigationControls";
import { DebugPanel } from "../DebugPanel/DebugPanel";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const session = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar session={session} />
      <NavigationControls />
      <DebugPanel
        isLoading={false}
        error={null}
        requestId={null}
        lightboxData={null}
        apiCallHistory={[]}
        apiError={null}
        onRetry={() => {}}
        onMessageSubmit={() => {}}
      />
      <main className="flex-1 pt-20">
        {children}
      </main>
    </div>
  );
}