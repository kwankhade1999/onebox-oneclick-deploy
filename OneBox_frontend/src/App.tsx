import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { InboxPage } from "./pages/InboxPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { FilterPage } from "./pages/FilterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/filter" element={<FilterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
