'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IProduct } from '@/types';
import { useToast } from './ToastContext';

interface IWishlistContext {
  wishlist: IProduct[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: IProduct) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<IWishlistContext | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { success, info } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('srirama_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load wishlist from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('srirama_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist, isLoaded]);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item._id === productId);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (product: IProduct) => {
      let isRemoved = false;
      setWishlist((prev) => {
        const exists = prev.some((item) => item._id === product._id);
        if (exists) {
          isRemoved = true;
          return prev.filter((item) => item._id !== product._id);
        } else {
          return [...prev, product];
        }
      });

      if (isRemoved) {
        info(`Removed ${product.name} from wishlist`);
      } else {
        success(`Added ${product.name} to wishlist`);
      }
    },
    [info, success]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      info('Item removed from wishlist');
    },
    [info]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
