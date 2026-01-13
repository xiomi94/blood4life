/**
 * =============================================================================
 * TEST UNITARIO - AuthContext (React Context)
 * =============================================================================
 * 
 * TIPO: Unitario de Lógica de Estado Global (Global State Logic Unit Test)
 * 
 * PROPÓSITO:
 * Verifica que el contexto de autenticación maneje correctamente el estado 
 * global de autenticación, persistencia en localStorage, y llamadas a la API.
 * 
 * QUÉ SE PRUEBA:
 * - Estado inicial (no autenticado, loading)
 * - Carga de sesión persistida desde localStorage al montar
 * - Selección correcta de endpoint según userType (bloodDonor, hospital, admin)
 * - Limpieza de autenticación cuando el token es inválido (401)
 * - Protección contra uso fuera del Provider (error esperado)
 * 
 * TÉCNICA:
 * - Se mockea axiosInstance para controlar respuestas de la API
 * - Se usa un TestComponent interno para consumir el contexto
 * - Se verifica el comportamiento del Provider, no de componentes UI
 * 
 * NOTA:
 * Aunque se renderiza un componente, el foco está en la LÓGICA del contexto,
 * no en la UI. Por eso es unitario, no de integración.
 * 
 * =============================================================================
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

// Mock axiosInstance
vi.mock('../../utils/axiosInstance', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() }
        }
    }
}));

// Test component to access context
function TestComponent() {
    const { user, userType, isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</div>
            <div data-testid="userType">{userType || 'none'}</div>
            <div data-testid="userEmail">{user?.email || 'none'}</div>
        </div>
    );
}

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('debe inicializar con usuario no autenticado', async () => {
        vi.mocked(axiosInstance.get).mockRejectedValue({ response: { status: 401 } });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
        expect(screen.getByTestId('userType')).toHaveTextContent('none');
    });

    it('debe cargar usuario autenticado desde localStorage', async () => {
        localStorage.setItem('userType', 'bloodDonor');
        vi.mocked(axiosInstance.get).mockResolvedValue({
            data: { id: 1, email: 'test@donor.com', userType: 'bloodDonor' }
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
        });

        expect(screen.getByTestId('userType')).toHaveTextContent('bloodDonor');
        expect(screen.getByTestId('userEmail')).toHaveTextContent('test@donor.com');
    });

    it('debe verificar endpoint correcto según userType', async () => {
        localStorage.setItem('userType', 'hospital');
        vi.mocked(axiosInstance.get).mockResolvedValue({
            data: { id: 2, email: 'hospital@test.com', userType: 'hospital' }
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(axiosInstance.get).toHaveBeenCalledWith('/hospital/me');
        });
    });

    it('debe limpiar auth si el token es inválido', async () => {
        localStorage.setItem('userType', 'bloodDonor');
        vi.mocked(axiosInstance.get).mockRejectedValue({ response: { status: 401 } });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
        });

        expect(localStorage.getItem('userType')).toBeNull();
    });

    it('debe lanzar error si useAuth se usa fuera de AuthProvider', () => {
        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useAuth must be used within an AuthProvider');

        consoleSpy.mockRestore();
    });
});
