import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { $authApi } from '../lib/requester/requester';
import { tokens } from '../constants/constants';

export const useAdmin = () => {
  const queryClient = useQueryClient();

  // Получение статистики
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await $authApi.get('/admin/stats');
      return response.data;
    },
    enabled: !!localStorage.getItem(tokens.access),
  });

  // Получение всех товаров (включая неактивные)
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const response = await $authApi.get('/admin/products/');
      return response.data;
    },
    enabled: !!localStorage.getItem(tokens.access),
  });

  // Получение всех заказов
  const {
    data: orders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
  } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const response = await $authApi.get('/admin/orders/');
      return response.data;
    },
    enabled: !!localStorage.getItem(tokens.access),
  });

  // Получение конкретного товара
  const getProduct = (productId) => {
    return useQuery({
      queryKey: ['admin', 'product', productId],
      queryFn: async () => {
        const response = await $authApi.get(`/admin/products/${productId}`);
        return response.data;
      },
      enabled: !!localStorage.getItem(tokens.access) && !!productId,
    });
  };

  // Получение конкретного заказа
  const getOrder = (orderId) => {
    return useQuery({
      queryKey: ['admin', 'order', orderId],
      queryFn: async () => {
        const response = await $authApi.get(`/admin/orders/${orderId}`);
        return response.data;
      },
      enabled: !!localStorage.getItem(tokens.access) && !!orderId,
    });
  };

  // Создание товара
  const createProduct = useMutation({
    mutationFn: async (productData) => {
      const response = await $authApi.post('/admin/products/', productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Обновление товара
  const updateProduct = useMutation({
    mutationFn: async ({ productId, productData }) => {
      const response = await $authApi.put(
        `/admin/products/${productId}`,
        productData,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Удаление товара
  const deleteProduct = useMutation({
    mutationFn: async (productId) => {
      const response = await $authApi.delete(`/admin/products/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Обновление статуса заказа
  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await $authApi.put(`/admin/orders/${orderId}`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    // Статистика
    stats,
    isLoadingStats,
    isErrorStats,

    // Товары
    products,
    isLoadingProducts,
    isErrorProducts,
    getProduct,
    createProduct: createProduct.mutate,
    updateProduct: updateProduct.mutate,
    deleteProduct: deleteProduct.mutate,
    isCreatingProduct: createProduct.isPending,
    isUpdatingProduct: updateProduct.isPending,
    isDeletingProduct: deleteProduct.isPending,

    // Заказы
    orders,
    isLoadingOrders,
    isErrorOrders,
    getOrder,
    updateOrderStatus: updateOrderStatus.mutate,
    isUpdatingOrderStatus: updateOrderStatus.isPending,
  };
};
