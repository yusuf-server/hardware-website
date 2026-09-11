const WOOCOMMERCE_URL = import.meta.env.WOOCOMMERCE_URL || 'https://your-wordpress-site.com';
const CONSUMER_KEY = import.meta.env.WOOCOMMERCE_CONSUMER_KEY || '';
const CONSUMER_SECRET = import.meta.env.WOOCOMMERCE_CONSUMER_SECRET || '';

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  description: string;
  short_description: string;
  sku: string;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: {
    src: string;
    alt: string;
  } | null;
  count: number;
}

async function fetchWC(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${WOOCOMMERCE_URL}/wp-json/wc/v3${endpoint}`);

  url.searchParams.append('consumer_key', CONSUMER_KEY);
  url.searchParams.append('consumer_secret', CONSUMER_SECRET);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`WooCommerce API error: ${response.statusText}`);
  }
  return response.json();
}

export async function getProducts(perPage: number = 20, category?: string): Promise<WCProduct[]> {
  const params: Record<string, string> = {
    per_page: perPage.toString(),
    status: 'publish',
  };

  if (category) {
    params.category = category;
  }

  return fetchWC('/products', params);
}

export async function getProductBySlug(slug: string): Promise<WCProduct> {
  const products = await fetchWC('/products', { slug });
  return products[0];
}

export async function getProductById(id: number): Promise<WCProduct> {
  return fetchWC(`/products/${id}`);
}

export async function getCategories(): Promise<WCCategory[]> {
  return fetchWC('/products/categories', {
    per_page: '100',
    hide_empty: 'true',
  });
}

export async function getCategoryBySlug(slug: string): Promise<WCCategory> {
  const categories = await fetchWC('/products/categories', { slug });
  return categories[0];
}

export async function getFeaturedProducts(perPage: number = 6): Promise<WCProduct[]> {
  return fetchWC('/products', {
    per_page: perPage.toString(),
    featured: 'true',
    status: 'publish',
  });
}

export async function searchProducts(query: string, perPage: number = 20): Promise<WCProduct[]> {
  return fetchWC('/products', {
    search: query,
    per_page: perPage.toString(),
    status: 'publish',
  });
}
