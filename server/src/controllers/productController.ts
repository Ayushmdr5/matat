import { Request, Response } from "express";
import WooProduct from "../models/Product";
import WooOrder from "../models/Order";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../utils/responseHandlers";
import { SortOrder } from "mongoose";
import { ProductQuerySchema } from "../validators/productQuerySchema";

export const getAllProducts = async (
  req: Request<unknown, unknown, unknown, ProductQuerySchema["query"]>,
  res: Response
) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;

    const numericPage = parseInt(page as string);
    const numericLimit = parseInt(limit as string);

    const query: any = {};
    if (search) {
      const regex = new RegExp(search as string, "i");
      query.$or = [{ name: regex }, { sku: regex }];
    }

    const sort: { [key: string]: SortOrder } = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const totalProducts = await WooProduct.countDocuments(query);

    const products = await WooProduct.find(query)
      .sort(sort)
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit)
      .lean();

    // Attach order count and only first image
    const productsWithCounts = await Promise.all(
      products.map(async (product) => {
        const count = await WooOrder.countDocuments({
          "line_items.product_id": product.id,
        });

        return {
          ...product,
          orderCount: count,
        };
      })
    );

    sendSuccessResponse(res, {
      total: totalProducts,
      page: numericPage,
      limit: numericLimit,
      products: productsWithCounts,
    });
  } catch (error: any) {
    sendErrorResponse(res, "Failed to fetch products");
  }
};
