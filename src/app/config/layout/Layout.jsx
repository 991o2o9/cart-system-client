import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@src/widgets/Header/Header';
import { Footer } from '@src/widgets/Footer/Footer';
import { Loader } from '@src/shared/ui';

export const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};
