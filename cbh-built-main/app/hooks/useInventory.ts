"use client";

import { useState, useEffect, useCallback } from "react";

interface InventoryData {
  [partNumber: string]: number;
}

// Cache inventory data in memory
const inventoryCache: InventoryData = {};
const cacheTimestamps: { [key: string]: number } = {};
const CACHE_DURATION = 60000; // 1 minute

export function useInventory(partNumbers: string[]) {
  const [inventory, setInventory] = useState<InventoryData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    if (partNumbers.length === 0) {
      setLoading(false);
      return;
    }

    // Check cache first
    const now = Date.now();
    const uncachedParts = partNumbers.filter((pn) => {
      const timestamp = cacheTimestamps[pn];
      return !timestamp || now - timestamp > CACHE_DURATION;
    });

    // Return cached data for parts we already have
    const cachedData: InventoryData = {};
    partNumbers.forEach((pn) => {
      if (inventoryCache[pn] !== undefined && cacheTimestamps[pn] && now - cacheTimestamps[pn] <= CACHE_DURATION) {
        cachedData[pn] = inventoryCache[pn];
      }
    });

    if (uncachedParts.length === 0) {
      setInventory(cachedData);
      setLoading(false);
      return;
    }

    // Mock inventory - return high stock for all part numbers
    const mockInventory: InventoryData = {};
    uncachedParts.forEach((pn) => {
      mockInventory[pn] = 100; // Mock high stock
      inventoryCache[pn] = 100;
      cacheTimestamps[pn] = now;
    });

    // Combine cached and new data
    setInventory({ ...cachedData, ...mockInventory });
    setError(null);
    setLoading(false);
  }, [partNumbers]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const getStock = (partNumber: string): number | null => {
    if (inventory[partNumber] !== undefined) {
      return inventory[partNumber];
    }
    return null;
  };

  const getStockStatus = (
    partNumber: string
  ): "in-stock" | "low-stock" | "out-of-stock" | "unknown" => {
    const qty = getStock(partNumber);
    if (qty === null) return "unknown";
    if (qty === 0) return "out-of-stock";
    if (qty < 24) return "low-stock";
    return "in-stock";
  };

  return {
    inventory,
    loading,
    error,
    getStock,
    getStockStatus,
    refetch: fetchInventory,
  };
}

// Single part number hook
export function useSingleInventory(partNumber: string | null) {
  const [qty, setQty] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partNumber) {
      setLoading(false);
      return;
    }

    // Check cache
    const now = Date.now();
    if (
      inventoryCache[partNumber] !== undefined &&
      cacheTimestamps[partNumber] &&
      now - cacheTimestamps[partNumber] <= CACHE_DURATION
    ) {
      setQty(inventoryCache[partNumber]);
      setLoading(false);
      return;
    }

    // Mock inventory - return high stock
    const mockQty = 100;
    setQty(mockQty);
    inventoryCache[partNumber] = mockQty;
    cacheTimestamps[partNumber] = now;
    setLoading(false);
  }, [partNumber]);

  return { qty, loading };
}

