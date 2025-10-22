import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@src/shared/hooks/useAuth';
import { paths } from '@src/shared/constants/constants';

export const AdminGuard = ({ children }) => {
  const { isAuth, user, isLoadingUser, fetchUserData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Если пользователь авторизован, но данных о нём ещё нет, загружаем их
    if (isAuth && !user && !isLoadingUser) {
      fetchUserData();
    }
  }, [isAuth, user, isLoadingUser, fetchUserData]);

  useEffect(() => {
    // Если не авторизован — перенаправляем на логин
    if (!isAuth && !isLoadingUser) {
      navigate(paths.login);
      return;
    }

    // Если данные загружены, но роль не админ — редиректим
    if (isAuth && user && user.role !== 'admin') {
      console.log('AdminGuard - Redirecting to home, user is not admin');
      navigate(paths.homePage);
    }
  }, [isAuth, user, isLoadingUser, navigate]);

  // Пока грузим данные — ничего не рендерим
  if (isLoadingUser) {
    return <div>Загрузка...</div>;
  }

  // Если нет авторизации или не админ — ничего не показываем
  if (!isAuth || (user && user.role !== 'admin')) {
    return null;
  }

  return children;
};
