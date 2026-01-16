/**
 * =============================================================================
 * TEST UNITARIO - CampaignList Component
 * =============================================================================
 * 
 * TIPO: Unitario de Componente Asíncrono (Async Component Unit Test)
 * 
 * PROPÓSITO:
 * Verifica el comportamiento del componente CampaignList que realiza fetching
 * de datos asíncrono, probando sus diferentes estados.
 * 
 * QUÉ SE PRUEBA:
 * - Estado de carga (loading) durante el fetch de datos
 * - Renderizado correcto de la lista cuando los datos se cargan exitosamente
 * - Manejo y visualización de errores cuando el fetch falla
 * - Comportamiento asíncrono del componente
 * 
 * PARTICULARIDAD:
 * Este test se enfoca en los estados asíncronos del componente:
 * - Loading → Success (muestra campañas)
 * - Loading → Error (muestra mensaje de error)
 * 
 * Se mockea el servicio para controlar las respuestas y simular diferentes escenarios.
 * 
 * =============================================================================
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CampaignList from '../../components/features/donor/CampaignList/CampaignList';
import { campaignService } from '../../services/campaignService';

// Mock del servicio
vi.mock('../../services/campaignService', () => ({
    campaignService: {
        getAllCampaigns: vi.fn(),
    },
}));

describe('CampaignList (Componente Asíncrono - Fetch)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe mostrar el estado de "Cargando" al montar', () => {
        // Definimos una promesa que no se resuelve inmediatamente
        vi.mocked(campaignService.getAllCampaigns).mockReturnValue(new Promise(() => { }));

        render(<CampaignList />);
        expect(screen.getByRole('status')).toHaveTextContent(/Cargando/i);
    });

    it('debe mostrar la lista de campañas cuando la petición es exitosa', async () => {
        const mockCampaigns = [
            { id: 1, name: 'Campaña Invierno', location: 'Madrid' },
            { id: 2, name: 'Donación UPM', location: 'Valencia' },
        ];
        vi.mocked(campaignService.getAllCampaigns).mockResolvedValue(mockCampaigns as any);

        render(<CampaignList />);

        // Esperar a que el título de una campaña aparezca
        const campaignItem = await screen.findByText('Campaña Invierno');
        expect(campaignItem).toBeInTheDocument();
        expect(screen.getByText('Valencia')).toBeInTheDocument();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('debe mostrar un mensaje de error si la petición falla', async () => {
        vi.mocked(campaignService.getAllCampaigns).mockRejectedValue(new Error('Fetch error'));

        render(<CampaignList />);

        const errorMessage = await screen.findByRole('alert');
        expect(errorMessage).toHaveTextContent(/Error al cargar campañas/i);
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});
