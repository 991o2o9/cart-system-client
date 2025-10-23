import { Typography } from '@src/shared/ui';
import { useAdmin } from '@src/shared/hooks/useAdmin';
import styles from './AdminDashboard.module.scss';

export const AdminDashboard = () => {
  const { stats, isLoadingStats, isErrorStats } = useAdmin();

  if (isLoadingStats) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <Typography variant="bodyT">Загрузка статистики...</Typography>
          </div>
        </div>
      </div>
    );
  }

  if (isErrorStats) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles.error}>
            <Typography variant="h4" weight="bold" color="error">
              Ошибка загрузки статистики
            </Typography>
            <Typography variant="bodyT">
              Не удалось загрузить данные панели администратора.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat('ru-RU', {
  //     style: 'currency',
  //     currency: 'KGS',
  //   }).format(amount || 0);
  // };

  return (
    <section className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h2" weight="bold" className={styles.title}>
            Панель администратора
          </Typography>
          <Typography variant="bodyT" className={styles.subtitle}>
            Обзор системы и управление
          </Typography>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <Typography
                variant="h3"
                weight="bold"
                className={styles.statValue}
              >
                {stats?.total_users || 0}
              </Typography>
              <Typography variant="bodyT" className={styles.statLabel}>
                Пользователей
              </Typography>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statContent}>
              <Typography
                variant="h3"
                weight="bold"
                className={styles.statValue}
              >
                {stats?.total_products || 0}
              </Typography>
              <Typography variant="bodyT" className={styles.statLabel}>
                Товаров
              </Typography>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>🛒</div>
            <div className={styles.statContent}>
              <Typography
                variant="h3"
                weight="bold"
                className={styles.statValue}
              >
                {stats?.total_orders || 0}
              </Typography>
              <Typography variant="bodyT" className={styles.statLabel}>
                Заказов
              </Typography>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statContent}>
              <Typography
                variant="h3"
                weight="bold"
                className={styles.statValue}
              >
                {stats?.total_revenue}
              </Typography>
              <Typography variant="bodyT" className={styles.statLabel}>
                Выручка
              </Typography>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statContent}>
              <Typography
                variant="h3"
                weight="bold"
                className={styles.statValue}
              >
                {stats?.pending_orders || 0}
              </Typography>
              <Typography variant="bodyT" className={styles.statLabel}>
                Ожидают обработки
              </Typography>
            </div>
          </div>
        </div>

        <div className={styles.quickActions}>
          <Typography
            variant="h3"
            weight="bold"
            className={styles.sectionTitle}
          >
            Быстрые действия
          </Typography>
          <div className={styles.actionsGrid}>
            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>📦</div>
              <Typography
                variant="h4"
                weight="bold"
                className={styles.actionTitle}
              >
                Управление товарами
              </Typography>
              <Typography variant="bodyT" className={styles.actionDescription}>
                Добавление, редактирование и удаление товаров
              </Typography>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>🛒</div>
              <Typography
                variant="h4"
                weight="bold"
                className={styles.actionTitle}
              >
                Управление заказами
              </Typography>
              <Typography variant="bodyT" className={styles.actionDescription}>
                Просмотр и изменение статусов заказов
              </Typography>
            </div>

            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>📊</div>
              <Typography
                variant="h4"
                weight="bold"
                className={styles.actionTitle}
              >
                Аналитика
              </Typography>
              <Typography variant="bodyT" className={styles.actionDescription}>
                Детальная статистика и отчеты
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
