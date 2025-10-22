import { useState } from 'react';
import { Typography } from '@src/shared/ui';
import { useAdmin } from '@src/shared/hooks/useAdmin';
import styles from './AdminOrders.module.scss';

export const AdminOrders = () => {
  const {
    orders,
    isLoadingOrders,
    isErrorOrders,
    updateOrderStatus,
    isUpdatingOrderStatus,
  } = useAdmin();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

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

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus({ orderId, status: newStatus });
  };

  const filteredOrders =
    orders?.filter(
      (order) => statusFilter === 'all' || order.status === statusFilter,
    ) || [];

  if (isLoadingOrders) {
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

  if (isErrorOrders) {
    return (
      <div className={styles.orders}>
        <div className={styles.container}>
          <div className={styles.error}>
            <Typography variant="h4" weight="bold" color="error">
              Ошибка загрузки заказов
            </Typography>
            <Typography variant="bodyT">
              Не удалось загрузить список заказов.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.orders}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h2" weight="bold" className={styles.title}>
            Управление заказами
          </Typography>
          <div className={styles.filters}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Все заказы</option>
              <option value="pending">Ожидают подтверждения</option>
              <option value="confirmed">Подтверждены</option>
              <option value="shipped">Отправлены</option>
              <option value="delivered">Доставлены</option>
              <option value="cancelled">Отменены</option>
            </select>
          </div>
        </div>

        <div className={styles.ordersList}>
          {filteredOrders.map((order) => (
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
                  <Typography variant="bodyT" className={styles.customerInfo}>
                    Клиент: {order.username} (ID: {order.user_id})
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
                      <Typography variant="smallT" className={styles.moreItems}>
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
                  <button
                    className={styles.detailButton}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Typography variant="buttonT">Подробнее</Typography>
                  </button>
                </div>
              </div>

              <div className={styles.orderActions}>
                <div className={styles.statusActions}>
                  <Typography variant="smallT" weight="bold">
                    Изменить статус:
                  </Typography>
                  <div className={styles.statusButtons}>
                    {[
                      'pending',
                      'confirmed',
                      'shipped',
                      'delivered',
                      'cancelled',
                    ].map((status) => (
                      <button
                        key={status}
                        className={`${styles.statusButton} ${
                          order.status === status
                            ? styles.statusButtonActive
                            : ''
                        }`}
                        onClick={() => handleStatusChange(order.id, status)}
                        disabled={isUpdatingOrderStatus}
                      >
                        <Typography variant="smallT">
                          {getStatusText(status)}
                        </Typography>
                      </button>
                    ))}
                  </div>
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
                  {order.notes && (
                    <Typography variant="smallT" className={styles.orderNotes}>
                      <strong>Примечания:</strong> {order.notes}
                    </Typography>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Модальное окно с деталями заказа */}
        {selectedOrder && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <Typography variant="h3" weight="bold">
                  Заказ #{selectedOrder.id}
                </Typography>
                <button
                  className={styles.modalClose}
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.orderDetails}>
                  <div className={styles.detailSection}>
                    <Typography variant="h4" weight="bold">
                      Информация о клиенте
                    </Typography>
                    <Typography variant="bodyT">
                      Имя: {selectedOrder.username}
                    </Typography>
                    <Typography variant="bodyT">
                      ID пользователя: {selectedOrder.user_id}
                    </Typography>
                  </div>

                  <div className={styles.detailSection}>
                    <Typography variant="h4" weight="bold">
                      Статус заказа
                    </Typography>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(
                        selectedOrder.status,
                      )}`}
                    >
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>

                  <div className={styles.detailSection}>
                    <Typography variant="h4" weight="bold">
                      Товары в заказе
                    </Typography>
                    <div className={styles.itemsDetailList}>
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className={styles.itemDetailCard}>
                          <Typography variant="bodyT" weight="bold">
                            {item.product_name}
                          </Typography>
                          <Typography variant="bodyT">
                            Количество: {item.quantity}
                          </Typography>
                          <Typography variant="bodyT">
                            Цена за шт.:{' '}
                            {item.price_at_time?.toLocaleString('ru-RU')} сом
                          </Typography>
                          <Typography variant="bodyT" weight="bold">
                            Сумма: {item.subtotal?.toLocaleString('ru-RU')} сом
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.detailSection}>
                    <Typography variant="h4" weight="bold">
                      Общая сумма
                    </Typography>
                    <Typography variant="h3" weight="bold">
                      {selectedOrder.total_amount?.toLocaleString('ru-RU')} сом
                    </Typography>
                  </div>

                  {selectedOrder.shipping_address && (
                    <div className={styles.detailSection}>
                      <Typography variant="h4" weight="bold">
                        Адрес доставки
                      </Typography>
                      <Typography variant="bodyT">
                        {selectedOrder.shipping_address}
                      </Typography>
                    </div>
                  )}

                  {selectedOrder.notes && (
                    <div className={styles.detailSection}>
                      <Typography variant="h4" weight="bold">
                        Примечания
                      </Typography>
                      <Typography variant="bodyT">
                        {selectedOrder.notes}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
