import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UpcomingAppointments } from './UpcomingAppointments';
import type { Appointment } from '../../services/appointmentService';

describe('UpcomingAppointments Component', () => {
    const mockAppointments: Appointment[] = [
        {
            id: 1,
            campaignId: 10,
            dateAppointment: '2026-05-20',
            hourAppointment: '10:00 AM',
            status: 'scheduled',
            bloodDonorId: 1
        },
        {
            id: 2,
            campaignId: 11,
            dateAppointment: '2026-06-15',
            hourAppointment: '11:00 AM',
            status: 'scheduled',
            bloodDonorId: 1
        }
    ];

    it('debe mostrar un mensaje cuando no hay citas', () => {
        render(<UpcomingAppointments appointments={[]} />);
        expect(screen.getByText(/No tienes citas programadas/i)).toBeInTheDocument();
    });

    it('debe renderizar la lista de citas correctamente', () => {
        render(<UpcomingAppointments appointments={mockAppointments} />);

        // Verificar que aparecen las fechas formateadas (Locale es-ES en el componente)
        expect(screen.getByText('20/5/2026')).toBeInTheDocument();
        expect(screen.getByText('15/6/2026')).toBeInTheDocument();

        // Verificar que aparece el ID de campaña
        expect(screen.getByText(/Campaña #10/i)).toBeInTheDocument();
        expect(screen.getByText(/Campaña #11/i)).toBeInTheDocument();
    });
});
