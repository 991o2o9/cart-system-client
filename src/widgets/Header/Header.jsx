import { Link, NavLink } from 'react-router-dom';
import { paths } from '@src/shared/constants/constants';
import { Typography } from '@src/shared/ui';
import { useAuth } from '@src/shared/hooks/useAuth';
import { useCart } from '@src/shared/hooks/useCart';
import styles from './Header.module.scss';
import { useEffect } from 'react';

export const Header = () => {
  const { isAuth, user, logout, fetchUserData } = useAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const { cart } = useCart();

  const cartItemsCount = cart?.items_count || 0;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <Link to={paths.homePage} className={styles.logo}>
            <Typography variant="h3" weight="bold">
              Shop
            </Typography>
          </Link>

          <nav className={styles.nav}>
            <NavLink
              to={paths.products}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLink} ${styles.navLinkActive}`
                  : styles.navLink
              }
            >
              Products
            </NavLink>
            {isAuth && (
              <NavLink
                to={paths.orders}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
              >
                Заказы
              </NavLink>
            )}
            {isAuth && (user?.role === 'admin' || user?.role === 'string') && (
              <NavLink
                to={paths.adminPanel}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
              >
                Админ
              </NavLink>
            )}
            {isAuth && (
              <NavLink
                to={paths.cart}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
              >
                <span className={styles.cartLink}>
                  Корзина
                  {cartItemsCount > 0 && (
                    <span className={styles.cartBadge}>{cartItemsCount}</span>
                  )}
                </span>
              </NavLink>
            )}
          </nav>

          <div className={styles.auth}>
            {isAuth ? (
              <>
                <Typography variant="smallT">{user?.username}</Typography>

                <button type="button" onClick={logout} className={styles.btn}>
                  <Typography variant="buttonT">Logout</Typography>
                </button>
              </>
            ) : (
              <>
                <NavLink to={paths.login} className={styles.btn}>
                  <Typography variant="buttonT">Login</Typography>
                </NavLink>
                <NavLink
                  to={paths.register}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  <Typography variant="buttonT">Register</Typography>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
