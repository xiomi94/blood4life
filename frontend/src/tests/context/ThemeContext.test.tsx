/**
 * =============================================================================
 * TEST UNITARIO - ThemeContext (React Context)
 * =============================================================================
 * 
 * TIPO: Unitario de Lógica de Estado Global (Global State Logic Unit Test)
 * 
 * PROPÓSITO:
 * Verifica que el contexto de tema maneje correctamente el estado del tema
 * (claro/oscuro), su persistencia en localStorage, y la aplicación de clases CSS.
 * 
 * QUÉ SE PRUEBA:
 * - Estado inicial (tema claro por defecto)
 * - Toggle entre tema claro y oscuro
 * - Persistencia del tema en localStorage al cambiar
 * - Carga del tema guardado desde localStorage al inicializar
 * - Aplicación correcta de la clase 'dark' en document.documentElement
 * - Protección contra uso del hook fuera del Provider
 * 
 * TÉCNICA:
 * - Se usa un TestComponent interno para consumir y probar el contexto
 * - Se verifican tanto el estado interno como efectos secundarios (DOM, localStorage)
 * - Se simula el reload de la página con rerender
 * 
 * PARTICULARIDAD:
 * Este test verifica no solo lógica interna, sino también efectos secundarios
 * en el DOM y localStorage, asegurando que el tema persista correctamente.
 * 
 * =============================================================================
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

// Test component
function TestComponent() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div>
            <div data-testid="theme">{isDarkMode ? 'dark' : 'light'}</div>
            <button onClick={toggleTheme}>Toggle</button>
        </div>
    );
}

describe('ThemeContext', () => {
    it('debe inicializar con tema claro por defecto', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme')).toHaveTextContent('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('debe cambiar de tema al hacer toggle', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const toggleBtn = screen.getByRole('button', { name: /toggle/i });

        // Toggle to dark
        fireEvent.click(toggleBtn);
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);

        // Toggle back to light
        fireEvent.click(toggleBtn);
        expect(screen.getByTestId('theme')).toHaveTextContent('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('debe persistir tema en localStorage', () => {
        const { rerender } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const toggleBtn = screen.getByRole('button', { name: /toggle/i });
        fireEvent.click(toggleBtn);

        expect(localStorage.getItem('theme')).toBe('dark');

        // Remount with new provider to simulate page reload
        rerender(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
    });

    it('debe cargar tema desde localStorage', () => {
        localStorage.setItem('theme', 'dark');

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('debe lanzar error si useTheme se usa fuera de ThemeProvider', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useTheme must be used within a ThemeProvider');

        consoleSpy.mockRestore();
    });
});
