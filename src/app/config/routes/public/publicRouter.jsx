import { HomePage, OneProductPage, ProductsPage } from '@src/pages';
import { paths } from '@src/shared/constants/constants';

export const publicRouter = [
  {
    path: paths.homePage,
    element: <HomePage />,
  },

  {
    path: paths.products,
    element: <ProductsPage />,
  },
  {
    path: paths.oneProduct,
    element: <OneProductPage />,
  },
];
