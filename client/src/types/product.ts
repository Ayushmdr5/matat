export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
  _id: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  _id: string;
}

export interface Product {
  _id: string;
  id: number;
  name: string;
  slug: string;
  permalink: string;
  sku: string;
  type: string;
  status: string;
  description: string;
  short_description: string;
  price: number;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  total_sales: number;
  stock_status: string;
  purchasable: boolean;
  images: ProductImage[];
  categories: ProductCategory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  orderCount: number;
}
