import api from '../api';

/**
 * Fetch single product by ID
 */
export async function fetchProductById(id: string) {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
}

/**
 * Fetch all products
 */
export async function fetchProducts() {
  const response = await api.get('/products');
  return response.data.data;
}
