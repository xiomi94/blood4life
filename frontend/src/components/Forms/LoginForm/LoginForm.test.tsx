import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from './LoginForm';
import { BrowserRouter } from 'react-router';
import { AuthContext } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';

// Mock de i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const mockAuthContext = {
    user: null,
    userType: null as 'bloodDonor' | 'hospital' | 'admin' | null,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(async () => { }),
    isAuthenticated: false,
    isLoading: false,
};

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <BrowserRouter>
            <AuthContext.Provider value={mockAuthContext}>
                {ui}
            </AuthContext.Provider>
        </BrowserRouter>
    );
};

describe('LoginForm (Componente de Autenticación/Interacción)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe mostrar errores de validación si los campos están vacíos', () => {
        renderWithProviders(<LoginForm />);

        // Al ser campos "required" de HTML5, el navegador evitaría el submit, 
        // pero aquí testeamos que los campos existen
        expect(screen.getByLabelText(/auth.login.email/i)).toBeRequired();
        expect(screen.getByLabelText(/auth.login.password/i)).toBeRequired();
    });

    it('debe llamar al servicio de login con los datos correctos', async () => {
        const loginSpy = vi.spyOn(authService, 'login').mockResolvedValue({ status: 'success', message: 'Logged in' });

        renderWithProviders(<LoginForm />);

        fireEvent.change(screen.getByLabelText(/auth.login.email/i), {
            target: { name: 'username', value: 'test@donor.com' }
        });
        fireEvent.change(screen.getByLabelText(/auth.login.password/i), {
            target: { name: 'password', value: 'Password123!' }
        });

        fireEvent.click(screen.getByRole('button', { name: /auth.login.submit/i }));

        await vi.waitFor(() => {
            expect(loginSpy).toHaveBeenCalledWith('test@donor.com', 'Password123!', 'bloodDonor');
        });
    });

    it('debe mostrar mensaje de error si el login falla', async () => {
        vi.spyOn(authService, 'login').mockRejectedValue({
            response: { data: { error: 'auth.login.error' } }
        });

        renderWithProviders(<LoginForm />);

        fireEvent.change(screen.getByLabelText(/auth.login.email/i), {
            target: { name: 'username', value: 'wrong@email.com' }
        });
        fireEvent.change(screen.getByLabelText(/auth.login.password/i), {
            target: { name: 'password', value: 'wrongpass' }
        });

        fireEvent.click(screen.getByRole('button', { name: /auth.login.submit/i }));

        // Esperar a que aparezca el alert de error
        const errorAlert = await screen.findByRole('alert');
        expect(errorAlert).toHaveTextContent('auth.login.error');
    });
});
