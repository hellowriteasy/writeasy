const AuthService = require("../../src/services/AuthService");
const User = require("../models/user");

jest.mock("../models/user");

describe("AuthService", () => {
  it("should register a new user correctly", async () => {
    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue(true);

    const authService = new AuthService();
    const token = await authService.registerUser(
      "testUser",
      "test@example.com",
      "password123"
    );

    expect(token).toBeDefined();
  });
});
