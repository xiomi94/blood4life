import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import DashboardPage from '../DashboardBloodDonorPage/DashboardBloodDonorPage';
import DashboardHospitalPage from '../DashboardHospitalPage/DashboardHospitalPage';
import AdminDashboard from '../AdminDashboard/AdminDashboard';

const UnifiedDashboard = () => {
    const { userType, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if not logged in
        if (!isLoading && !userType) {
            navigate('/login');
        }
    }, [isLoading, userType, navigate]);

    if (isLoading) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-gray-100 p-0">
                <div
                    className="text-xl font-semibold text-gray-600"
                    role="status"
                    aria-live="polite"
                >
                    Cargando...
                </div>
            </main>
        );
    }

    // Render appropriate dashboard based on user type
    if (userType === 'hospital') {
        return <DashboardHospitalPage />;
    } else if (userType === 'bloodDonor') {
        return <DashboardPage />;
    } else if (userType === 'admin') {
        return <AdminDashboard />;
    }

    return null;
};

export default UnifiedDashboard;
