import { useParams } from 'react-router-dom';
import ProductsPage from './ProductsPage';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function CategoryPage() {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category || '');

  return <ProductsPage initialCategory={decodedCategory} />;
}
