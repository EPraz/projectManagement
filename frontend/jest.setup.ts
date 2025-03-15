import "@testing-library/jest-dom";
import "cross-fetch/polyfill";
import { TextEncoder, TextDecoder } from "util";
import fetchMock from "jest-fetch-mock";
import { jest } from "@jest/globals";

fetchMock.enableMocks();

if (typeof global.TextEncoder === "undefined") {
  (global as any).TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  (global as any).TextDecoder = TextDecoder;
}

jest.mock("../frontend/src/constants/apiConstant", () => ({
  API_URL: "mock_api_url",
}));

if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // legacy
    removeListener: jest.fn(), // legacy
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(() => false),
  });
}
