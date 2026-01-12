import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../../../context/ThemeContext';

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
