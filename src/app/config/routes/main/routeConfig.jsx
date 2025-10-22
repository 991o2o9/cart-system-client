import { createBrowserRouter } from 'react-router-dom';

import { paths } from '@src/shared/constants/constants';
import { Layout } from '../../layout/Layout';
import { authRouter } from '../auth/authRouter';
import { privateRouter } from '../private/privateRouter';
import { publicRouter } from '../public/publicRouter';
import { adminRouter } from '../admin/adminRouter';

export const router = () =>
  createBrowserRouter([
    {
      path: paths.homePage,
      element: <Layout />,
      children: [...publicRouter, ...privateRouter],
    },
    ...authRouter,
    ...adminRouter,
  ]);
