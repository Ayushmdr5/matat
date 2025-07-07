export interface OrderItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  total: number;
  sku: string;
  price: number;
  image?: {
    id: number;
    src: string;
  };
}

export interface AddressInfo {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone: string;
}

export interface Order {
  _id: string;
  id: number;
  number: string;
  order_key: string;
  status: string;
  date_created: string;
  date_modified: string;
  total: number;
  customer_id: number;
  customer_note: string;
  billing: AddressInfo;
  shipping: AddressInfo;
  line_items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TableOrder {
  _id: string;
  id: number;
  date_created: string;
  status: string;
  total: number;
  billing: Pick<AddressInfo, "first_name" | "last_name">;
  shipping: Pick<AddressInfo, "first_name" | "last_name">;
  line_items: Pick<OrderItem, "id" | "name">[];
}
