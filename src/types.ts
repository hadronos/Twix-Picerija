export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number | Record<string, number>;
  sizes?: string[];
  category: 'pizze' | 'sendvici' | 'rostilj' | 'palacinke';
  badge?: string;
  image: string;
}

export interface CartItem {
  id: string; // Unique for cart (combining itemId and size)
  menuItemId: string;
  name: string;
  selectedSize?: string;
  price: number;
  quantity: number;
  category: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: 'pizze' | 'burgeri' | 'rostilj' | 'palacinke' | 'enterijer' | 'dostava';
  title: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}
