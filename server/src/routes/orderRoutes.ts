import express from "express";
import { getAllOrders } from "../controllers/orderController";
import validate from "../middleware/validate";
import { orderQuerySchema } from "../validators/orderQuerySchema";

const router = express.Router();

router.route("/").get(validate(orderQuerySchema), getAllOrders);

export default router;
