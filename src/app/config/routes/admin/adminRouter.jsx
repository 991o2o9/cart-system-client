import { AdminDashboard, AdminProducts, AdminOrders } from '@src/pages';

import { paths } from '@src/shared/constants/constants';
import { AdminGuard } from '../../quards/AdminGuard';
import { AdminLayout } from '../../layout/AdminLayout';

export const adminRouter = [
  {
    path: paths.adminPanel,
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'products',
        element: <AdminProducts />,
      },
      {
        path: 'orders',
        element: <AdminOrders />,
      },
    ],
  },
];
