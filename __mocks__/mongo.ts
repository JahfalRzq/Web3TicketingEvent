// __mocks__/mongo.ts
export const connectMongo = jest.fn().mockResolvedValue(true);

export const mongoClient = {
  db: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      insertOne: jest.fn().mockResolvedValue({ insertedId: "mockId" }),
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      }),
    }),
  }),
};
