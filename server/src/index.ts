import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import express from "express";

import { connectDB } from "./config/db";
import {
  deleteUnmodifiedOrdersAndOrphanedProducts,
  syncOrdersAndProducts,
} from "./services/wooService";
import orderRoutes from "./routes/orderRoutes";
import productRoutes from "./routes/productRoutes";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use(notFound);
app.use(errorHandler);

const cronTime = process.env.CRON_SCHEDULE || "0 12 * * *";

connectDB().then(() => {
  app.listen(process.env.PORT, async () => {
    console.log(`Server running on port ${process.env.PORT}`);
    // Running daily WooCommerce sync and cleanup at 12 PM...
    cron.schedule(cronTime, async () => {
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
