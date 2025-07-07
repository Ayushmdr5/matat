import { Request, Response } from "express";
import WooOrder from "../models/Order";
import { OrderQuerySchema } from "../validators/orderQuerySchema";
import { SortOrder } from "mongoose";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandlers";
import commonTextMap from "../contentMap/commonTextMap";

export async function getAllOrders(
  req: Request<unknown, unknown, unknown, OrderQuerySchema["query"]>,
  res: Response
) {
  try {
    const {
      page = "1",
      limit = "10",
      sortBy = "date_created",
      sortOrder = "desc",
      search = "",
      status,
      productId,
    } = req.query;

    const numericPage = parseInt(page);
    const numericLimit = parseInt(limit);

    const query: any = {};

    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      query.$or = [
        { id: +search || undefined },
        { number: regex },
        { "billing.first_name": regex },
        { "billing.last_name": regex },
        { "shipping.first_name": regex },
        { "shipping.last_name": regex },
        { "line_items.name": regex },
      ];
    }

    if (status) {
      query.status = status;
    }

    const sort: { [key: string]: SortOrder } = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    if (productId) {
      query["line_items.product_id"] = +productId;
    }

    const totalOrders = await WooOrder.countDocuments(query);

    const orders = await WooOrder.find(query)
      .sort(sort)
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit)
      .select({
        id: 1,
        "billing.first_name": 1,
        "billing.last_name": 1,
        "shipping.first_name": 1,
        "shipping.last_name": 1,
        "line_items.name": 1,
        "line_items.id": 1,
        status: 1,
        total: 1,
        date_created: 1,
      });

    sendSuccessResponse(
      res,
      orders,
      commonTextMap.x_fetched_successfully("Orders"),
      200,
      {
        total: totalOrders,
        limit: numericLimit,
        page: numericPage,
      }
    );
  } catch (error) {
    sendErrorResponse(res, commonTextMap.x_fetch_failed("orders"));
  }
}

export const getOrderDetail = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id);

    const order = await WooOrder.findOne({ id: orderId });

    if (!order) {
      sendErrorResponse(res, commonTextMap.x_not_found("Order"), null, 404);
    }

    sendSuccessResponse(res, order);
  } catch (error) {
    sendErrorResponse(res, commonTextMap.x_fetch_failed("order detail"));
  }
};
