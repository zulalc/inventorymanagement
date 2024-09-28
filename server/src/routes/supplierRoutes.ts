import { Router } from "express";
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "../controllers/supplierController";
import { getProductsBySupplier } from "../controllers/productController";

const router = Router();

router.get("/", getSuppliers);
router.post("/", createSupplier);
router.delete("/:supplierId", deleteSupplier);
router.get("/:supplierId/products", getProductsBySupplier);
router.put("/:supplierId", updateSupplier);

export default router;
