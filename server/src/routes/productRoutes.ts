import express from "express";

import validate from "../middleware/validate";

import { productQuerySchema } from "../validators/productQuerySchema";
import { getAllProducts } from "../controllers/productController";

const router = express.Router();

router.route("/").get(validate(productQuerySchema), getAllProducts);

export default router;
