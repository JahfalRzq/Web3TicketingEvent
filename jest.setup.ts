// jest.setup.ts
import { jest } from "@jest/globals";

jest.mock("./__mocks__/checkJwt");
jest.mock("./__mocks__/db");
jest.mock("./__mocks__/mongo");
