import request from "supertest";
import { hashPassword } from "../utils/helperFunctions";

describe("register endpoint", () => {
  it("should return 201 and create a new user", async () => {
    const payload = {
      email: "test@example.com",
      password: "testpassword",
      confirmPassword: "testpassword",
      firstName: "Test",
      lastName: "User",
      phone: "1234567890",
      address: "123 Test St.",
    };
    const hashedPassword = await hashPassword(payload.password);

    // mock the prisma.user.findUnique method to return null
    jest.mock("@prisma/client", () => {
      return {
        user: {
          findUnique: jest.fn(() => Promise.resolve(null)),
          create: jest.fn(() =>
            Promise.resolve({
              email: payload.email,
              password: hashedPassword,
              firstName: payload.firstName,
              lastName: payload.lastName,
              phone: payload.phone,
              address: payload.address,
              profilePicture: "/uploads/profiles/avatar.webp",
            })
          ),
        },
      };
    });

    const res = await request("http://localhost:3000")
      .post("/api/v1/register")
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      success: true,
      message: "Ok.",
      data: {},
    });
  });
});
