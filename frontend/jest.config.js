import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  roots: [resolve(__dirname, './src/tests')],
  transform: {
    '^.+\\.(ts|js)x?$': 'ts-jest',
  },
  testMatch: [
    resolve(__dirname, './src/tests/Homepage.test.tsx'),
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/fileMock.js"
  },
  testEnvironment: 'jsdom',
}