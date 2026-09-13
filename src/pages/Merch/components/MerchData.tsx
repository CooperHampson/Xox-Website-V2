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

};

export const MerchData: MerchItem[] = [
  {
    id: "1ab72763-1dfb-4dab-989c-5c7d287af598",
    name: "Test Hoodie",
    price: "1400",
    images: ["test"],
    category: "hoodies",
    featured: false,
    description: "test hoodie desc",
    details: ["100% cotton", "Unisex Fit", "Machine washable", "Made in the USA"],
    colours: ["black", "white", "red", "purple"]
  },
  {
    id: "e6fb71b4-6859-4b9b-933b-9a04881bbd37",
    name: "Test Pants",
    price: "1799",
    images: ["test"],
    category: "pants",
    featured: false,
    description: "test pants desc",
    details: ["100% cotton", "Unisex Fit", "Machine washable", "Made in the USA"]
  },
  {
    id: "963a0683-ee60-47c0-a3da-e383370f24d4",
    name: "Test Shoes",
    price: "899",
    images: ["test"],
    category: "footwear",
    featured: true,
    description: "test shoes desc",
    details: ["Made for Comfort", "Multiple Sizes", "Hand Washable", "Made in the USA"]
  },
  {
    id: "03e519a8-e64d-4c0c-938b-4adba8af7a07",
    name: "Test Socks",
    price: "1799",
    images: ["test"],
    category: "footwear",
    featured: false,
    description: "test socks desc",
    details: ["100% cotton", "Unisex Fit", "Machine washable", "Made in the USA"]
  },
  {
    id: "3f14cb75-cc00-4e9d-ab82-56b2c8dba1e3",
    name: "Test Water Bottle",
    price: "899",
    images: ["test"],
    category: "daily life",
    featured: false,
    description: "test water bottle desc",
    details: ["aluminum material", "Multiple sizes", "Sink Washable", "Made in the USA"]
  },
  {
    id: "2424c4a9-e139-4959-973d-c32c1578aa15",
    name: "Test Mousepad",
    price: "1799",
    images: ["]test"],
    category: "gaming peripherals",
    featured: true,
    description: "test mousepad desc",
    details: ["Smooth Surface", "Multiple Sizes", "Made in the USA"],
    materials: ["polymer"]
  },
  {
    id: "fb9174ab-0adb-4734-96db-9b3189d4c347",
    name: "Test Backpack",
    price: "899",
    images: ["test"],
    category: "daily life",
    featured: true,
    description: "test backpack desc",
    details: ["Extremely Durable", "Light weight", "Hand washable", "Made in the USA"]
  },
  {
    id: "eae74f74-81ec-4404-b614-a10c23bee5ca",
    name: "Test Shirt",
    price: "1532",
    images: ["Images/MerchPage/MerchData/shirtexample.png","Images/MerchPage/MerchData/shirtexample2.png"],
    category: "shirts",
    featured: true,
    description: "test shirt desc",
    details: ["100% cotton", "Unisex Fit", "Machine washable", "Made in the USA"],
    tags: ["streetwear", "casual"],
    colours: ["black", "blue"],
    materials: ["cotton"]
  }
]