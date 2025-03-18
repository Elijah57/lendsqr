import { AuthService } from "../src/services/authService";
import { WalletService } from "../src/services/walletService";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

jest.mock("argon2");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;
//   let walletService: WalletService = new WalletService();

  beforeEach(() => {

    authService = new AuthService(new WalletService());
    (argon2.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockedToken");
  });

  test("should signup a new user", async () => {
    const data = {
        firstname: "firstname",
        lastname: "lastname",
        phoneno: "+234780823658",
        email: "test71@example.com",
        password: "password123"
    }
    const userDetail = await authService.signup(data);

    expect(userDetail.user).toHaveProperty("id");
    expect(userDetail.user.email).toBe("test71@example.com");
    expect(userDetail.user.firstname).toBe("firstname");
    expect(userDetail.user.lastname).toBe("hashedPassword");
  });

  test("should login a user and return a JWT token", async () => {
    const data = {
        firstname: "firstname",
        lastname: "lastname",
        phoneno: "+234780823658",
        email: "test5@example.com",
        password: "password123"
    }
    await authService.signup(data);
    
    const token = await authService.login("test5@example.com", "password123");

    expect(token.accessToken).toBe("mockedToken");
    expect(token.refreshToken).toBe("mockedToken");
  });

  test("should fail login if user not found", async () => {
    await expect(authService.login("notfound@example.com", "password123")).rejects.toThrow("User not found");
  });

//   test("should fail login if password is incorrect", async () => {
//     (argon2.verify as jest.Mock).mockResolvedValue(false);
//     await authService.signup("test@example.com", "password123");

//     await expect(authService.login("test@example.com", "wrongpassword")).rejects.toThrow("Invalid credentials");
//   });
});
