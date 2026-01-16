/**
 * =============================================================================
 * TEST UNITARIO - UpcomingAppointments Component
 * =============================================================================
 * 
 * TIPO: Unitario de Componente de Presentación (Presentational Component Unit Test)
 * 
 * PROPÓSITO:
 * Verifica el comportamiento de un componente puramente presentacional que
 * recibe datos via props y los renderiza sin lógica compleja ni efectos.
 * 
 * QUÉ SE PRUEBA:
 * - Renderizado correcto cuando hay citas (muestra la lista)
 * - Renderizado del estado vacío (no hay citas programadas)
 * - Formateo correcto de fechas según locale
 * - Visualización correcta de información de cada cita
 * 
 * PARTICULARIDAD:
 * Este es uno de los tests más simples - un componente puro que:
 * - No hace fetch de datos
 * - No tiene estado interno complejo
 * - Solo renderiza lo que recibe por props
 * 
 * Ideal para verificar lógica de presentación y formateo de datos.
 * 
 * =============================================================================
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UpcomingAppointments } from '../../components/features/donor/UpcomingAppointments';
import type { Appointment } from '../../services/appointmentService';
import type { Campaign } from '../../types/common.types';

describe('UpcomingAppointments Component', () => {
    const mockAppointments: Appointment[] = [
        {
            id: 1,
            campaignId: 10,
            dateAppointment: '2026-05-20',
            hourAppointment: '10:00 AM',
            appointmentStatus: { id: 1, name: 'Scheduled' },
            bloodDonorId: 1
        },
        {
            id: 2,
            campaignId: 11,
            dateAppointment: '2026-06-15',
            hourAppointment: '11:00 AM',
            appointmentStatus: { id: 1, name: 'Scheduled' },
            bloodDonorId: 1
        }
    ];

    const mockCampaigns: Campaign[] = [
        {
            id: 10,
            hospitalId: 1,
            hospitalName: 'Hospital Central',
            name: 'Campaña de Verano',
            description: 'Donación de sangre anual',
            startDate: '2026-05-01',
            endDate: '2026-05-31',
            location: 'Av. Principal 123',
            requiredDonorQuantity: 100,
            requiredBloodType: 'A+'
        },
        {
            id: 11,
            hospitalId: 2,
            hospitalName: 'Clínica Norte',
            name: 'Campaña de Invierno',
            description: 'Donación urgente',
            startDate: '2026-06-01',
            endDate: '2026-06-30',
            location: 'Calle Norte 456',
            requiredDonorQuantity: 50,
            requiredBloodType: 'O-'
        }
    ];

    it('debe mostrar un mensaje cuando no hay citas', () => {
        render(<UpcomingAppointments appointments={[]} campaigns={[]} />);
        expect(screen.getByText(/No tienes citas programadas/i)).toBeInTheDocument();
    });

    it('debe renderizar la lista de citas correctamente', () => {
        render(<UpcomingAppointments appointments={mockAppointments} campaigns={mockCampaigns} />);

        // Verificar que aparecen las fechas formateadas (Locale es-ES en el componente)
        expect(screen.getByText('20/05/2026')).toBeInTheDocument();
        expect(screen.getByText('15/06/2026')).toBeInTheDocument();

        // Verificar que aparece el Nombre del Hospital (que es lo que renderiza el componente)
        expect(screen.getByText('Hospital Central')).toBeInTheDocument();
        expect(screen.getByText('Clínica Norte')).toBeInTheDocument();

        // Verificar ubicaciones
        expect(screen.getByText('Av. Principal 123')).toBeInTheDocument();
        expect(screen.getByText('Calle Norte 456')).toBeInTheDocument();
    });
});
