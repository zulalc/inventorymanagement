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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const admin = yield prisma.admins.findUnique({
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
        const isPasswordValid = yield bcrypt_1.default.compare(password, admin.password);
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
        const token = jsonwebtoken_1.default.sign({ adminId: admin.adminId }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error("Full error object:", error);
        res
            .status(500)
            .json({ message: "Error logging in", error: error.message || error });
    }
});
exports.adminLogin = adminLogin;
