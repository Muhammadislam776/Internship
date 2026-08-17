/**
 * Performance utilities for HyperList benchmarking
 */

export function filterAndSortItems(items, { searchTerm, selectedCategory, selectedStatus, minRating, maxPrice, favoritesOnly, sortBy, isOptimized, simulatedDelay = false }) {
  const startTime = performance.now();

  // If unoptimized or simulated delay is enabled, perform extra allocations to mimic unoptimized overhead
  if (!isOptimized || simulatedDelay) {
    let dummySum = 0;
    // Simulate heavy un-memoized object iteration & JSON deep clone
    const clone = JSON.parse(JSON.stringify(items.slice(0, 800)));
    for (let i = 0; i < clone.length; i++) {
      dummySum += Math.sqrt(clone[i].id * 99) + clone[i].name.length;
    }
  }

  let result = items;

  // 1. Category Filter
  if (selectedCategory && selectedCategory !== 'All') {
    result = result.filter(item => item.category === selectedCategory);
  }

  // 2. Status Filter
  if (selectedStatus && selectedStatus !== 'All') {
    result = result.filter(item => item.status === selectedStatus);
  }

  // 3. Minimum Rating Filter
  if (minRating > 0) {
    result = result.filter(item => item.rating >= minRating);
  }

  // 4. Max Price Filter
  if (maxPrice > 0) {
    result = result.filter(item => item.price <= maxPrice);
  }

  // 5. Favorites Filter
  if (favoritesOnly) {
    result = result.filter(item => item.isFavorite);
  }

  // 6. Search Filter
  if (searchTerm && searchTerm.trim() !== '') {
    const query = searchTerm.toLowerCase().trim();
    result = result.filter(item => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });
  }

  // 7. Sorting (Non-mutating copy)
  result = [...result];

  switch (sortBy) {
    case 'name_asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name_desc':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'rating_desc':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'rating_asc':
      result.sort((a, b) => a.rating - b.rating);
      break;
    case 'price_desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'price_asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'date_desc':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'date_asc':
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    default:
      break;
  }

  const endTime = performance.now();
  const durationMs = Number((endTime - startTime).toFixed(2));

  return {
    items: result,
    durationMs
  };
}

export function computeCategoryCounts(items) {
  const counts = { All: items.length };
  items.forEach(item => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });
  return counts;
}

export function computeStats(items) {
  if (!items.length) {
    return { avgPrice: 0, avgRating: 0, favoriteCount: 0, totalValue: 0 };
  }
  let sumPrice = 0;
  let sumRating = 0;
  let favoriteCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    sumPrice += item.price;
    sumRating += item.rating;
    if (item.isFavorite) favoriteCount++;
  }

  return {
    avgPrice: Math.round(sumPrice / items.length),
    avgRating: Number((sumRating / items.length).toFixed(1)),
    favoriteCount,
    totalValue: sumPrice
  };
}
