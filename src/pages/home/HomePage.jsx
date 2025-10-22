import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@src/shared/ui';
import { $mainApi } from '@src/shared/lib/requester/requester';
import { useCart } from '@src/shared/hooks/useCart';
import { useAuth } from '@src/shared/hooks/useAuth';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const { addToCart, isAddingToCart } = useCart();

  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const res = await $mainApi.get('/products/');
      return res.data.slice(0, 6);
    },
  });

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();
    addToCart({ productId });
  };

  const features = [
    {
      icon: '🚚',
      title: 'Быстрая доставка',
      description: 'Доставляем заказы в течение 24 часов по всему городу',
    },
    {
      icon: '💳',
      title: 'Безопасная оплата',
      description: 'Принимаем все виды платежей с гарантией безопасности',
    },
    {
      icon: '🛡️',
      title: 'Гарантия качества',
      description: 'Все товары проходят тщательную проверку перед отправкой',
    },
    {
      icon: '📞',
      title: 'Поддержка 24/7',
      description: 'Наша служба поддержки работает круглосуточно',
    },
  ];

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Typography variant="h1" weight="bold" className={styles.heroTitle}>
              Добро пожаловать в наш магазин
            </Typography>
            <Typography variant="h3" className={styles.heroSubtitle}>
              Откройте для себя лучшие товары по выгодным ценам
            </Typography>
            <Typography variant="bodyL" className={styles.heroDescription}>
              Мы предлагаем широкий ассортимент качественных товаров с быстрой
              доставкой и отличным сервисом
            </Typography>
            <div className={styles.heroActions}>
              <button
                className={styles.primaryBtn}
                onClick={() => navigate('/products')}
              >
                Смотреть каталог
              </button>
              {!isAuth && (
                <button
                  className={styles.secondaryBtn}
                  onClick={() => navigate('/register')}
                >
                  Зарегистрироваться
                </button>
              )}
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImagePlaceholder}>
              <span className={styles.heroIcon}>🖕</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <Typography
                  variant="h4"
                  weight="bold"
                  className={styles.featureTitle}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="bodyT"
                  className={styles.featureDescription}
                >
                  {feature.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredProducts}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <Typography
              variant="h2"
              weight="bold"
              className={styles.sectionTitle}
            >
              Популярные товары
            </Typography>
            <Typography variant="bodyL" className={styles.sectionSubtitle}>
              Самые востребованные товары нашего каталога
            </Typography>
          </div>

          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <Typography variant="bodyT">Загрузка товаров...</Typography>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products?.map((product) => {
                const isOutOfStock =
                  product.stock_quantity !== undefined &&
                  product.stock_quantity === 0;
                const isLowStock =
                  product.stock_quantity !== undefined &&
                  product.stock_quantity > 0 &&
                  product.stock_quantity <= 5;

                return (
                  <div
                    key={product.id}
                    className={styles.productCard}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className={styles.productImage}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <span>📷</span>
                        </div>
                      )}
                      {product.category && (
                        <div className={styles.categoryBadge}>
                          {product.category}
                        </div>
                      )}
                      {isLowStock && (
                        <div className={styles.stockBadge}>
                          Осталось {product.stock_quantity} шт.
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className={styles.outOfStockBadge}>
                          Нет в наличии
                        </div>
                      )}
                    </div>

                    <div className={styles.productInfo}>
                      <Typography
                        variant="h4"
                        weight="bold"
                        className={styles.productTitle}
                      >
                        {product.name}
                      </Typography>
                      {product.description && (
                        <Typography
                          variant="bodyT"
                          className={styles.productDescription}
                        >
                          {product.description}
                        </Typography>
                      )}
                    </div>

                    <div className={styles.productFooter}>
                      <div className={styles.priceBlock}>
                        <Typography
                          variant="h3"
                          weight="bold"
                          className={styles.price}
                        >
                          {product.price?.toLocaleString('ru-RU') || 0} сом
                        </Typography>
                        {product.stock_quantity !== undefined &&
                          product.stock_quantity > 0 && (
                            <Typography
                              variant="smallT"
                              className={styles.available}
                            >
                              В наличии
                            </Typography>
                          )}
                      </div>

                      <button
                        className={styles.addToCartBtn}
                        onClick={(e) => handleAddToCart(e, product.id)}
                        disabled={!isAuth || isAddingToCart || isOutOfStock}
                      >
                        <span>🛒</span>
                        <Typography variant="buttonT">
                          {!isAuth
                            ? 'Войдите'
                            : isAddingToCart
                            ? 'Добавляем...'
                            : isOutOfStock
                            ? 'Недоступно'
                            : 'В корзину'}
                        </Typography>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className={styles.sectionFooter}>
            <button
              className={styles.viewAllBtn}
              onClick={() => navigate('/products')}
            >
              Посмотреть все товары
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <Typography variant="h2" weight="bold" className={styles.ctaTitle}>
              Готовы начать покупки?
            </Typography>
            <Typography variant="bodyL" className={styles.ctaDescription}>
              Присоединяйтесь к тысячам довольных клиентов и откройте для себя
              мир качественных товаров
            </Typography>
            <div className={styles.ctaActions}>
              <button
                className={styles.ctaPrimaryBtn}
                onClick={() => navigate('/products')}
              >
                Начать покупки
              </button>
              {!isAuth && (
                <button
                  className={styles.ctaSecondaryBtn}
                  onClick={() => navigate('/register')}
                >
                  Создать аккаунт
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
