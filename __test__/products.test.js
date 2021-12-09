const request = require("supertest");
const app = require("../app");
var token;

describe("TEST /products", () => {

  const imgTest = `${__dirname}/upload/imgtest.jpeg`;

  it("LOGIN POST /users", async () => {
    const response = await request(app).post("/users/login").send({
      email: "rodrigo@test.com",
      user_password: "123456",
    }).set("Content-Type", "application/json")
    .expect(200);

    expect(response.ok).toBeTruthy();
    expect(response.body).toHaveProperty("token");

    token = response.body.token;
  });

  it("GET /products", async () => {
    const response = await request(app).get("/products")
    .expect(200);

    expect(response.ok).toBeTruthy();
  });

  it("GET /products/:id", async () => {
    const id = 20;
    const response = await request(app).get("/products/" + id)
    .expect(200);

    expect(response.ok).toBeTruthy();
  });

  it("PATCH /products/:id", async () => {
    const id = 20;
    const response = await request(app).patch("/products/" + id)
    .field("name", "Kaiak 100")
    .field("price", 120.11)
    .attach("product_image", imgTest)
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .expect(200);

    expect(response.ok).toBeTruthy();
    expect(response.body).toHaveProperty("idproduct");
  });

  it("POST /products", async () => {
    const response = await request(app).post("/products")
    .field("name", "Kaiak 100")
    .field("price", 120.11)
    .attach("product_image", imgTest)
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .expect(201);

    expect(response.ok).toBeTruthy();
    expect(response.body).toHaveProperty("idproduct");
  });

  it("DELETE /products/:id", async () => {
    const id = 20;
    const response = await request(app).delete("/products/" + id)
    .set("Authorization", token)
    .expect(202);

    expect(response.ok).toBeTruthy();
  });
})