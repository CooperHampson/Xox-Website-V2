import { CategoryPage } from "./CategoryPage";

export function GamingPeripheralsPage() {
  
  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };

  return (
    <div className="background-container" style={bgImageUrl}>
      <CategoryPage category="gaming peripherals" title="Gaming Peripherals" />
    </div>
  );
}