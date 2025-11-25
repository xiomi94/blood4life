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

function App() {
  return (
    <div className="bg-gray-100">
      <BrowserRouter>
        <Header/>
        <main>
          <Routes>
            <Route path='/index' element={<Index/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/bloodDonors' element={<BloodDonorCrudPage/>}/>
            <Route path='/registerbloodDonor' element={<BloodDonorRegisterPage/>}/>
            <Route path='/hospitals' element={<HospitalCrudPage/>}/>
            <Route path='/registerHospital' element={<HospitalRegisterPage/>}/>
            <Route path='/' element={<Index/>}/>
          </Routes>
        </main>
        <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App