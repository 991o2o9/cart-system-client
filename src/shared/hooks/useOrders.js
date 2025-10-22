import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { $authApi } from '../lib/requester/requester';
import { tokens } from '../constants/constants';

export const useOrders = () => {
  const queryClient = useQueryClient();

  // Получение списка заказов
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await $authApi.get('/orders/');
      return response.data;
    },
    enabled: !!localStorage.getItem(tokens.access), // Запрос только для авторизованных пользователей
  });

  // Получение конкретного заказа
  const getOrder = (orderId) => {
    return useQuery({
      queryKey: ['order', orderId],
      queryFn: async () => {
        const response = await $authApi.get(`/orders/${orderId}`);
        return response.data;
      },
      enabled: !!localStorage.getItem(tokens.access) && !!orderId,
    });
  };

  // Создание заказа
  const createOrder = useMutation({
    mutationFn: async ({ shippingAddress, notes = '' }) => {
      const response = await $authApi.post('/orders/create', {
        shipping_address: shippingAddress,
        notes: notes,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Отмена заказа
  const cancelOrder = useMutation({
    mutationFn: async (orderId) => {
      const response = await $authApi.put(`/orders/${orderId}`, {
        status: 'cancelled',
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    orders,
    isLoading,
    isError,
    error,
    getOrder,
    createOrder: createOrder.mutate,
    cancelOrder: cancelOrder.mutate,
    isCreatingOrder: createOrder.isPending,
    isCancellingOrder: cancelOrder.isPending,
  };
};
