import express from "express";
import { getAllOrders, getOrderDetail } from "../controllers/orderController";

import validate from "../middleware/validate";
import { orderQuerySchema } from "../validators/orderQuerySchema";
import { idParamsSchema } from "../validators/generalSchema";

const router = express.Router();

router.route("/").get(validate(orderQuerySchema), getAllOrders);
router.route("/:id").get(validate(idParamsSchema), getOrderDetail);

export default router;
