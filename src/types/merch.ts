export type MerchItem = {
  id: string;
  name: string;
  price: string;
  images: string[];
  category: string;
  featured: boolean;
  description: string;
  details?: string[];
  tags?: string[];
  colours?: string[];
  materials?: string[];
  isOnPromotion?: boolean;
  promotionPrice?: string | null;
  isSoldOut?: boolean;
  isPublished?: boolean;
  _count?: {
    variants: number;
  };
};

export type MerchProductVariant = {
  id: string;
  productId: string;
  sku: string;
  name?: string | null;
  colour?: string | null;
  size?: string | null;
  material?: string | null;
  price: number;
  isSoldOut: boolean;
  isPublished: boolean;
  metadata?: {
    images?: string[];
    [key: string]: unknown;
  } | null;
  createdAt: string;
  updatedAt: string;
};
