/**
 * =============================================================================
 * TEST UNITARIO PURO - Validation Utilities
 * =============================================================================
 * 
 * TIPO: Unitario Puro de Funciones (Pure Function Unit Test)
 * 
 * PROPÓSITO:
 * Verifica el comportamiento de funciones de validación puras que no tienen
 * efectos secundarios ni dependencias externas.
 * 
 * QUÉ SE PRUEBA:
 * - validateEmail: Validación de formato, longitud, espacios de emails
 * - validateDNI: Validación de formato de DNI español (8 dígitos + 1 letra)
 * - validatePassword: Validación de requisitos de contraseña (mayúsculas, minúsculas, números, longitud)
 * - validatePostalCode: Validación de códigos postales españoles (01000-52999)
 * 
 * CARACTERÍSTICAS:
 * - Tests completamente aislados (no usan React, DOM, ni APIs)
 * - Funciones puras: mismo input → mismo output, sin efectos secundarios
 * - Uso de it.each para tests parametrizados (reduce código repetitivo)
 * - 100% de cobertura de cada función de validación
 * 
 * ESTE ES EL TIPO MÁS SIMPLE DE TEST:
 * - No requiere renderizado
 * - No requiere mocks
 * - Solo verifica entrada → salida
 * 
 * Ideal para lógica de negocio pura sin dependencias.
 * 
 * =============================================================================
 */

import { describe, it, expect } from 'vitest';
import {
    validateEmail,
    validateDNI,
    validatePassword,
    validatePostalCode
} from '../../utils/validation';

describe('Validation Utils - Unit Tests', () => {

    // 1. validateEmail - 100% Cobertura
    describe('validateEmail', () => {
        it('debe devolver string vacío para un email válido', () => {
            expect(validateEmail('test@example.com')).toBe('');
            expect(validateEmail('user.name+label@domain.co.uk')).toBe('');
        });

        it('debe devolver error si el email está vacío', () => {
            expect(validateEmail('')).toBe('El email es obligatorio');
            expect(validateEmail('   ')).toBe('El email es obligatorio');
        });

        it('debe devolver error si el formato es inválido', () => {
            expect(validateEmail('test@')).toBe('El formato del email no es válido');
            expect(validateEmail('test@com')).toBe('El formato del email no es válido');
            expect(validateEmail('test.com')).toBe('El formato del email no es válido');
        });

        it('debe devolver error si contiene espacios', () => {
            expect(validateEmail('test @example.com')).toBe('El email no puede contener espacios');
        });

        it('debe devolver error si el dominio es demasiado corto', () => {
            expect(validateEmail('test@com')).toBe('El formato del email no es válido');
        });

        it('debe devolver error si excede 100 caracteres', () => {
            const longEmail = 'a'.repeat(91) + '@example.com';
            expect(validateEmail(longEmail)).toBe('El email no puede exceder 100 caracteres');
        });
    });

    // 2. validateDNI - 100% Cobertura
    describe('validateDNI', () => {
        it('debe validar un DNI correcto', () => {
            expect(validateDNI('12345678Z')).toBe('');
        });

        it('debe fallar si está vacío', () => {
            expect(validateDNI('')).toBe('El DNI es obligatorio');
        });

        it('debe fallar si el formato no es 8 números y 1 letra', () => {
            expect(validateDNI('1234567Z')).toBe('Formato de DNI inválido (ej: 12345678A)');
            expect(validateDNI('123456789')).toBe('Formato de DNI inválido (ej: 12345678A)');
            expect(validateDNI('ABC45678Z')).toBe('Formato de DNI inválido (ej: 12345678A)');
        });
    });

    // 3. validatePassword - Parametrizado (it.each)
    describe('validatePassword', () => {
        it.each([
            ['Password123!', ''],
            ['short', 'La contraseña debe tener al menos 8 caracteres'],
            ['nouppercase123!', 'Debe contener al menos una mayúscula'],
            ['NOLOWERCASE123!', 'Debe contener al menos una minúscula'],
            ['NoDigit!', 'Debe contener al menos un número'],
            ['Password 123', 'No puede contener espacios'],
        ])('para la contraseña "%s" debe devolver "%s"', (password, expected) => {
            expect(validatePassword(password)).toBe(expected);
        });
    });

    // 4. validatePostalCode - Parametrizado (it.each)
    describe('validatePostalCode', () => {
        it.each([
            ['28001', ''], // Madrid
            ['08001', ''], // Barcelona
            ['52001', ''], // Melilla
            ['00100', 'Código postal no válido (debe estar entre 01000 y 52999)'],
            ['53000', 'Código postal no válido (debe estar entre 01000 y 52999)'],
            ['123', 'El código postal debe tener exactamente 5 dígitos'],
            ['11111', 'Código postal no válido'], // Repetidos fallan según regex
        ])('para el CP "%s" debe devolver "%s"', (cp, expected) => {
            expect(validatePostalCode(cp)).toBe(expected);
        });
    });
});
