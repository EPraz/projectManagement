import "@testing-library/jest-dom";
import "cross-fetch/polyfill";
import { TextEncoder, TextDecoder } from "util";
import fetchMock from "jest-fetch-mock";
import { jest } from "@jest/globals";

fetchMock.enableMocks();

if (typeof global.TextEncoder === "undefined") {
  Object.defineProperty(global, "TextEncoder", { value: TextEncoder, configurable: true });
}

if (typeof global.TextDecoder === "undefined") {
  Object.defineProperty(global, "TextDecoder", { value: TextDecoder, configurable: true });
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
