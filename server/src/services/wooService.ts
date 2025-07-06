import { IWooOrder, IWooProduct } from "../types/wooCommerce";
import wooApi from "./wooAxiosInstance";
import WooOrder from "../models/Order";
import WooProduct from "../models/Product";
import { AxiosResponse } from "axios";
import { parsePrice } from "../utils/general";

const THIRTY_DAYS_AGO = new Date(
  Date.now() - 30 * 24 * 60 * 60 * 1000
).toISOString();

export async function syncOrdersAndProducts() {
  try {
    // Fetch all orders from last 30 days
    let page = 1;
    const allOrders: IWooOrder[] = [];
    let hasMore = true;

    while (hasMore) {
      const { data: orders }: AxiosResponse<IWooOrder[]> = await wooApi.get(
        "/orders",
        {
          params: {
            after: THIRTY_DAYS_AGO,
            order: "asc",
            orderby: "date",
            per_page: 100,
            page,
          },
        }
      );

      allOrders.push(...orders);
      hasMore = orders.length === 100; // Continue if we got a full page
      page++;
    }
    const fetchedProductIds = new Set<number>();

    for (const order of allOrders) {
      // Upsert order
      await WooOrder.findOneAndUpdate(
        { id: order.id },
        {
          id: order.id,
          number: order.number,
          order_key: order.order_key,
          status: order.status,
          date_created: new Date(order.date_created),
          date_modified: new Date(order.date_modified),
          total: parsePrice(order.total),
          customer_id: order.customer_id,
          customer_note: order.customer_note,
          billing: order.billing,
          shipping: order.shipping,
          line_items: order.line_items.map((item: any) => ({
            id: item.id,
            name: item.name,
            product_id: item.product_id,
            quantity: item.quantity,
            total: parsePrice(item.total),
            sku: item.sku,
            price: item.price,
            image: item.image
              ? { id: item.image.id, src: item.image.src }
              : null,
          })),
        },
        { upsert: true, new: true }
      );

      // For each line item, sync product
      for (const item of order.line_items) {
        const productId = item.product_id;

        if (!productId || fetchedProductIds.has(productId)) continue;
        fetchedProductIds.add(productId);

        const existingProduct = await WooProduct.findOne({ id: productId });
        if (existingProduct) continue;

        try {
          const { data: product }: AxiosResponse<IWooProduct> =
            await wooApi.get(`/products/${productId}`);
          const productToSave = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            permalink: product.permalink,
            sku: product.sku,
            type: product.type,
            status: product.status,
            description: product.description,
            short_description: product.short_description,
            price: parsePrice(product.price),
            regular_price: product.regular_price,
            sale_price: product.sale_price,
            on_sale: product.on_sale,
            total_sales: product.total_sales,
            stock_status: product.stock_status,
            purchasable: product.purchasable,
            images: product.images.map((img: any) => ({
              id: img.id,
              src: img.src,
              name: img.name,
              alt: img.alt,
            })),
            categories: product.categories.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              slug: cat.slug,
            })),
          };

          await WooProduct.create(productToSave);
        } catch (err: any) {
          console.error(
            `Error fetching product ${item.product_id}: ${
              err.response?.data?.message || err.message
            }`
          );
        }
      }
    }

    console.log(
      `Synced ${allOrders.length} orders and ${fetchedProductIds.size} products.`
    );
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

export async function deleteUnmodifiedOrdersAndOrphanedProducts() {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const deletedOrders = await WooOrder.deleteMany({
      date_modified: { $lt: threeMonthsAgo },
    });

    // Get all product IDs still used in remaining orders
    const usedProductIds = await WooOrder.distinct("line_items.product_id");
    // Delete products not referenced in any order
    const deletedProducts = await WooProduct.deleteMany({
      id: { $nin: usedProductIds },
    });
  } catch (error: any) {
    console.error(
      "Failed to clean up old orders and products:",
      error.message || error
    );
  }
}
