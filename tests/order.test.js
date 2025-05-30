jest.setTimeout(20000);

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const Order = require("../models/order");

const app = express();

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterEach(async () => {
  await Order.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Order API", () => {
  const authHeader = { Authorization: "Bearer fake-jwt-token" };

  it("should create a new order", async () => {
    const newOrder = {
      userId: "user123",
      productId: "product456",
      quantity: 2,
      totalPrice: 150.0,
    };

    const res = await request(app)
      .post("/api/data/orders")
      .set(authHeader)
      .send(newOrder);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.userId).toBe("user123");
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/data/orders")
      .set(authHeader)
      .send({ quantity: 1 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it("should fetch all orders", async () => {
    await Order.create({
      userId: "testuser",
      productId: "product123",
      quantity: 1,
      totalPrice: 50,
    });

    const res = await request(app).get("/api/data/orders");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it("should delete an order", async () => {
    const order = await Order.create({
      userId: "testuser",
      productId: "product123",
      quantity: 1,
      totalPrice: 50,
    });

    const res = await request(app)
      .delete(`/api/data/orders/${order._id}`)
      .set(authHeader);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it("should return 404 for deleting non-existing order", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/data/orders/${fakeId}`)
      .set(authHeader);

    expect(res.statusCode).toBe(404);
  });
});
