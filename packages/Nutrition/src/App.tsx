import { lazy } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { useOpenFoodDex } from "@/hooks/useOpenFoodDex";
import { DEFAULT_CONTRY_CODE_FROM_CATALOG, getLocelizedIndexUrl } from "./constants";

const Tracker = lazy(() => import("@/views/Tracker"));
const NotFound = lazy(() => import("@/views/NotFound"));
// Finland @todo: Make some onboarding flow to ask for contry
const HARD_CODED_COUNTRY_CODE = "fi";

function App() {
  // Install the global index
  useOpenFoodDex(getLocelizedIndexUrl(DEFAULT_CONTRY_CODE_FROM_CATALOG));
  // Install the local indexes
  useOpenFoodDex(getLocelizedIndexUrl(HARD_CODED_COUNTRY_CODE));
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/food" replace />} />
        <Route path="/food" element={<Tracker />} />
        <Route path="/food/:code" element={<Tracker />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
