import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { $authApi } from '../lib/requester/requester';
import { tokens } from '../constants/constants';

export const useCart = () => {
  const queryClient = useQueryClient();

  // Получение корзины
  const {
    data: cart,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await $authApi.get('/cart/');
      return response.data;
    },
    enabled: !!localStorage.getItem(tokens.access), // Запрос только для авторизованных пользователей
  });

  // Добавление товара в корзину
  const addToCart = useMutation({
    mutationFn: async ({ productId, quantity = 1 }) => {
      const response = await $authApi.post('/cart/add', {
        product_id: productId,
        quantity: quantity,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Обновление количества товара в корзине
  const updateCartItem = useMutation({
    mutationFn: async ({ itemId, quantity }) => {
      const response = await $authApi.put(`/cart/item/${itemId}`, {
        quantity: quantity,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Удаление товара из корзины
  const removeFromCart = useMutation({
    mutationFn: async (itemId) => {
      const response = await $authApi.delete(`/cart/item/${itemId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Очистка корзины
  const clearCart = useMutation({
    mutationFn: async () => {
      const response = await $authApi.delete('/cart/clear');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    cart,
    isLoading,
    isError,
    error,
    addToCart: addToCart.mutate,
    updateCartItem: updateCartItem.mutate,
    removeFromCart: removeFromCart.mutate,
    clearCart: clearCart.mutate,
    isAddingToCart: addToCart.isPending,
    isUpdatingCart: updateCartItem.isPending,
    isRemovingFromCart: removeFromCart.isPending,
    isClearingCart: clearCart.isPending,
  };
};
