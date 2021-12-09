const request = require("supertest");
const app = require("../app");

const random = Math.floor(Math.random() * 100);

describe("TEST /clients", () => {
  it("POST /clients", async () => {
    const response = await request(app).post("/clients").send({
      client_name: "Rodrigo",
      email: `rodrigo${random}@test.com`,
      password: "123456"
    }).set("Content-Type", "application/json")
    .expect(201);

    expect(response.ok).toBeTruthy();
  })
});