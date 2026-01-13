/**
 * =============================================================================
 * TEST UNITARIO - ThemeToggle Component
 * =============================================================================
 * 
 * TIPO: Unitario de Componente Interactivo Simple (Simple Interactive Component Unit Test)
 * 
 * PROPÓSITO:
 * Verifica el comportamiento de un componente pequeño e interactivo que 
 * permite cambiar entre modo claro y oscuro.
 * 
 * QUÉ SE PRUEBA:
 * - Renderizado correcto del toggle en modo claro (aria-label apropiado)
 * - Renderizado correcto del toggle en modo oscuro  
 * - Interacción del usuario (click en el toggle)
 * - Llamada correcta a la función toggleTheme del contexto
 * 
 * PARTICULARIDAD:
 * Este es un test de componente "tonto" (dumb component) que:
 * - Recibe datos del contexto
 * - Ejecuta una función callback cuando se interactúa con él
 * - No tiene lógica de negocio compleja
 * - Solo maneja UI e interacción básica
 * 
 * La lógica del tema en sí está en el ThemeContext, no en este componente.
 * 
 * =============================================================================
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeToggle from '../../components/common/ui/ThemeToggle/ThemeToggle';
import { ThemeContext } from '../../context/ThemeContext';

const mockThemeContext = {
    isDarkMode: false,
    toggleTheme: vi.fn(),
};

const renderWithProvider = (ui: React.ReactElement, providerValue = mockThemeContext) => {
    return render(
        <ThemeContext.Provider value={providerValue}>
            {ui}
        </ThemeContext.Provider>
    );
};

describe('ThemeToggle (Componente Simple/Estático)', () => {
    it('debe renderizar con el aria-label correcto para modo claro', () => {
        renderWithProvider(<ThemeToggle />);
        const checkbox = screen.getByLabelText(/Cambiar a modo oscuro/i);
        expect(checkbox).toBeInTheDocument();
    });

    it('debe renderizar con el aria-label correcto para modo oscuro', () => {
        renderWithProvider(<ThemeToggle />, { ...mockThemeContext, isDarkMode: true });
        const checkbox = screen.getByLabelText(/Cambiar a modo claro/i);
        expect(checkbox).toBeInTheDocument();
    });

    it('debe llamar a toggleTheme cuando se hace click', () => {
        renderWithProvider(<ThemeToggle />);
        const checkbox = screen.getByLabelText(/Cambiar a modo oscuro/i);
        fireEvent.click(checkbox);
        expect(mockThemeContext.toggleTheme).toHaveBeenCalledTimes(1);
    });
});
