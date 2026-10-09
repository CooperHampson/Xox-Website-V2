import { useEffect, useState } from "react";
import { MerchHeader } from "./components/MerchHeader";
import { StoreLayout } from "./components/StoreLayout";
import type { MerchItem } from "../../types/merch";
import { getMerch, getOrderAgainMerch } from "../../api/merchApi";
import { useHeaderOcclusion } from "./hooks/useHeaderOcclusion";
import { useAuth } from "../../auth/AuthContext";

import "./MerchStoreHome.css";

export function MerchStore() {
  const { isAuthenticated } = useAuth();
  const [featuredItems, setFeaturedItems] = useState<MerchItem[]>([]);
  const [orderAgainItems, setOrderAgainItems] = useState<MerchItem[]>([]);
  const divRef = useHeaderOcclusion<HTMLDivElement>();

  useEffect(() => {
    async function loadFeaturedMerch() {
      try {
        const items = await getMerch({
          featured: true,
        });

        setFeaturedItems(items);
      } catch (error) {
        console.error("Failed to load featured merch:", error);
      }
    }

    loadFeaturedMerch();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setOrderAgainItems([]);
      return;
    }

    async function loadOrderAgainMerch() {
      try {
        const items = await getOrderAgainMerch();

        setOrderAgainItems(items);
      } catch (error) {
        console.error(
          "Failed to load order again merch:",
          error,
        );
      }
    }

    loadOrderAgainMerch();
  }, [isAuthenticated]);

  const featuredGroups = [];

  for (let i = 0; i < featuredItems.length; i += 4) {
    featuredGroups.push(
      featuredItems.slice(i, i + 4),
    );
  }

  const orderAgainGroups = [];

  for (let i = 0; i < orderAgainItems.length; i += 4) {
    orderAgainGroups.push(
      orderAgainItems.slice(i, i + 4),
    );
  }

  return (
    <>
      <title>Xoxxly | Merch Store</title>

      <div
        className="background-container"
      >
        <MerchHeader />

        <div className="home-page-container" ref={divRef}>
          <p className="hp-title">Featured Products</p>

          <div className="featured-page-grid">
            {featuredGroups.map((group, index) => (
              <div
                className="featured-page-group"
                key={index}
              >
                <StoreLayout
                  items={group}
                  layout="featured"
                />
              </div>
            ))}
          </div>

          <p className="hp-title">New Releases</p>

          <div className="featured-page-grid">
            
          </div>

          <p className="hp-title">Order Again</p>

          <div className="featured-page-grid">
            {orderAgainGroups.map((group, index) => (
              <div className="featured-page-group" key={index}>
                <StoreLayout items={group} layout="featured" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
