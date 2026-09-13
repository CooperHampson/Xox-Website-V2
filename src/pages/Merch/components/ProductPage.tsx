import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { MerchData } from "./MerchData";
import { useCurrency } from "../currency/CurrencyContext";
import { convertPrice, formatPrice } from "../currency/CurrencyConverter";
import { MerchHeader } from "./MerchHeader";

import './ProductPage.css';

export function ProductPage() {
  const { productId } = useParams();
  const { currentCurrency } = useCurrency();

  const product = MerchData.find((item) => item.id === productId);

  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Product not found</h1>

        <Link to="/store">Back to Store</Link>
      </div>
    );
  }

  const convertedPrice = convertPrice(product.price, currentCurrency.code);

  const formattedPrice = formatPrice(convertedPrice, currentCurrency.code);

  const mainImage = product.images[selectedImage];

  return (
    <>
      <title> Xoxxly | {product.name} </title>

      <MerchHeader />

      <div className="product-page">
        <div className="product-images">

          <div className="product-thumbnail-list">
            {product.images.map((image, index) => (
              <button key={image} className={`product-thumbnail ${selectedImage === index ? "product-thumbnail-selected" : ""}`} onClick={() => setSelectedImage(index)} type="button">
                <img src={`${import.meta.env.BASE_URL}${image}`} alt={`${product.name} thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className="product-main-image-container">
            <img className="product-main-image" src={`${import.meta.env.BASE_URL}${mainImage}`} alt={product.name} />
          </div>
        </div>

        <div className="product-info">
          <p className="product-category">{product.category}</p>

          <h1 className="product-title">{product.name}</h1>

          <p className="product-price">{formattedPrice}</p>

          <p className="product-description">{product.description}</p>

          {product.details && product.details.length > 0 && (
            <div className="product-details">
              <h2>Details</h2>

              <ul>
                {product.details.map((detail, index) => (
                  <li key={index}>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}