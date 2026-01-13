import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Header from "../components/layout/Header/Header";

const mockAuthContext = {
    user: null,
    userType: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
};

const mockThemeContext = {
    isDarkMode: false,
    toggleTheme: vi.fn(),
};

function renderWithProviders(route: string, auth = mockAuthContext) {
    return render(
        <LanguageProvider>
            <ThemeContext.Provider value={mockThemeContext}>
                <AuthContext.Provider value={auth}>
                    <MemoryRouter initialEntries={[route]}>
                        <Header />
                    </MemoryRouter>
                </AuthContext.Provider>
            </ThemeContext.Provider>
        </LanguageProvider>
    );
}

describe("Header Component", () => {

    it("muestra logo e 'Inicio' cuando está en /register", () => {
        renderWithProviders("/register");

        expect(screen.getByAltText("Logo")).toBeInTheDocument();
        // Con el mock de t, el texto será la clave o el texto si t no está mockeado localmente pero sí globalmente
        expect(screen.getByText(/header.home/i)).toBeInTheDocument();
    });

    it("muestra botones Iniciar sesión y Registrarse en /index", () => {
        renderWithProviders("/index");

        expect(screen.getByText(/header.login/i)).toBeInTheDocument();
        expect(screen.getByText(/header.register/i)).toBeInTheDocument();
    });

    it("muestra solo botón Inicio en /login", () => {
        renderWithProviders("/login");

        expect(screen.getByText(/header.home/i)).toBeInTheDocument();
        expect(screen.queryByText(/header.login/i)).not.toBeInTheDocument();
    });

    it("muestra el avatar del usuario cuando está autenticado", () => {
        const auth = { ...mockAuthContext, isAuthenticated: true, user: { id: 1, email: 't@t.com' } };
        renderWithProviders("/dashboard", auth as any);

        // logo - alt text is different when authenticated
        expect(screen.getByAltText(/Blood4Life/i)).toBeInTheDocument();

        // avatar (verificado por aria-label del botón que lo contiene)
        expect(screen.getByRole('button', { name: /header.userMenu/i })).toBeInTheDocument();
    });

});
