import { useParams, Link } from 'react-router-dom';
import { Typography } from '@src/shared/ui';
import { useOrders } from '@src/shared/hooks/useOrders';
import { paths } from '@src/shared/constants/constants';
import styles from './OrderDetailPage.module.scss';

export const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { getOrder, cancelOrder, isCancellingOrder } = useOrders();
  const { data: order, isLoading, isError } = getOrder(orderId);

  if (isLoading) {
    return (
      <div className={styles.orderDetail}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <Typography variant="bodyT">Загрузка заказа...</Typography>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className={styles.orderDetail}>
        <div className={styles.container}>
          <div className={styles.error}>
            <Typography variant="h4" weight="bold" color="error">
              Ошибка загрузки заказа
            </Typography>
            <Typography variant="bodyT">
              Не удалось загрузить информацию о заказе. Попробуйте обновить
              страницу.
            </Typography>
            <Link to={paths.orders} className={styles.backLink}>
              <Typography variant="buttonT">Вернуться к заказам</Typography>
            </Link>
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

  const canCancelOrder =
    order.status === 'pending' || order.status === 'confirmed';

  const handleCancelOrder = () => {
    if (window.confirm('Вы уверены, что хотите отменить этот заказ?')) {
      cancelOrder(order.id);
    }
  };

  return (
    <section className={styles.orderDetail}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to={paths.orders} className={styles.backButton}>
            ← Назад к заказам
          </Link>
          <Typography variant="h2" weight="bold" className={styles.title}>
            Заказ #{order.id}
          </Typography>
        </div>

        <div className={styles.orderInfo}>
          <div className={styles.orderStatus}>
            <Typography variant="h4" weight="bold">
              Статус заказа:
            </Typography>
            <span
              className={`${styles.statusBadge} ${getStatusClass(
                order.status,
              )}`}
            >
              {getStatusText(order.status)}
            </span>
          </div>

          <div className={styles.orderDates}>
            <div className={styles.dateItem}>
              <Typography variant="bodyT" weight="bold">
                Дата создания:
              </Typography>
              <Typography variant="bodyT">
                {formatDate(order.created_at)}
              </Typography>
            </div>
            {order.updated_at !== order.created_at && (
              <div className={styles.dateItem}>
                <Typography variant="bodyT" weight="bold">
                  Последнее обновление:
                </Typography>
                <Typography variant="bodyT">
                  {formatDate(order.updated_at)}
                </Typography>
              </div>
            )}
          </div>

          {order.shipping_address && (
            <div className={styles.shippingInfo}>
              <Typography variant="bodyT" weight="bold">
                Адрес доставки:
              </Typography>
              <Typography variant="bodyT">{order.shipping_address}</Typography>
            </div>
          )}

          {order.notes && (
            <div className={styles.notesInfo}>
              <Typography variant="bodyT" weight="bold">
                Примечания:
              </Typography>
              <Typography variant="bodyT">{order.notes}</Typography>
            </div>
          )}
        </div>

        <div className={styles.orderItems}>
          <Typography variant="h3" weight="bold" className={styles.itemsTitle}>
            Товары в заказе
          </Typography>
          <div className={styles.itemsList}>
            {order.items.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.itemInfo}>
                  <Typography
                    variant="h4"
                    weight="bold"
                    className={styles.itemName}
                  >
                    {item.product_name}
                  </Typography>
                  <Typography variant="bodyT" className={styles.itemPrice}>
                    {item.price_at_time?.toLocaleString('ru-RU')} сом за шт.
                  </Typography>
                </div>
                <div className={styles.itemQuantity}>
                  <Typography variant="bodyT" weight="bold">
                    Количество: {item.quantity}
                  </Typography>
                </div>
                <div className={styles.itemSubtotal}>
                  <Typography variant="h4" weight="bold">
                    {item.subtotal?.toLocaleString('ru-RU')} сом
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.orderSummary}>
          <div className={styles.totalAmount}>
            <Typography variant="h2" weight="bold">
              Итого: {order.total_amount?.toLocaleString('ru-RU')} сом
            </Typography>
          </div>

          {canCancelOrder && (
            <button
              className={styles.cancelButton}
              onClick={handleCancelOrder}
              disabled={isCancellingOrder}
            >
              <Typography variant="buttonT">
                {isCancellingOrder ? 'Отменяем...' : 'Отменить заказ'}
              </Typography>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
