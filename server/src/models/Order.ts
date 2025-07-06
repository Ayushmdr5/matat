import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    number: String,
    order_key: String,
    status: String,
    date_created: Date,
    date_modified: Date,
    total: Number,
    customer_id: Number,
    customer_note: String,
    billing: {
      first_name: String,
      last_name: String,
      company: String,
      address_1: String,
      address_2: String,
      city: String,
      state: String,
      postcode: String,
      country: String,
      email: String,
      phone: String,
    },
    shipping: {
      first_name: String,
      last_name: String,
      company: String,
      address_1: String,
      address_2: String,
      city: String,
      state: String,
      postcode: String,
      country: String,
      phone: String,
    },
    line_items: [
      {
        id: Number,
        name: String,
        product_id: Number,
        quantity: Number,
        total: Number,
        sku: String,
        price: Number,
        image: {
          id: Number,
          src: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
