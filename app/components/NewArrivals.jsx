import React from 'react';
import { router } from 'expo-router';
import ProductSection from './ProductSection';
import handleGetNewArrivalsProducts from '../../services/products/getNewArrivalsProducts';

export default function NewArrivals({ refreshTrigger, onLoadingChange }) {
  return (
    <ProductSection
      title="အသစ်ရောက် ပစ္စည်းများ"
      queryKey={['new-arrivals']}
      fetchDataFn={handleGetNewArrivalsProducts}
      onSeeAllPress={() => router.push('/(tabs)/search')}
      refreshTrigger={refreshTrigger}
      onLoadingChange={onLoadingChange}
    />
  );
}
