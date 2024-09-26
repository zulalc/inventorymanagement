import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient(); //an auto-generated query builder
//that enables type - safe database access and reduces boilerplate

export const getDashboardData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const popularProducts = await prisma.sales.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true, // Sum the quantity sold for each product
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 10,
    });

    const productDetails = await Promise.all(
      popularProducts.map(async (sale) => {
        const product = await prisma.products.findUnique({
          where: {
            productId: sale.productId,
          },
        });
        return {
          ...product,
          totalQuantitySold: sale._sum.quantity,
        };
      })
    );

    const lowStockProducts = await prisma.products.findMany({
      where: {
        stockQuantity: {
          lt: 10000, // less than
        },
      },
      take: 15,
      orderBy: {
        stockQuantity: "asc", // ascending
      },
    });

    const users = await prisma.users.findMany({
      take: 20,
    });

    const salesSummary = await prisma.salesSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });

    const purchaseSummary = await prisma.purchaseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });

    const expenseSummary = await prisma.expenseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });

    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany(
      {
        take: 5,
        orderBy: {
          date: "desc",
        },
      }
    );

    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item) => ({
        ...item,
        amount: item.amount.toString(),
      })
    );

    res.json({
      popularProducts,
      productDetails,
      lowStockProducts,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  }
};
