import { useAuth } from '../../context/AuthContext';
import DashboardPage from '../DashboardBloodDonorPage/DashboardBloodDonorPage';
import DashboardHospitalPage from '../DashboardHospitalPage/DashboardHospitalPage';

const UnifiedDashboard = () => {
    const { userType, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-0">
                <div className="text-xl font-semibold text-gray-600">Cargando...</div>
            </div>
        );
    }

    // Render appropriate dashboard based on user type
    if (userType === 'hospital') {
        return <DashboardHospitalPage />;
    } else if (userType === 'bloodDonor') {
        return <DashboardPage />;
    }

    // If no user type (not logged in), redirect to login
    window.location.href = '/login';
    return null;
};

export default UnifiedDashboard;
