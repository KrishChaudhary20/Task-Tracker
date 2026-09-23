require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

describe("Auth utilities", () => {
  test("password hashing and comparison works", async () => {
    const hash = await bcrypt.hash("password123", 10);
    expect(hash).not.toBe("password123");
    expect(await bcrypt.compare("password123", hash)).toBe(true);
  });

  test("JWT can be signed and verified", () => {
    const secret = "test-secret";
    const token = jwt.sign({ id: "507f1f77bcf86cd799439011", role: "user" }, secret);
    const decoded = jwt.verify(token, secret);
    expect(decoded.role).toBe("user");
  });
});
