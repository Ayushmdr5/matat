# 🛍️ WooCommerce Sync Dashboard (Frontend)

This is the frontend of a MERN-based dashboard application that displays **products and orders** fetched from a WooCommerce store and synced to a local MongoDB database.

Built with **React**, **React Router**, **React Query**, and **Tailwind CSS**, this app allows users to:

- Search, sort, and paginate **orders** and **products**
- Filter **orders** by product
- View detailed order information in a modal

---

## 🚀 Features

- 🔍 Product list with search, sorting, and pagination
- 📦 Order list with filtering, sorting, pagination, and detailed view
- 🧭 Navigation between products and orders
- ⚡️ Debounced search
- 📄 URL-based filters (e.g., filter orders by product ID)
- 💅 Styled with Tailwind CSS

---

## 🔧 Setup Instructions

1. **Clone the repo** (from root):

   ```bash
   git clone git@github.com:Ayushmdr5/matat.git
   cd client
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Create .env file**:

   ```bash
   VITE_API_BASE_URL=http://localhost:5001

   ```

4. **Run the server**:
   ```bash
   pnpm run dev
   ```
