import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography } from '@src/shared/ui';
import { $mainApi } from '@src/shared/lib/requester/requester';
import { useCart } from '@src/shared/hooks/useCart';
import { useAuth } from '@src/shared/hooks/useAuth';
import styles from './OneProductPage.module.scss';

export const OneProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const { addToCart, isAddingToCart } = useCart();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await $mainApi.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product && !isOutOfStock) {
      addToCart({ productId: product.id });
    }
  };

  const isOutOfStock =
    product?.stock_quantity !== undefined && product.stock_quantity === 0;
  const isLowStock =
    product?.stock_quantity !== undefined &&
    product.stock_quantity > 0 &&
    product.stock_quantity <= 5;

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <Typography variant="bodyT">Загрузка товара...</Typography>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <Typography variant="h4" weight="bold">
            Товар не найден
          </Typography>
          <Typography variant="bodyT">
            Запрашиваемый товар не существует или был удален.
          </Typography>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/products')}
          >
            Вернуться к каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.product}>
      <div className={styles.container}>
        <button
          className={styles.backBtn}
          onClick={() => navigate('/products')}
        >
          ← Назад к каталогу
        </button>

        <div className={styles.productContent}>
          <div className={styles.productImage}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span>📷</span>
                <Typography variant="bodyT">Изображение отсутствует</Typography>
              </div>
            )}
          </div>

          <div className={styles.productInfo}>
            <div className={styles.productHeader}>
              {product.category && (
                <div className={styles.categoryBadge}>{product.category}</div>
              )}
              <Typography
                variant="h1"
                weight="bold"
                className={styles.productTitle}
              >
                {product.name}
              </Typography>
            </div>

            {product.description && (
              <div className={styles.productDescription}>
                <Typography
                  variant="h4"
                  weight="bold"
                  className={styles.descriptionTitle}
                >
                  Описание
                </Typography>
                <Typography variant="bodyT" className={styles.descriptionText}>
                  {product.description}
                </Typography>
              </div>
            )}

            <div className={styles.productDetails}>
              <div className={styles.priceBlock}>
                <Typography variant="h2" weight="bold" className={styles.price}>
                  {product.price?.toLocaleString('ru-RU') || 0} сом
                </Typography>
                {product.stock_quantity !== undefined &&
                  product.stock_quantity > 0 && (
                    <Typography variant="bodyT" className={styles.available}>
                      В наличии
                    </Typography>
                  )}
              </div>

              <div className={styles.stockInfo}>
                {isLowStock && (
                  <div className={styles.stockWarning}>
                    <Typography variant="smallT" weight="bold">
                      ⚠️ Осталось {product.stock_quantity} шт.
                    </Typography>
                  </div>
                )}
                {isOutOfStock && (
                  <div className={styles.stockError}>
                    <Typography variant="smallT" weight="bold">
                      ❌ Нет в наличии
                    </Typography>
                  </div>
                )}
              </div>

              <div className={styles.productActions}>
                <button
                  className={styles.addToCartBtn}
                  onClick={handleAddToCart}
                  disabled={!isAuth || isAddingToCart || isOutOfStock}
                >
                  <span className={styles.btnIcon}>🛒</span>
                  <Typography variant="buttonT">
                    {!isAuth
                      ? 'Войдите для покупки'
                      : isAddingToCart
                      ? 'Добавляем...'
                      : isOutOfStock
                      ? 'Недоступно'
                      : 'Добавить в корзину'}
                  </Typography>
                </button>
              </div>
            </div>

            {product.created_at && (
              <div className={styles.productMeta}>
                <Typography variant="smallT" className={styles.metaText}>
                  Добавлено:{' '}
                  {new Date(product.created_at).toLocaleDateString('ru-RU')}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
