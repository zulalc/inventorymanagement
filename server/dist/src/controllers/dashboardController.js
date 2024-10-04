"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient(); //an auto-generated query builder
//that enables type - safe database access and reduces boilerplate
const getDashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const popularProducts = yield prisma.sales.groupBy({
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
        const productDetails = yield Promise.all(popularProducts.map((sale) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield prisma.products.findUnique({
                where: {
                    productId: sale.productId,
                },
            });
            return Object.assign(Object.assign({}, product), { totalQuantitySold: sale._sum.quantity });
        })));
        const lowStockProducts = yield prisma.products.findMany({
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
        const users = yield prisma.users.findMany({
            take: 20,
        });
        const salesSummary = yield prisma.salesSummary.findMany({
            take: 35,
            orderBy: {
                date: "desc",
            },
        });
        const purchaseSummary = yield prisma.purchaseSummary.findMany({
            take: 15,
            orderBy: {
                date: "desc",
            },
        });
        const expenseSummary = yield prisma.expenseSummary.findMany({
            take: 15,
            orderBy: {
                date: "desc",
            },
        });
        const expenseByCategorySummaryRaw = yield prisma.expenseByCategory.findMany({
            take: 5,
            orderBy: {
                date: "desc",
            },
        });
        const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => (Object.assign(Object.assign({}, item), { amount: item.amount.toString() })));
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
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving dashboard metrics" });
    }
});
exports.getDashboardData = getDashboardData;
