import { MerchHeader } from './components/MerchHeader';
import { StoreLayout } from './components/StoreLayout';
import { MerchData } from './components/MerchData';
import './MerchStoreHome.css';

export function MerchStore() {

  const featuredItems = MerchData.filter((items) => items.featured === true);

  const featuredGroups = [];

  for (let i = 0; i <featuredItems.length; i += 4) {
    featuredGroups.push(
      featuredItems.slice(i, i + 4)
    );
  }

  return (
    <>
      <title>Xoxxly | Merch Store</title>

      <MerchHeader />

      <div className="home-page-container">

        <p className="hp-title">Featured Products</p>

        <div className="featured-page-grid">

          {featuredGroups.map((group, index) => (
            <div className="featured-page-group" key={index}>
              <StoreLayout items={group} layout="featured" />
            </div>
          ))}
        </div>

        <p className="hp-title">Order Again</p>
      </div>
      
    </>
  );
}