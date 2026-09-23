require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");

describe("API", () => {
  test("GET / returns API status", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/running/i);
  });

  test("protected task endpoint rejects missing JWT", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(401);
  });
});
