# 🛠️ Backend - WooCommerce Sync API

This is the backend of the MERN stack application for syncing products and orders from a WooCommerce store into a local MongoDB database. It provides REST APIs to fetch synced data and trigger sync jobs.

---

## 🚀 Features

- Sync WooCommerce **products** and **orders** via API
- Save data into **MongoDB**
- Expose RESTful endpoints for accessing synced data
- Uses `axios` for WooCommerce API calls and `mongoose` for MongoDB

---

## 📦 Tech Stack

- **Node.js + Express** – Server and routing
- **MongoDB + Mongoose** – For storing synced WooCommerce data
- **dotenv** – Manage environment variables
- **axios** – For WooCommerce API communication
- **cron / node-schedule** – For periodic syncing (if added)

---

## ⚙️ Setup Instructions

1. **Clone the repo** (from root):

   ```bash
   git clone git@github.com:Ayushmdr5/matat.git
   cd server
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Create .env file**:

   ```bash
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/woocommerce-sync
   WOO_BASE_URL=https://interview-test.matat.io
   WOO_CONSUMER_KEY=ck_xxxxxxxx
   WOO_CONSUMER_SECRET=cs_xxxxxxxx
   CRON_SCHEDULE=
   ```

4. **Run the server**:
   ```bash
   pnpm run dev
   ```

---

## 🧪 Postman Collection

To test the API easily, import the Postman collection into your Postman app.

1. Open Postman
2. Click `Import` > `File`
3. Select `postman_collection.json` from this repo

👉 File path: [`server/postman_collection.json`]
