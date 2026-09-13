export type MerchItem = {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  featured: boolean;

};

export const MerchData: MerchItem[] = [
  {
    id: 1,
    name: "Test Hoodie",
    price: "1400",
    image: "test",
    category: "hoodies",
    featured: false
  },
  {
    id: 2,
    name: "Test Pants",
    price: "1799",
    image: "test",
    category: "pants",
    featured: false
  },
  {
    id: 3,
    name: "Test Shoes",
    price: "899",
    image: "test",
    category: "footwear",
    featured: true
  },
  {
    id: 4,
    name: "Test Socks",
    price: "1799",
    image: "test",
    category: "footwear",
    featured: false
  },
  {
    id: 5,
    name: "Test Water Bottle",
    price: "899",
    image: "test",
    category: "daily life",
    featured: false
  },
  {
    id: 6,
    name: "Test Mousepad",
    price: "1799",
    image: "test",
    category: "gaming peripherals",
    featured: true
  },
  {
    id: 7,
    name: "Test Backpack",
    price: "899",
    image: "test",
    category: "daily life",
    featured: true
  },
  {
    id: 8,
    name: "Test Shirt",
    price: "1532",
    image: "Images/MerchPage/shirtexample.png",
    category: "shirts",
    featured: true
  }
]