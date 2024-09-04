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
exports.updateProduct = exports.deleteProduct = exports.createProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const products = yield prisma.products.findMany({
            //get all products & name must include whatever for search, if it does search we also search for that query
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, name, price, rating, stockQuantity } = req.body;
        const product = yield prisma.products.create({
            data: {
                productId,
                name,
                price,
                rating,
                stockQuantity,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProduct = createProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const product = yield prisma.products.findUnique({
            where: { productId },
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
        }
        yield prisma.products.delete({
            where: { productId },
        });
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { name, price, stockQuantity, rating } = req.body;
        console.log("Data to update:", { name, price, stockQuantity, rating });
        // Check if the product exists
        const existingProduct = yield prisma.products.findUnique({
            where: { productId },
        });
        if (!existingProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        // Update the product
        const updatedProduct = yield prisma.products.update({
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error updating product:", error.message);
            res
                .status(500)
                .json({ message: "Error updating product", error: error.message });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Unexpected error" });
        }
    }
});
exports.updateProduct = updateProduct;
