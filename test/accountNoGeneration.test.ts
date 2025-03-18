import { Knex } from "knex";
import { generateUniqueAccountNumber } from "../src/utils/";

describe("generateUniqueAccountNumber", () => {
  let mockDb: jest.MockedFunction<any>;

  beforeEach(() => {
    mockDb = jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null),
    }));
  });

  test("should generate a 10-digit account number", async () => {
    const accountNumber = await generateUniqueAccountNumber(mockDb as unknown as Knex);
    expect(accountNumber).toMatch(/^\d{10}$/); 
  });

  test("should retry if the generated number already exists", async () => {
    let callCount = 0;

    mockDb.mockImplementation(() => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockImplementation(async () => {
        if (callCount === 0) {
          callCount++;
          return { account_number: "1234567890" };
        }
        return null; 
      }),
    }));

    const accountNumber = await generateUniqueAccountNumber(mockDb as unknown as Knex);
    expect(accountNumber).toMatch(/^\d{10}$/);
  });

  test("should generate unique account numbers on multiple calls", async () => {
    const accountNumbers = new Set();

    for (let i = 0; i < 1000; i++) {
      const accountNumber = await generateUniqueAccountNumber(mockDb as unknown as Knex);
      expect(accountNumbers.has(accountNumber)).toBe(false); 
      accountNumbers.add(accountNumber);
    }

    expect(accountNumbers.size).toBe(1000);
  });
});
