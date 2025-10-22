import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@src/shared/ui';
import { $mainApi } from '@src/shared/lib/requester/requester';
import { useCart } from '@src/shared/hooks/useCart';
import { useAuth } from '@src/shared/hooks/useAuth';
import styles from './ProductsPage.module.scss';

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const { addToCart, isAddingToCart } = useCart();

  // Состояние для фильтров и поиска
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price_asc, price_desc

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await $mainApi.get('/products/');
      return res.data;
    },
  });

  // Получаем уникальные категории
  const categories = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const uniqueCategories = [
      ...new Set(data.map((p) => p.category).filter(Boolean)),
    ];
    return uniqueCategories.sort();
  }, [data]);

  // Фильтрация и сортировка товаров
  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(data)) return [];

    let filtered = data.filter((p) => p.is_active !== false);

    // Поиск по названию и описанию
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query)),
      );
    }

    // Фильтрация по категории
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'price_asc':
          return (a.price || 0) - (b.price || 0);
        case 'price_desc':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchQuery, selectedCategory, sortBy]);

  const products = filteredAndSortedProducts;

  // Функция для перехода на страницу товара
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <Typography variant="bodyT">Загрузка товаров...</Typography>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <Typography variant="h4" weight="bold">
            Ошибка загрузки
          </Typography>
          <Typography variant="bodyT">
            Не удалось загрузить список товаров. Попробуйте обновить страницу.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.products}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h2" weight="bold" className={styles.title}>
            Каталог товаров
          </Typography>
          <Typography variant="bodyT" className={styles.subtitle}>
            {products.length}{' '}
            {products.length === 1
              ? 'товар'
              : products.length < 5
              ? 'товара'
              : 'товаров'}{' '}
            в наличии
          </Typography>
        </div>

        {/* Фильтры и поиск */}
        <div className={styles.filters}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📦</div>
            <Typography variant="h4" weight="bold">
              Товары не найдены
            </Typography>
            <Typography variant="bodyT">
              В данный момент товары отсутствуют. Загляните позже!
            </Typography>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => {
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
                  className={styles.card}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className={styles.cardImage}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <div className={styles.cardImagePlaceholder}>
                        <span>📷</span>
                      </div>
                    )}
                    {product.category && (
                      <div className={styles.cardBadge}>{product.category}</div>
                    )}
                    {isLowStock && (
                      <div
                        className={`${styles.cardStockBadge} ${styles.cardStockBadgeLow}`}
                      >
                        Осталось {product.stock_quantity} шт.
                      </div>
                    )}
                    {isOutOfStock && (
                      <div
                        className={`${styles.cardStockBadge} ${styles.cardStockBadgeOut}`}
                      >
                        Нет в наличии
                      </div>
                    )}
                  </div>

                  <div className={styles.cardContent}>
                    <Typography
                      variant="h4"
                      weight="bold"
                      className={styles.cardTitle}
                    >
                      {product.name}
                    </Typography>

                    {product.description && (
                      <Typography
                        variant="bodyT"
                        className={styles.cardDescription}
                      >
                        {product.description}
                      </Typography>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.cardPriceBlock}>
                      <Typography
                        variant="h3"
                        weight="bold"
                        className={styles.cardPrice}
                      >
                        {product.price?.toLocaleString('ru-RU') || 0} сом
                      </Typography>
                      {product.stock_quantity !== undefined &&
                        product.stock_quantity > 0 && (
                          <Typography
                            variant="smallT"
                            className={styles.cardAvailable}
                          >
                            В наличии
                          </Typography>
                        )}
                    </div>

                    <button
                      className={styles.cardBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ productId: product.id });
                      }}
                      disabled={!isAuth || isAddingToCart || isOutOfStock}
                    >
                      <span className={styles.cardBtnIcon}>🛒</span>
                      <Typography variant="buttonT">
                        {!isAuth
                          ? 'Войдите для покупки'
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
      </div>
    </section>
  );
};
