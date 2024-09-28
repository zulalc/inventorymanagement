import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getSuppliers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const suppliers = await prisma.suppliers.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving suppliers+" });
  }
};

export const createSupplier = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { supplierId, name, contactInfo, status } = req.body;
    const supplier = await prisma.suppliers.create({
      data: {
        supplierId,
        name,
        contactInfo,
        status,
      },
    });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Error creating supplier" });
  }
};

export const deleteSupplier = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { supplierId } = req.params;

    const supplier = await prisma.suppliers.findUnique({
      where: { supplierId },
    });

    if (!supplier) {
      res.status(404).json({ message: "Supplier not found" });
    }

    const associatedProducts = await prisma.products.findMany({
      where: { supplierId },
    });

    if (associatedProducts.length > 0) {
      await prisma.products.updateMany({
        where: { supplierId },
        data: {
          status: "inactive",
        },
      });
    }

    await prisma.suppliers.update({
      where: { supplierId },
      data: {
        status: "inactive",
      },
    });

    res.status(200).json({
      message: "Supplier and associated products made inactive successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error  supplier", error.message);
      res
        .status(500)
        .json({ message: `Error inactivating supplier: ${error.message}` });
    } else {
      console.error("Unexpected error inactivating supplier:", error);
      res
        .status(500)
        .json({ message: "Unexpected error inactivating supplier" });
    }
  }
};

export const updateSupplier = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { supplierId } = req.params;
    const { name, contactInfo, status } = req.body;
    console.log("Data to update:", {
      name,
      contactInfo,
      status,
    });

    const existingSupplier = await prisma.suppliers.findUnique({
      where: { supplierId },
    });

    if (!existingSupplier) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }

    const updatedSupplier = await prisma.suppliers.update({
      where: { supplierId },
      data: {
        name,
        contactInfo,
        status,
      },
    });
    console.log("Updated supplier:", updatedSupplier);
    res.status(200).json({
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating supplier:", error.message);
      res
        .status(500)
        .json({ message: "Error updating supplier", error: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Unexpected error" });
    }
  }
};
