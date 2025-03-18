import { generateTransactionReference } from "../src/utils/index";

describe("Transaction Reference Generator", () => {
  test("should generate unique transaction references", () => {
    const referenceSet = new Set();
    for (let i = 0; i < 100000; i++) {
      const reference = generateTransactionReference();
      expect(referenceSet.has(reference)).toBe(false); // Ensure uniqueness
      referenceSet.add(reference);
    }
  });

  test("should generate 1 million references within time limit", () => {
    const count = 1000000;
    console.time("Transaction reference generation");

    for (let i = 0; i < count; i++) {
      generateTransactionReference();
    }

    console.timeEnd("Transaction reference generation");
  });
});
