import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  id: Number,
  src: String,
  name: String,
  alt: String,
});

const categorySchema = new mongoose.Schema({
  id: Number,
  name: String,
  slug: String,
});

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true }, // Woo product ID
    name: { type: String, required: true },
    slug: String,
    permalink: String,

    sku: String,
    type: String,
    status: String,
    description: String,
    short_description: String,

    price: Number,
    regular_price: String,
    sale_price: String,
    on_sale: Boolean,
    total_sales: Number,

    stock_status: String,
    purchasable: Boolean,

    images: [imageSchema],
    categories: [categorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
