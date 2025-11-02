export interface CartItem {
  id?: string;
  product_id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

export interface Order {
  id?: string;
  user_email: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  items: CartItem[];
  created_at?: string;
}

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}
