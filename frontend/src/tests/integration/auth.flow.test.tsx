/**
 * =============================================================================
 * TEST DE INTEGRACIÓN - Flujo de Autenticación
 * =============================================================================
 * 
 * TIPO: Integración (Integration Test)
 * 
 * PROPÓSITO:
 * Verifica el flujo completo de autenticación que involucra el componente
 * LoginForm junto con los contextos de autenticación y lenguaje.
 * 
 * QUÉ SE PRUEBA:
 * - Renderizado del formulario de login con todos sus elementos
 * - Interacción del usuario (llenar campos, submit del formulario)
 * - Validación de campos requeridos
 * - Integración entre LoginForm, AuthContext y LanguageProvider
 * 
 * NOTA:
 * Aunque se mockea el AuthContext, este test verifica la integración 
 * entre múltiples componentes y contextos, no solo el LoginForm en aislamiento.
 * 
 * =============================================================================
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { LanguageProvider } from '../../context/LanguageContext';
import LoginForm from '../../components/features/auth/LoginForm/LoginForm';

describe('Flujo de Autenticación (Integración)', () => {
    const mockAuthContext = {
        user: null,
        userType: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        refreshUser: vi.fn(async () => { }),
    };

    it('debe renderizar el formulario de login y permitir interacción', async () => {
        render(
            <LanguageProvider>
                <AuthContext.Provider value={mockAuthContext}>
                    <BrowserRouter>
                        <LoginForm />
                    </BrowserRouter>
                </AuthContext.Provider>
            </LanguageProvider>
        );

        // Verificar que el formulario se renderiza
        expect(screen.getByLabelText(/auth.login.email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/auth.login.password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /auth.login.submit/i })).toBeInTheDocument();

        // Rellenar formulario
        const emailInput = screen.getByLabelText(/auth.login.email/i);
        const passwordInput = screen.getByLabelText(/auth.login.password/i);

        fireEvent.change(emailInput, {
            target: { name: 'username', value: 'test@donor.com' }
        });
        fireEvent.change(passwordInput, {
            target: { name: 'password', value: 'Password123!' }
        });

        // Verificar que los valores se actualizaron
        expect(emailInput).toHaveValue('test@donor.com');
        expect(passwordInput).toHaveValue('Password123!');
    });

    it('debe validar campos requeridos', async () => {
        render(
            <LanguageProvider>
                <AuthContext.Provider value={mockAuthContext}>
                    <BrowserRouter>
                        <LoginForm />
                    </BrowserRouter>
                </AuthContext.Provider>
            </LanguageProvider>
        );

        // Intentar submit sin llenar campos
        const submitBtn = screen.getByRole('button', { name: /auth.login.submit/i });
        fireEvent.click(submitBtn);

        // Verificar que no se llamó a login (validación HTML5 impide el submit)
        await waitFor(() => {
            expect(mockAuthContext.login).not.toHaveBeenCalled();
        }, { timeout: 1000 });
    });
});
