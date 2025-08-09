import { UserRole } from "../src/database/mysql/entities/User";

export const mockEventRepository = {
  find: jest.fn().mockResolvedValue([
    {
      id: "event-1",
      nameEvent: "Mock Event 1",
      location: "Jakarta",
      startDate: new Date("2025-12-01"),
      endDate: new Date("2025-12-02"),
      totalTicket: 100,
      ticketPrice: 50000,
      description: "Event Mocking",
    },
  ]),
};

export const mockUserRepository = {
  findOneBy: jest.fn().mockResolvedValue({
    id: "mock-user-id",
    userName: "mockuser",
    password: "hashedpassword",
    role: UserRole.ADMIN,
  }),
};

// Default AppDataSource mock
export const mockAppDataSource = {
  getRepository: jest.fn().mockImplementation((entity) => {
    if (entity.name === "Event") return mockEventRepository;
    if (entity.name === "User") return mockUserRepository;
    return {};
  }),
  isInitialized: true,
};
