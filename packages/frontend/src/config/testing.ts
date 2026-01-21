import '@testing-library/jest-dom';

// TODO: remove this - for stub test only
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({}),
  } as Response)
);
