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
exports.updateSupplier = exports.deleteSupplier = exports.createSupplier = exports.getSuppliers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const suppliers = yield prisma.suppliers.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });
        res.json(suppliers);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving suppliers+" });
    }
});
exports.getSuppliers = getSuppliers;
const createSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId, name, contactInfo, status } = req.body;
        const supplier = yield prisma.suppliers.create({
            data: {
                supplierId,
                name,
                contactInfo,
                status,
            },
        });
        res.status(201).json(supplier);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating supplier" });
    }
});
exports.createSupplier = createSupplier;
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId } = req.params;
        const supplier = yield prisma.suppliers.findUnique({
            where: { supplierId },
        });
        if (!supplier) {
            res.status(404).json({ message: "Supplier not found" });
        }
        const associatedProducts = yield prisma.products.findMany({
            where: { supplierId },
        });
        if (associatedProducts.length > 0) {
            yield prisma.products.updateMany({
                where: { supplierId },
                data: {
                    status: "inactive",
                },
            });
        }
        yield prisma.suppliers.update({
            where: { supplierId },
            data: {
                status: "inactive",
            },
        });
        res.status(200).json({
            message: "Supplier and associated products made inactive successfully",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error  supplier", error.message);
            res
                .status(500)
                .json({ message: `Error inactivating supplier: ${error.message}` });
        }
        else {
            console.error("Unexpected error inactivating supplier:", error);
            res
                .status(500)
                .json({ message: "Unexpected error inactivating supplier" });
        }
    }
});
exports.deleteSupplier = deleteSupplier;
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId } = req.params;
        const { name, contactInfo, status } = req.body;
        console.log("Data to update:", {
            name,
            contactInfo,
            status,
        });
        const existingSupplier = yield prisma.suppliers.findUnique({
            where: { supplierId },
        });
        if (!existingSupplier) {
            res.status(404).json({ message: "Supplier not found" });
            return;
        }
        const updatedSupplier = yield prisma.suppliers.update({
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error updating supplier:", error.message);
            res
                .status(500)
                .json({ message: "Error updating supplier", error: error.message });
        }
        else {
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Unexpected error" });
        }
    }
});
exports.updateSupplier = updateSupplier;
