import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock window.location
const originalLocation = window.location;
delete (window as any).location;
window.location = { ...originalLocation, assign: vi.fn(), replace: vi.fn(), reload: vi.fn(), href: '' } as any;

// Mock react-i18next
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { changeLanguage: vi.fn() } }) }));

// Mock useWebSocket
vi.mock('./src/hooks/useWebSocket', () => ({ useWebSocket: () => ({ isConnected: true, subscribe: vi.fn(() => () => {}) }) }));
