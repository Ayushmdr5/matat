import { Request, Response } from "express";
import WooOrder from "../models/Order";
import { OrderQuerySchema } from "../validators/orderQuerySchema";
import { SortOrder } from "mongoose";

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

    const totalOrders = await WooOrder.countDocuments(query);

    const orders = await WooOrder.find(query)
      .sort(sort)
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit);

    res.json({
      total: totalOrders,
      page: numericPage,
      limit: numericLimit,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
}
