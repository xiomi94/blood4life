/**
 * Tipos y interfaces compartidos de la aplicación
 * Centraliza definiciones de tipos para evitar duplicación
 */

// ========================================
// User Types
// ========================================

/** Tipos de usuario en el sistema */
export type UserType = 'bloodDonor' | 'hospital' | 'admin';

/** Información del tipo de sangre */
export interface BloodType {
    id: number;
    type: string;
}

/** Perfil completo de usuario (puede ser donante, hospital o admin) */
export interface UserProfile {
    id: number;

    // Blood Donor specific fields
    firstName?: string;
    lastName?: string;

    // Hospital specific fields
    name?: string;

    // Common fields
    email: string;
    imageName?: string;
    bloodType?: BloodType;
    dni?: string;
    gender?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    cif?: string;
    address?: string;
    postalCode?: string;
}

// ========================================
// Authentication Types
// ========================================

/** Credenciales de login */
export interface LoginCredentials {
    email: string;
    password: string;
    userType: UserType;
}

/** Respuesta de login del servidor */
export interface LoginResponse {
    status: string;
    message: string;
}

// ========================================
// Campaign Types
// ========================================

/** Datos del formulario de campaña */
export interface CampaignFormData {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    requiredDonorQuantity: number;
    requiredBloodTypes: string[];
}

/** Campaña completa */
export interface Campaign {
    id: number;
    hospitalId: number;
    hospitalName: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    requiredDonorQuantity: number;
    requiredBloodType: string;
    currentDonorCount?: number;
}

// ========================================
// Appointment Types
// ========================================

/** Cita médica */
export interface Appointment {
    id: number;
    donorId: number;
    donorName?: string;
    donorEmail?: string;
    campaignId: number;
    campaignName?: string;
    hospitalId?: number;
    hospitalName?: string;
    dateAppointment: string;
    hourAppointment: string;
    status: AppointmentStatus;
}

/** Estados posibles de una cita */
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

// ========================================
// Statistics Types
// ========================================

/** Estadísticas del dashboard */
export interface DashboardStats {
    totalDonors: number;
    totalCampaigns: number;
    totalAppointments: number;
    completedDonations: number;
    pendingAppointments: number;
    activeBloodDonors?: number;
    activeHospitals?: number;
    activeCampaigns?: number;
}

// ========================================
// Form Types
// ========================================

/** Tipos de input HTML comunes */
export type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'date';

/** Props base para campos de formulario */
export interface BaseFormFieldProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    placeholder?: string;
    autoComplete?: string;
    'aria-invalid'?: boolean;
}

/** Errores de validación de formulario */
export interface ValidationErrors {
    [fieldName: string]: string;
}

// ========================================
// API Response Types
// ========================================

/** Respuesta genérica de la API */
export interface ApiResponse<T = unknown> {
    data: T;
    status: number;
    message?: string;
}

/** Error de la API */
export interface ApiError {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
}

// ========================================
// Pagination Types
// ========================================

/** Parámetros de paginación */
export interface PaginationParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/** Respuesta paginada */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ========================================
// Filter and Search Types
// ========================================

/** Parámetros de búsqueda */
export interface SearchParams {
    query: string;
    filters?: Record<string, unknown>;
}

// ========================================
// Modal Types
// ========================================

/** Props base para modales */
export interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

// ========================================
// Notification Types
// ========================================

/** Tipo de notificación toast */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/** Datos de notificación */
export interface NotificationData {
    type: ToastType;
    message: string;
    duration?: number;
}

// ========================================
// Chart Types
// ========================================

/** Datos para gráficos */
export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

/** Dataset de gráfico */
export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
}

// ========================================
// Theme Types
// ========================================

/** Tema de la aplicación */
export type Theme = 'light' | 'dark';

// ========================================
// Language Types
// ========================================

/** Idiomas soportados */
export type Language = 'es' | 'en' | 'de' | 'fr' | 'ja' | 'zh';

// ========================================
// Utility Types
// ========================================

/** Hace todas las propiedades opcionales de forma profunda */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Extrae tipos únicos de un array */
export type ItemType<T extends readonly unknown[]> = T[number];

/** Callback genérico */
export type Callback<T = void> = () => T;

/** Callback asíncrono */
export type AsyncCallback<T = void> = () => Promise<T>;
