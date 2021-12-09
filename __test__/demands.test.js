const request = require("supertest");
const app = require("../app");
var token;

describe("TEST /demands", () => {

  it("LOGIN POST /clients", async () => {
    const response = await request(app).post("/clients/login").send({
      email: "rodrigo@test.com",
      password: "123456",
    }).set("Content-Type", "application/json")
    .expect(200);

    expect(response.ok).toBeTruthy();
    expect(response.body).toHaveProperty("token");

    token = response.body.token;
  });

  it("POST /demands", async () => {
    const demand = {
      id_product: 9,
      amounts: 12
    };

    const response = await request(app).post("/demands")
    .send(demand)
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .expect(201);

    expect(response.ok).toBeTruthy();

  });

  it("GET /demands", async () => {
    const response = await request(app).get("/demands")
    .set("Authorization", token)
    .expect(200);

    expect(response.ok).toBeTruthy();
  })

  it("GET /demands/:id", async () => {
    const id = 22;

    const response = await request(app).get("/demands/" + id)
    .set("Authorization", token)
    .expect(200);

    expect(response.ok).toBeTruthy();
  })

  it("PATCH /demands", async () => {
    const demand = {id_product: 9, amounts: 10};
    const id = 22;
    const response = await request(app).patch("/demands/" + id).send(demand)
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .expect(200);

    expect(response.ok).toBeTruthy();

  })

  it("DELETE /demands", async () => {
    const id = 22;
    const response = await request(app).delete("/demands/" + id)
    .set("Authorization", token)
    .expect(202);

    expect(response.ok).toBeTruthy();

  })
})