import { Outlet, NavLink } from 'react-router-dom';
import { Typography } from '@src/shared/ui';
import { paths } from '@src/shared/constants/constants';
import styles from './AdminLayout.module.scss';

export const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Typography variant="h3" weight="bold" className={styles.logo}>
            Админ панель
          </Typography>
        </div>

        <nav className={styles.sidebarNav}>
          <NavLink
            to={paths.adminPanel}
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem
            }
            end
          >
            <span className={styles.navIcon}>📊</span>
            <Typography variant="bodyT" weight="bold">
              Дашборд
            </Typography>
          </NavLink>

          <NavLink
            to={`${paths.adminPanel}/products`}
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem
            }
          >
            <span className={styles.navIcon}>📦</span>
            <Typography variant="bodyT" weight="bold">
              Товары
            </Typography>
          </NavLink>

          <NavLink
            to={`${paths.adminPanel}/orders`}
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem
            }
          >
            <span className={styles.navIcon}>🛒</span>
            <Typography variant="bodyT" weight="bold">
              Заказы
            </Typography>
          </NavLink>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};
