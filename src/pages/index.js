import { lazy } from 'react';

export const HomePage = lazy(() =>
  import('./home/HomePage').then((module) => ({
    default: module.HomePage,
  })),
);

export const ProductsPage = lazy(() =>
  import('./products/ProductsPage').then((module) => ({
    default: module.ProductsPage,
  })),
);

export const CartPage = lazy(() =>
  import('./cart/CartPage').then((module) => ({
    default: module.CartPage,
  })),
);

export const LoginPage = lazy(() =>
  import('./login/LoginPage').then((module) => ({
    default: module.LoginPage,
  })),
);

export const RegisterPage = lazy(() =>
  import('./register/RegisterPage').then((module) => ({
    default: module.RegisterPage,
  })),
);

export const OrdersPage = lazy(() =>
  import('./orders/OrdersPage').then((module) => ({
    default: module.OrdersPage,
  })),
);

export const OrderDetailPage = lazy(() =>
  import('./orders/OrderDetailPage').then((module) => ({
    default: module.OrderDetailPage,
  })),
);

export const AdminDashboard = lazy(() =>
  import('./admin/AdminDashboard').then((module) => ({
    default: module.AdminDashboard,
  })),
);

export const AdminProducts = lazy(() =>
  import('./admin/AdminProducts').then((module) => ({
    default: module.AdminProducts,
  })),
);

export const AdminOrders = lazy(() =>
  import('./admin/AdminOrders').then((module) => ({
    default: module.AdminOrders,
  })),
);

export const OneProductPage = lazy(() =>
  import('./oneProduct/OneProductPage').then((module) => ({
    default: module.OneProductPage,
  })),
);
