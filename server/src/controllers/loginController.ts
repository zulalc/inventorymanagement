import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  try {
    const admin = await prisma.admins.findUnique({
      where: { username },
      select: {
        adminId: true,
        password: true,
        username: true,
      },
    });
    if (!admin) {
      console.log("Admin not found");
      res.status(401).json({ message: "user does not exist" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET not set");
      throw new Error("JWT_SECRET is not set");
    }

    // Create a JWT token if the login is successful
    const token = jwt.sign({ adminId: admin.adminId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error: any) {
    console.error("Full error object:", error);
    res
      .status(500)
      .json({ message: "Error logging in", error: error.message || error });
  }
};
