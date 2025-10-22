import { useState } from 'react';
import { Typography } from '@src/shared/ui';
import { useCart } from '@src/shared/hooks/useCart';
import { useOrders } from '@src/shared/hooks/useOrders';
import styles from './CartPage.module.scss';

export const CartPage = () => {
  const {
    cart,
    isLoading,
    isError,
    updateCartItem,
    removeFromCart,
    clearCart,
    isUpdatingCart,
    isRemovingFromCart,
    isClearingCart,
  } = useCart();

  const { createOrder, isCreatingOrder } = useOrders();

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  if (isLoading) {
    return (
      <div className={styles.cart}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <Typography variant="bodyT">Загрузка корзины...</Typography>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.cart}>
        <div className={styles.container}>
          <div className={styles.error}>
            <div className={styles.errorIcon}>⚠️</div>
            <Typography variant="h4" weight="bold">
              Ошибка загрузки корзины
            </Typography>
            <Typography variant="bodyT">
              Не удалось загрузить содержимое корзины. Попробуйте обновить
              страницу.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const totalAmount = cart?.total_amount || 0;
  const itemsCount = cart?.items_count || 0;

  const handleCreateOrder = () => {
    if (!shippingAddress.trim()) {
      alert('Пожалуйста, укажите адрес доставки');
      return;
    }

    createOrder({
      shippingAddress: shippingAddress.trim(),
      notes: notes.trim(),
    });

    setShippingAddress('');
    setNotes('');
    setShowOrderForm(false);
  };

  return (
    <section className={styles.cart}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h2" weight="bold" className={styles.title}>
            Корзина покупок
          </Typography>
          {items.length > 0 && (
            <div className={styles.badge}>
              {itemsCount}{' '}
              {itemsCount === 1
                ? 'товар'
                : itemsCount < 5
                ? 'товара'
                : 'товаров'}
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <Typography variant="h3" weight="bold">
              Корзина пуста
            </Typography>
            <Typography variant="bodyT" className={styles.emptyText}>
              Добавьте товары в корзину, чтобы продолжить покупки
            </Typography>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemMain}>
                    <div className={styles.itemInfo}>
                      <Typography
                        variant="h4"
                        weight="bold"
                        className={styles.itemName}
                      >
                        {item.product_name}
                      </Typography>
                      <Typography variant="bodyT" className={styles.itemPrice}>
                        {item.product_price?.toLocaleString('ru-RU')} сом за
                        единицу
                      </Typography>
                    </div>

                    <div className={styles.itemControls}>
                      <div className={styles.quantity}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() =>
                            updateCartItem({
                              itemId: item.id,
                              quantity: item.quantity - 1,
                            })
                          }
                          disabled={item.quantity <= 1 || isUpdatingCart}
                          aria-label="Уменьшить количество"
                        >
                          −
                        </button>
                        <div className={styles.quantityValue}>
                          <Typography variant="bodyT" weight="bold">
                            {item.quantity}
                          </Typography>
                        </div>
                        <button
                          className={styles.quantityBtn}
                          onClick={() =>
                            updateCartItem({
                              itemId: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                          disabled={isUpdatingCart}
                          aria-label="Увеличить количество"
                        >
                          +
                        </button>
                      </div>

                      <div className={styles.itemSubtotal}>
                        <Typography variant="h4" weight="bold">
                          {item.subtotal?.toLocaleString('ru-RU')} сом
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                    disabled={isRemovingFromCart}
                    aria-label="Удалить товар"
                  >
                    <span className={styles.removeIcon}>×</span>
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryCard}>
                <Typography
                  variant="h3"
                  weight="bold"
                  className={styles.summaryTitle}
                >
                  Итоговая сумма
                </Typography>

                <div className={styles.summaryDetails}>
                  <div className={styles.summaryRow}>
                    <Typography variant="bodyT">
                      Товары ({itemsCount})
                    </Typography>
                    <Typography variant="bodyT" weight="bold">
                      {totalAmount?.toLocaleString('ru-RU')} сом
                    </Typography>
                  </div>
                  <div className={styles.summaryDivider}></div>
                  <div className={styles.summaryTotal}>
                    <Typography variant="h3" weight="bold">
                      Итого:
                    </Typography>
                    <Typography
                      variant="h3"
                      weight="bold"
                      className={styles.totalAmount}
                    >
                      {totalAmount?.toLocaleString('ru-RU')} сом
                    </Typography>
                  </div>
                </div>

                <button
                  className={styles.checkoutBtn}
                  onClick={() => setShowOrderForm(true)}
                  disabled={items.length === 0}
                >
                  <Typography variant="buttonT">Оформить заказ</Typography>
                </button>

                <button
                  className={styles.clearBtn}
                  onClick={() => clearCart()}
                  disabled={isClearingCart}
                >
                  <Typography variant="buttonT">
                    {isClearingCart ? 'Очищаем...' : 'Очистить корзину'}
                  </Typography>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showOrderForm && (
        <div className={styles.modal} onClick={() => setShowOrderForm(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <Typography variant="h3" weight="bold">
                Оформление заказа
              </Typography>
              <button
                className={styles.modalClose}
                onClick={() => setShowOrderForm(false)}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Typography variant="bodyT" weight="bold">
                    Адрес доставки <span className={styles.required}>*</span>
                  </Typography>
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className={styles.formTextarea}
                  placeholder="Укажите полный адрес доставки"
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Typography variant="bodyT" weight="bold">
                    Примечания к заказу
                  </Typography>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={styles.formTextarea}
                  placeholder="Дополнительная информация (необязательно)"
                  rows={2}
                />
              </div>

              <div className={styles.orderSummary}>
                <div className={styles.orderSummaryRow}>
                  <Typography variant="bodyT">Товаров:</Typography>
                  <Typography variant="bodyT">{itemsCount}</Typography>
                </div>
                <div className={styles.orderSummaryDivider}></div>
                <div className={styles.orderSummaryTotal}>
                  <Typography variant="h4" weight="bold">
                    Итого к оплате:
                  </Typography>
                  <Typography
                    variant="h4"
                    weight="bold"
                    className={styles.orderTotal}
                  >
                    {totalAmount?.toLocaleString('ru-RU')} сом
                  </Typography>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.modalCancel}
                onClick={() => setShowOrderForm(false)}
              >
                <Typography variant="buttonT">Отмена</Typography>
              </button>
              <button
                className={styles.modalConfirm}
                onClick={handleCreateOrder}
                disabled={isCreatingOrder || !shippingAddress.trim()}
              >
                <Typography variant="buttonT">
                  {isCreatingOrder ? 'Создаем заказ...' : 'Подтвердить заказ'}
                </Typography>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
