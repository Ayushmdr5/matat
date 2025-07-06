import dotenv from "dotenv";
import cron from "node-cron";
import express from "express";

import { connectDB } from "./config/db";
import {
  deleteUnmodifiedOrdersAndOrphanedProducts,
  syncOrdersAndProducts,
} from "./services/wooService";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/orders", orderRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT, async () => {
    console.log(`Server running on port ${process.env.PORT}`);
    // Running daily WooCommerce sync and cleanup at 12 PM...
    cron.schedule("0 12 * * *", async () => {
      try {
        await syncOrdersAndProducts();
        await deleteUnmodifiedOrdersAndOrphanedProducts();
        console.log("Daily WooCommerce sync and cleanup completed.");
      } catch (error) {
        console.error("Error during WooCommerce sync and cleanup:", error);
      }
    });
  });
});
