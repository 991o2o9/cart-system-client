export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const paths = {
  homePage: '/',
  register: '/register',
  login: '/login',
  products: '/products',
  cart: '/cart',
  orders: '/orders',
  adminPanel: '/admin',
  oneProduct: '/product/:id',
};

export const tokens = {
  access: 'access_token',
  refresh: 'refresh_token',
};
