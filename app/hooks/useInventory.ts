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

    try {
      setLoading(true);
      const response = await fetch(
        `/api/inventory?partNumbers=${uncachedParts.join(",")}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }

      const data = await response.json();
      const newInventory = data.inventory || {};

      // Update cache
      Object.entries(newInventory).forEach(([pn, qty]) => {
        inventoryCache[pn] = qty as number;
        cacheTimestamps[pn] = now;
      });

      // Combine cached and new data
      setInventory({ ...cachedData, ...newInventory });
      setError(null);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory");
      // Still show cached data even on error
      setInventory(cachedData);
    } finally {
      setLoading(false);
    }
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

    fetch(`/api/inventory?partNumber=${partNumber}`)
      .then((res) => res.json())
      .then((data) => {
        const quantity = data.qty ?? null;
        setQty(quantity);
        if (quantity !== null) {
          inventoryCache[partNumber] = quantity;
          cacheTimestamps[partNumber] = now;
        }
      })
      .catch(() => setQty(null))
      .finally(() => setLoading(false));
  }, [partNumber]);

  return { qty, loading };
}

