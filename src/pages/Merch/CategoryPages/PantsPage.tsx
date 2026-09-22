import { CategoryPage } from "./CategoryPage";

export function PantsPage() {

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };

  return (
    <div className="background-container" style={bgImageUrl}>
      <CategoryPage category="pants" title="Pants" />
    </div>
  );
}