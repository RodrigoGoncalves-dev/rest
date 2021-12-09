const request = require("supertest");
const app = require("../app");

const random = Math.floor(Math.random() * 100);

describe("TEST /users", () => {
  it("POST /users", async () => {
    const response = await request(app).post("/users").send({
      username: "Rodrigo",
      email: `rodrigo${random}@test.com`,
      user_password: "123456"
    }).set("Content-Type", "application/json")
    .expect(201);

    expect(response.ok).toBeTruthy();
  })
});