import { Link } from 'react-router-dom';
import { Typography } from '@src/shared/ui';
import { useOrders } from '@src/shared/hooks/useOrders';
import { paths } from '@src/shared/constants/constants';
import styles from './OrdersPage.module.scss';

export const OrdersPage = () => {
  const { orders, isLoading, isError } = useOrders();

  if (isLoading) {
    return (
      <div className={styles.orders}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <Typography variant="bodyT">Загрузка заказов...</Typography>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.orders}>
        <div className={styles.container}>
          <div className={styles.error}>
            <Typography variant="h4" weight="bold" color="error">
              Ошибка загрузки заказов
            </Typography>
            <Typography variant="bodyT">
              Не удалось загрузить список заказов. Попробуйте обновить страницу.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтвержден',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const statusClassMap = {
      pending: styles.statusPending,
      confirmed: styles.statusConfirmed,
      shipped: styles.statusShipped,
      delivered: styles.statusDelivered,
      cancelled: styles.statusCancelled,
    };
    return statusClassMap[status] || styles.statusDefault;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className={styles.orders}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h2" weight="bold" className={styles.title}>
            Мои заказы
          </Typography>
          <Typography variant="bodyT" className={styles.subtitle}>
            История ваших покупок
          </Typography>
        </div>

        {!orders || orders.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📦</div>
            <Typography variant="h4" weight="bold">
              Заказы не найдены
            </Typography>
            <Typography variant="bodyT">
              У вас пока нет заказов. Оформите первый заказ в{' '}
              <Link to={paths.products} className={styles.link}>
                каталоге товаров
              </Link>
              !
            </Typography>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <Typography
                      variant="h4"
                      weight="bold"
                      className={styles.orderNumber}
                    >
                      Заказ #{order.id}
                    </Typography>
                    <Typography variant="bodyT" className={styles.orderDate}>
                      {formatDate(order.created_at)}
                    </Typography>
                  </div>
                  <div className={styles.orderStatus}>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(
                        order.status,
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className={styles.orderContent}>
                  <div className={styles.orderItems}>
                    <Typography
                      variant="bodyT"
                      weight="bold"
                      className={styles.itemsTitle}
                    >
                      Товары ({order.items.length}):
                    </Typography>
                    <div className={styles.itemsList}>
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className={styles.itemPreview}>
                          <Typography variant="smallT">
                            {item.product_name} × {item.quantity}
                          </Typography>
                          <Typography
                            variant="smallT"
                            className={styles.itemPrice}
                          >
                            {item.price_at_time?.toLocaleString('ru-RU')} сом
                          </Typography>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <Typography
                          variant="smallT"
                          className={styles.moreItems}
                        >
                          и еще {order.items.length - 3} товаров...
                        </Typography>
                      )}
                    </div>
                  </div>

                  <div className={styles.orderSummary}>
                    <Typography
                      variant="h3"
                      weight="bold"
                      className={styles.totalAmount}
                    >
                      {order.total_amount?.toLocaleString('ru-RU')} сом
                    </Typography>
                    <Link
                      to={`${paths.orders}/${order.id}`}
                      className={styles.detailLink}
                    >
                      <Typography variant="buttonT">Подробнее</Typography>
                    </Link>
                  </div>
                </div>

                {order.shipping_address && (
                  <div className={styles.orderFooter}>
                    <Typography
                      variant="smallT"
                      className={styles.shippingAddress}
                    >
                      <strong>Адрес доставки:</strong> {order.shipping_address}
                    </Typography>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
