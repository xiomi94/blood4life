import { Route, Routes } from 'react-router';
import BloodDonorCrudPage from "./pages/BloodDonorFullCrudPage/BloodDonorCrudPage.tsx";
import BloodDonorRegisterPage from "./pages/BloodDonorRegisterPage/BloodDonorRegisterPage.tsx";
import HospitalCrudPage from "./pages/HospitalFullCrudPage/HospitalCrudPage.tsx";
import HospitalRegisterPage from "./pages/HospitalRegisterPage/HospitalRegisterPage.tsx";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login/Login.tsx";
import LdapLoginPage from "./pages/LdapLoginPage/LdapLoginPage.tsx";
import Register from "./pages/Register/Register.tsx";
import Header from "./components/layout/Header/Header.tsx";
import Footer from "./components/layout/Footer/Footer.tsx";
import SkipLink from "./components/common/ui/SkipLink/SkipLink.tsx";
import ProtectedRoute from "./components/features/auth/ProtectedRoute/ProtectedRoute";
import UnifiedDashboard from "./pages/UnifiedDashboard/UnifiedDashboard";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col">
      <SkipLink />
      <Header />

      <main id="main-content" className="flex-grow w-full flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/index" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ldaplogin" element={<LdapLoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerbloodDonor" element={<BloodDonorRegisterPage />} />
          <Route path="/registerHospital" element={<HospitalRegisterPage />} />
          <Route path="/dashboard" element={<UnifiedDashboard />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/" element={<Index />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/bloodDonors" element={<BloodDonorCrudPage />} />
            <Route path="/hospitals" element={<HospitalCrudPage />} />
          </Route>

          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            fontFamily: 'Roboto, sans-serif',
          },
        }}
      />
    </div>
  );
}

export default App;
