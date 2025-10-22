import { OrdersPage, OrderDetailPage, CartPage } from '@src/pages';

import { paths } from '@src/shared/constants/constants';
import { AuthGuard } from '../../quards/AuthGuard';

export const privateRouter = [
  {
    path: paths.cart,
    element: (
      <AuthGuard>
        <CartPage />
      </AuthGuard>
    ),
  },
  {
    path: paths.orders,
    element: (
      <AuthGuard>
        <OrdersPage />
      </AuthGuard>
    ),
  },
  {
    path: `${paths.orders}/:orderId`,
    element: (
      <AuthGuard>
        <OrderDetailPage />
      </AuthGuard>
    ),
  },
];
