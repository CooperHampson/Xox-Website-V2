import { CategoryPage } from "./CategoryPage";

export function ShirtsPage() {

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };
  
  return (
    <div className="background-container" style={bgImageUrl}>
      <CategoryPage category="shirts" title="Shirts" />
    </div>
  );
}