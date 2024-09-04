import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      //get all products & name must include whatever for search, if it does search we also search for that query
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    const product = await prisma.products.findUnique({
      where: { productId },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }

    await prisma.products.delete({
      where: { productId },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { name, price, stockQuantity, rating } = req.body;
    console.log("Data to update:", { name, price, stockQuantity, rating });

    // Check if the product exists
    const existingProduct = await prisma.products.findUnique({
      where: { productId },
    });

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Update the product
    const updatedProduct = await prisma.products.update({
      where: { productId },
      data: {
        name,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        rating: Number(rating),
      },
    });
    console.log("Updated product:", updatedProduct);
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating product:", error.message);
      res
        .status(500)
        .json({ message: "Error updating product", error: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Unexpected error" });
    }
  }
};
