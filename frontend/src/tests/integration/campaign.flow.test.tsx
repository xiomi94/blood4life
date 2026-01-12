import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { LanguageProvider } from '../../context/LanguageContext';
import AdminDashboard from '../../pages/AdminDashboard/AdminDashboard';
import { adminService } from '../../services/adminService';
import { dashboardService } from '../../services/dashboardService';

// Mock services directly
vi.mock('../../services/dashboardService', () => ({
    dashboardService: {
        getStats: vi.fn(),
    }
}));

vi.mock('../../services/adminService', () => ({
    adminService: {
        getBloodDonors: vi.fn(),
        getHospitals: vi.fn(),
        deleteBloodDonor: vi.fn(),
        deleteHospital: vi.fn(),
    }
}));

// Mock chart.js
vi.mock('chart.js', () => ({
    Chart: { register: vi.fn() },
    CategoryScale: vi.fn(),
    LinearScale: vi.fn(),
    BarElement: vi.fn(),
    Title: vi.fn(),
    Tooltip: vi.fn(),
    Legend: vi.fn(),
}));

vi.mock('react-chartjs-2', () => ({
    Bar: () => <div data-testid="mock-bar-chart" />
}));

describe('Flujo de Administración (Integración)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'confirm').mockImplementation(() => true);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const mockAdminContext = {
        user: { id: 0, email: 'admin@blood4life.com', userType: 'admin' },
        userType: 'admin' as const,
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        refreshUser: vi.fn(async () => { }),
    };

    it('debe listar donantes y permitir eliminarlos', async () => {
        vi.mocked(dashboardService.getStats).mockResolvedValue({ totalUsers: { labels: ['A'], counts: [1] } } as any);
        vi.mocked(adminService.getBloodDonors).mockResolvedValue([{ id: 1, firstName: 'Juan', lastName: 'Perez', email: 'j@t.com', dni: '1' }] as any);
        vi.mocked(adminService.getHospitals).mockResolvedValue([]);

        render(
            <LanguageProvider>
                <AuthContext.Provider value={mockAdminContext}>
                    <BrowserRouter>
                        <AdminDashboard />
                    </BrowserRouter>
                </AuthContext.Provider>
            </LanguageProvider>
        );

        expect(await screen.findByText(/Panel de Administración/i)).toBeInTheDocument();
        expect(await screen.findByText(/Juan Perez/i)).toBeInTheDocument();

        const delBtn = screen.getByText(/Eliminar/i);
        fireEvent.click(delBtn);

        expect(adminService.deleteBloodDonor).toHaveBeenCalledWith(1);
        await waitFor(() => {
            expect(screen.queryByText(/Juan Perez/i)).not.toBeInTheDocument();
        });
    });

    it('debe manejar errores', async () => {
        vi.mocked(dashboardService.getStats).mockRejectedValue(new Error('Fail'));

        render(
            <LanguageProvider>
                <AuthContext.Provider value={mockAdminContext}>
                    <BrowserRouter>
                        <AdminDashboard />
                    </BrowserRouter>
                </AuthContext.Provider>
            </LanguageProvider>
        );

        expect(await screen.findByText(/dashboard.admin.errors.loadAdminData/i)).toBeInTheDocument();
    });
});
