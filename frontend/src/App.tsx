import './App.css'
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
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <BrowserRouter>
          <Header />

          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              {/* Public Routes */}
              <Route path="/index" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/registerbloodDonor" element={<BloodDonorRegisterPage />} />
              <Route path="/registerHospital" element={<HospitalRegisterPage />} />
              <Route path="/" element={<Index />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/bloodDonors" element={<BloodDonorCrudPage />} />
                <Route path="/hospitals" element={<HospitalCrudPage />} />
              </Route>
            </Routes>
          </main>

          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
