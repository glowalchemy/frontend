import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCategories } from '../api/catalog';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCategories();
        if (cancelled) return;
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        if (cancelled) return;
        setError('Failed to load categories');
        setCategories([]);
      } finally {
        if (cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  );
};
