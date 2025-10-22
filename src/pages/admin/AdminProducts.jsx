import { useState } from 'react';
import { Typography } from '@src/shared/ui';
import { useAdmin } from '@src/shared/hooks/useAdmin';
import styles from './AdminProducts.module.scss';

export const AdminProducts = () => {
  const {
    products,
    isLoadingProducts,
    isErrorProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreatingProduct,
    isUpdatingProduct,
    isDeletingProduct,
  } = useAdmin();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    stock_quantity: '',
    is_active: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity) || 0,
    };

    if (editingProduct) {
      updateProduct({ productId: editingProduct.id, productData });
    } else {
      createProduct(productData);
    }

    // Сброс формы
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category: '',
      stock_quantity: '',
      is_active: true,
    });
    setEditingProduct(null);
    setShowCreateForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url || '',
      category: product.category || '',
      stock_quantity: product.stock_quantity?.toString() || '0',
      is_active: product.is_active,
    });
    setEditingProduct(product);
    setShowCreateForm(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      deleteProduct(productId);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoadingProducts) {
    return (
      <div className={styles.products}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <Typography variant="bodyT">Загрузка товаров...</Typography>
          </div>
        </div>
      </div>
    );
  }

  if (isErrorProducts) {
    return (
      <div className={styles.products}>
        <div className={styles.container}>
          <div className={styles.error}>
            <Typography variant="h4" weight="bold" color="error">
              Ошибка загрузки товаров
            </Typography>
            <Typography variant="bodyT">
              Не удалось загрузить список товаров.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.products}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h2" weight="bold" className={styles.title}>
            Управление товарами
          </Typography>
          <button
            className={styles.addButton}
            onClick={() => {
              setShowCreateForm(true);
              setEditingProduct(null);
              setFormData({
                name: '',
                description: '',
                price: '',
                image_url: '',
                category: '',
                stock_quantity: '',
                is_active: true,
              });
            }}
          >
            <Typography variant="buttonT">+ Добавить товар</Typography>
          </button>
        </div>

        <div className={styles.productsGrid}>
          {products?.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>📷</span>
                  </div>
                )}
                <div className={styles.statusBadge}>
                  {product.is_active ? 'Активен' : 'Неактивен'}
                </div>
              </div>

              <div className={styles.productInfo}>
                <Typography
                  variant="h4"
                  weight="bold"
                  className={styles.productName}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="bodyT"
                  className={styles.productDescription}
                >
                  {product.description || 'Без описания'}
                </Typography>
                <div className={styles.productDetails}>
                  <Typography variant="smallT">
                    <strong>Цена:</strong>{' '}
                    {product.price?.toLocaleString('ru-RU')} сом
                  </Typography>
                  <Typography variant="smallT">
                    <strong>Категория:</strong>{' '}
                    {product.category || 'Не указана'}
                  </Typography>
                  <Typography variant="smallT">
                    <strong>На складе:</strong> {product.stock_quantity || 0}{' '}
                    шт.
                  </Typography>
                  <Typography variant="smallT">
                    <strong>Создан:</strong> {formatDate(product.created_at)}
                  </Typography>
                </div>
              </div>

              <div className={styles.productActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(product)}
                >
                  <Typography variant="buttonT">Редактировать</Typography>
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(product.id)}
                  disabled={isDeletingProduct}
                >
                  <Typography variant="buttonT">
                    {isDeletingProduct ? 'Удаляем...' : 'Удалить'}
                  </Typography>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Форма создания/редактирования */}
        {showCreateForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <Typography variant="h3" weight="bold">
                  {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
                </Typography>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingProduct(null);
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Typography variant="bodyT" weight="bold">
                      Название товара *
                    </Typography>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Typography variant="bodyT" weight="bold">
                      Описание
                    </Typography>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    rows={3}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <Typography variant="bodyT" weight="bold">
                        Цена *
                      </Typography>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <Typography variant="bodyT" weight="bold">
                        Количество на складе
                      </Typography>
                    </label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      min="0"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <Typography variant="bodyT" weight="bold">
                        Категория
                      </Typography>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <Typography variant="bodyT" weight="bold">
                        URL изображения
                      </Typography>
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    <Typography variant="bodyT" weight="bold">
                      Товар активен
                    </Typography>
                  </label>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingProduct(null);
                    }}
                  >
                    <Typography variant="buttonT">Отмена</Typography>
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isCreatingProduct || isUpdatingProduct}
                  >
                    <Typography variant="buttonT">
                      {isCreatingProduct || isUpdatingProduct
                        ? 'Сохранение...'
                        : editingProduct
                        ? 'Сохранить изменения'
                        : 'Создать товар'}
                    </Typography>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
