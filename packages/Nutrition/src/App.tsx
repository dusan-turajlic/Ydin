import { lazy, Suspense } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { setupCompleteAtom } from "@/atoms/targets";

// Lazy load views
const Tracker = lazy(() => import("@/views/Tracker"));
const NotFound = lazy(() => import("@/views/NotFound"));

// Lazy load setup wizard views
const Welcome = lazy(() => import("@/views/setup/Welcome"));
const Mode = lazy(() => import("@/views/setup/Mode"));
const Measurements = lazy(() => import("@/views/setup/Measurements"));
const Profile = lazy(() => import("@/views/setup/Profile"));
const Activity = lazy(() => import("@/views/setup/Activity"));
const Training = lazy(() => import("@/views/setup/Training"));
const Goal = lazy(() => import("@/views/setup/Goal"));
const Country = lazy(() => import("@/views/setup/Country"));
const Manual = lazy(() => import("@/views/setup/Manual"));

/**
 * Loading fallback for lazy-loaded routes
 */
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/**
 * Root redirect component that checks setup status
 */
function RootRedirect() {
  const setupComplete = useAtomValue(setupCompleteAtom);

  if (setupComplete) {
    return <Navigate to="/food" replace />;
  }

  return <Navigate to="/setup/welcome" replace />;
}

/**
 * Guard component that redirects to setup if not complete
 */
function RequireSetup({ children }: { children: React.ReactNode }) {
  const setupComplete = useAtomValue(setupCompleteAtom);

  if (!setupComplete) {
    return <Navigate to="/setup/welcome" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Root redirect based on setup status */}
          <Route path="/" element={<RootRedirect />} />

          {/* Setup wizard routes */}
          <Route path="/setup/welcome" element={<Welcome />} />
          <Route path="/setup/mode" element={<Mode />} />
          <Route path="/setup/measurements" element={<Measurements />} />
          <Route path="/setup/profile" element={<Profile />} />
          <Route path="/setup/activity" element={<Activity />} />
          <Route path="/setup/training" element={<Training />} />
          <Route path="/setup/goal" element={<Goal />} />
          <Route path="/setup/country" element={<Country />} />
          <Route path="/setup/manual" element={<Manual />} />

          {/* Main app routes (require setup) */}
          <Route
            path="/food"
            element={
              <RequireSetup>
                <Tracker />
              </RequireSetup>
            }
          />
          <Route
            path="/food/:code"
            element={
              <RequireSetup>
                <Tracker />
              </RequireSetup>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
