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
};