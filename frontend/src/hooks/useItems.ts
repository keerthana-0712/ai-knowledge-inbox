import { useState, useEffect, useCallback } from 'react';
import { Item } from '../types';
import { api } from '../services/api';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getItems();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load saved items.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const deleteItem = async (id: string) => {
    try {
      await api.deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete item.' };
    }
  };

  return {
    items,
    isLoading,
    error,
    refreshItems: loadItems,
    deleteItem,
  };
}
