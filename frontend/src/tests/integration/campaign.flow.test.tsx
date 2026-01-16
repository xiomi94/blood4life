/**
 * =============================================================================
 * TEST DE INTEGRACIÓN - Admin Dashboard
 * =============================================================================
 * 
 * TIPO: Integración (Integration Test)
 * 
 * PROPÓSITO:
 * Verifica flujos completos de administración que involucran múltiples 
 * componentes trabajando juntos: AdminDashboard, servicios, contextos, 
 * modales de confirmación, y la interacción del usuario.
 * 
 * QUÉ SE PRUEBA:
 * - Flujos end-to-end de eliminación de entidades (donantes)
 * - Manejo resiliente de errores parciales (algunos servicios fallan pero 
 *   el dashboard sigue funcionando)
 * - Integración entre componentes UI, hooks personalizados y servicios
 * - Interacciones de usuario (clicks, confirmaciones)
 * 
 * DIFERENCIA CON TESTS UNITARIOS:
 * - Los tests unitarios prueban componentes/funciones de forma aislada
 * - Estos tests de integración prueban cómo los componentes funcionan juntos
 * - Se mockean servicios externos (API) pero no componentes internos
 * 
 * =============================================================================
 */

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
        getAppointments: vi.fn(),
        getAppointmentStatuses: vi.fn(),
        getCampaigns: vi.fn(),
        deleteBloodDonor: vi.fn(),
        deleteHospital: vi.fn(),
        deleteAppointment: vi.fn(),
        deleteCampaign: vi.fn(),
        updateBloodDonor: vi.fn(),
        updateHospital: vi.fn(),
        updateAppointment: vi.fn(),
        updateCampaign: vi.fn(),
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
        vi.mocked(adminService.getAppointments).mockResolvedValue([]);
        vi.mocked(adminService.getAppointmentStatuses).mockResolvedValue([]);
        vi.mocked(adminService.getCampaigns).mockResolvedValue([]);

        render(
            <LanguageProvider>
                <AuthContext.Provider value={mockAdminContext}>
                    <BrowserRouter>
                        <AdminDashboard />
                    </BrowserRouter>
                </AuthContext.Provider>
            </LanguageProvider>
        );

        expect(await screen.findByText(/dashboard.admin.title/i)).toBeInTheDocument();
        expect(await screen.findByText(/Juan Perez/i)).toBeInTheDocument();

        const delBtn = screen.getAllByRole('button', { name: /dashboard.admin.table.delete/i })[0];
        fireEvent.click(delBtn);

        // Esperar a que el diálogo de confirmación aparezca y confirmar
        const confirmBtn = await screen.findByRole('button', { name: /common.delete/i });
        fireEvent.click(confirmBtn);

        expect(adminService.deleteBloodDonor).toHaveBeenCalledWith(1);
        await waitFor(() => {
            expect(screen.queryByText(/Juan Perez/i)).not.toBeInTheDocument();
        });
    });

    it('debe manejar errores parcialmente fallidos sin bloquear el dashboard', async () => {
        // Suprimir console.error para este test ya que el error es esperado
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Stats falla, pero el resto carga
        vi.mocked(dashboardService.getStats).mockRejectedValue(new Error('Fail'));
        // Mockear el resto para que no sean undefined/pending
        vi.mocked(adminService.getBloodDonors).mockResolvedValue([]);
        vi.mocked(adminService.getHospitals).mockResolvedValue([]);
        vi.mocked(adminService.getAppointments).mockResolvedValue([]);
        vi.mocked(adminService.getAppointmentStatuses).mockResolvedValue([]);
        vi.mocked(adminService.getCampaigns).mockResolvedValue([]);

        render(
            <LanguageProvider>
                <AuthContext.Provider value={mockAdminContext}>
                    <BrowserRouter>
                        <AdminDashboard />
                    </BrowserRouter>
                </AuthContext.Provider>
            </LanguageProvider>
        );

        // El dashboard DEBE mostrarse a pesar del error en stats (resiliencia)
        expect(await screen.findByText(/dashboard.admin.title/i)).toBeInTheDocument();
        // Opcional: Verificar que no hay error global
        expect(screen.queryByText(/dashboard.admin.errors.loadAdminData/i)).not.toBeInTheDocument();

        // Restaurar console.error
        consoleErrorSpy.mockRestore();
    });
});
