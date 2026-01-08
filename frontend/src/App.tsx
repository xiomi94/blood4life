
import { BrowserRouter, Route, Routes } from 'react-router';
import BloodDonorCrudPage from "./pages/BloodDonorFullCrudPage/BloodDonorCrudPage.tsx";
import BloodDonorRegisterPage from "./pages/BloodDonorRegisterPage/BloodDonorRegisterPage.tsx";
import HospitalCrudPage from "./pages/HospitalFullCrudPage/HospitalCrudPage.tsx";
import HospitalRegisterPage from "./pages/HospitalRegisterPage/HospitalRegisterPage.tsx";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login/Login.tsx";
import Register from "./pages/Register/Register.tsx";
import Header from "./components/UI/Header/Header.tsx";
import Footer from "./components/UI/Footer/Footer.tsx";
import SkipLink from "./components/UI/SkipLink/SkipLink.tsx";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import UnifiedDashboard from "./pages/UnifiedDashboard/UnifiedDashboard";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col">
        <BrowserRouter>
          <SkipLink />
          <Header />

          <main id="main-content" className="flex-grow w-full flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/index" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/registerbloodDonor" element={<BloodDonorRegisterPage />} />
              <Route path="/registerHospital" element={<HospitalRegisterPage />} />
              <Route path="/dashboard" element={<UnifiedDashboard />} />
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
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
