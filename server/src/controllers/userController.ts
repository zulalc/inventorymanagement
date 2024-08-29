import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const users = await prisma.users.findMany({
      //get all products & name must include whatever for search, if it does search we also search for that query
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};
