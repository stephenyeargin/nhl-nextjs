// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill matchMedia for tests (used by components detecting color scheme)
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {}, // deprecated, but some libs still call
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

// Basic fetch polyfill for components using fetch (e.g., VideoCard blur placeholder)
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(async () => {
    const blobContent = new Uint8Array([71, 73, 70, 56]); // fake GIF header bytes

    return {
      ok: true,
      blob: async () => new Blob([blobContent], { type: 'image/gif' }),
      json: async () => ({}),
      text: async () => '',
    };
  });
}
