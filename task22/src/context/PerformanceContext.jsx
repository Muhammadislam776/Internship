import React, { createContext, useContext, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { generateItems } from '../data/items';
import { filterAndSortItems, computeCategoryCounts, computeStats } from '../utils/performanceUtils';

const PerformanceContext = createContext(null);

export function PerformanceProvider({ children }) {
  // Settings & dataset preferences
  const [itemCount, setItemCount] = useState(1250);
  const [items, setItems] = useState(() => generateItems(1250));
  const [isOptimized, setIsOptimized] = useState(true);
  const [simulatedCpuLoad, setSimulatedCpuLoad] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Search & Filter parameters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('name_asc');
  const [viewMode, setViewMode] = useState('grid');

  // Render Telemetry
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  const globalRenderCount = renderCountRef.current;

  const [searchOps, setSearchOps] = useState(0);
  const [filterOps, setFilterOps] = useState(0);
  const [renderHistory, setRenderHistory] = useState([]);
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);

  // Re-generate items when itemCount setting changes
  const updateItemCount = useCallback((newCount) => {
    setItemCount(newCount);
    setItems(generateItems(newCount));
  }, []);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    setSearchOps(prev => prev + 1);
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setSelectedCategory(cat);
    setFilterOps(prev => prev + 1);
  }, []);

  const handleStatusChange = useCallback((status) => {
    setSelectedStatus(status);
    setFilterOps(prev => prev + 1);
  }, []);

  const handleSortChange = useCallback((sortVal) => {
    setSortBy(sortVal);
    setFilterOps(prev => prev + 1);
  }, []);

  const handleMinRatingChange = useCallback((rating) => {
    setMinRating(rating);
    setFilterOps(prev => prev + 1);
  }, []);

  const handleMaxPriceChange = useCallback((price) => {
    setMaxPrice(price);
    setFilterOps(prev => prev + 1);
  }, []);

  // -------------------------------------------------------------
  // PERFORMANCE DEMONSTRATION: OPTIMIZED VS UNOPTIMIZED FILTERING
  // -------------------------------------------------------------
  
  // ⚡ Memoized Filter Result (unconditionally declared at top-level)
  const memoizedFilterResult = useMemo(() => {
    return filterAndSortItems(items, {
      searchTerm,
      selectedCategory,
      selectedStatus,
      minRating,
      maxPrice,
      sortBy,
      isOptimized: true,
      simulatedDelay: simulatedCpuLoad
    });
  }, [items, searchTerm, selectedCategory, selectedStatus, minRating, maxPrice, sortBy, simulatedCpuLoad]);

  // 🐢 Unmemoized Filter Result (re-run every render)
  const unmemoizedFilterResult = filterAndSortItems(items, {
    searchTerm,
    selectedCategory,
    selectedStatus,
    minRating,
    maxPrice,
    sortBy,
    isOptimized: false,
    simulatedDelay: simulatedCpuLoad
  });

  const filterResult = isOptimized ? memoizedFilterResult : unmemoizedFilterResult;
  const { items: filteredItems, durationMs: filterDurationMs } = filterResult;

  // Category counts computation (strictly top-level hooks)
  const memoizedCategoryCounts = useMemo(() => computeCategoryCounts(items), [items]);
  const categoryCounts = isOptimized ? memoizedCategoryCounts : computeCategoryCounts(items);

  // Stats computation (strictly top-level hooks)
  const memoizedDatasetStats = useMemo(() => computeStats(items), [items]);
  const datasetStats = isOptimized ? memoizedDatasetStats : computeStats(items);

  // Telemetry recording history
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    setRenderHistory(prev => [
      ...prev.slice(-25),
      {
        id: Date.now() + Math.random(),
        time: timestamp,
        durationMs: filterDurationMs,
        renderCount: globalRenderCount,
        isOptimized,
        visibleCount: filteredItems.length
      }
    ]);
  }, [filterDurationMs, globalRenderCount, isOptimized, filteredItems.length]);

  // -------------------------------------------------------------
  // PERFORMANCE DEMONSTRATION: OPTIMIZED VS UNOPTIMIZED CALLBACKS
  // -------------------------------------------------------------
  
  // Stable memoized callback for Optimized mode
  const handleToggleFavoriteOptimized = useCallback((id) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  }, []);

  // Fresh inline reference creator for Unoptimized mode
  const toggleFavorite = isOptimized
    ? handleToggleFavoriteOptimized
    : (id) => {
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
          )
        );
      };

  const resetDataset = useCallback(() => {
    setItems(generateItems(itemCount));
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setMinRating(0);
    setMaxPrice(1000);
    setSortBy('name_asc');
  }, [itemCount]);

  const value = {
    // Dataset & Navigation
    items,
    itemCount,
    updateItemCount,
    filteredItems,
    categoryCounts,
    datasetStats,
    activeTab,
    setActiveTab,

    // Controls & State
    searchTerm,
    setSearchTerm: handleSearchChange,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    selectedStatus,
    setSelectedStatus: handleStatusChange,
    minRating,
    setMinRating: handleMinRatingChange,
    maxPrice,
    setMaxPrice: handleMaxPriceChange,
    sortBy,
    setSortBy: handleSortChange,
    viewMode,
    setViewMode,

    // Performance Lab Toggles
    isOptimized,
    setIsOptimized,
    simulatedCpuLoad,
    setSimulatedCpuLoad,
    animationsEnabled,
    setAnimationsEnabled,

    // Telemetry Data
    globalRenderCount,
    filterDurationMs,
    searchOps,
    filterOps,
    renderHistory,

    // Actions
    toggleFavorite,
    resetDataset,
    selectedItemForModal,
    setSelectedItemForModal
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
}
