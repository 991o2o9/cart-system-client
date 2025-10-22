import { LoginPage, RegisterPage } from '@src/pages';
import { paths } from '@src/shared/constants/constants';
import { GuestGuard } from '../../quards/GuestGuard';

export const authRouter = [
  {
    path: paths.login,
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: paths.register,
    element: (
      <GuestGuard>
        <RegisterPage />
      </GuestGuard>
    ),
  },
];
