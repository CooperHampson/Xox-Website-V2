import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { MerchItem, MerchProductVariant, } from "../../../types/merch";
import { getMerch, getMerchVariants, } from "../../../api/merchApi";
import { useCart } from "./cart/CartContext";
import { useCurrency } from "../currency/CurrencyContext";
import { convertPrice, formatPrice } from "../currency/CurrencyConverter";
import { MerchHeader } from "./MerchHeader";
import { useHeaderOcclusion } from "../hooks/useHeaderOcclusion";

import "./ProductPage.css";

export function ProductPage() {
  const { addItem } = useCart();
  const { productId } = useParams();
  const { currentCurrency, exchangeRates } = useCurrency();

  const [product, setProduct] = useState<MerchItem | null>(null);
  const [variants, setVariants] = useState<MerchProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<MerchProductVariant | null>(null);
  const [selectedColour, setSelectedColour] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const divRef = useHeaderOcclusion<HTMLDivElement>();

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        return;
      }

      try {
        const items = await getMerch();

        const foundProduct = items.find(
          (item) => item.id === productId,
        );

        setProduct(foundProduct ?? null);

        if (foundProduct) {
          const productVariants = await getMerchVariants(foundProduct.id);

          setVariants(productVariants);

          if (productVariants.length > 0) {
            const firstVariant = productVariants[0];

            setSelectedVariant(firstVariant);
            setSelectedColour(firstVariant.colour ?? null,);
            setSelectedSize(firstVariant.size ?? null,);
          }
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        setProduct(null);
      }
    }

    loadProduct();
  }, [productId]);

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Product not found</h1>
        <Link to="/store">Back to Store</Link>
      </div>
    );
  }

  const convertedPrice = convertPrice(
    product.price,
    currentCurrency.code,
    exchangeRates
  );

  const formattedPrice = formatPrice(
    convertedPrice,
    currentCurrency.code,
  );

  const mainImage = product.images[selectedImage];

  const availableColours = Array.from(
    new Set(
      variants.map((variant) => variant.colour).filter((colour): colour is string => colour !== null && colour !== undefined,),
    ),
  );

  const availableSizes = Array.from(
    new Set(
      variants.map((variant) => variant.size).filter((size): size is string => size !== null && size !== undefined,),
    ),
  );

  function handleColourChange(colour: string,) {
    setSelectedColour(colour);

    const matchingVariant = variants.find((variant) => variant.colour === colour && variant.size === selectedSize,);

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      return;
    }

    const firstColourVariant = variants.find((variant) => variant.colour === colour,);

    if (firstColourVariant) {
      setSelectedVariant(firstColourVariant,);
      setSelectedSize(firstColourVariant.size ?? null,);
    }
  }

  function handleSizeChange(size: string) {
    setSelectedSize(size);

    const matchingVariant = variants.find((variant) => variant.size === size && variant.colour === selectedColour,);

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      return;
    }

    const firstSizeVariant = variants.find((variant) => variant.size === size,);

    if (firstSizeVariant) {
      setSelectedVariant(firstSizeVariant,);
      setSelectedColour(firstSizeVariant.colour ?? null,);
    }
  }

  async function handleAddToCart() {
    if (!selectedVariant || selectedVariant.isSoldOut) {
      return;
    }

    try {
      setIsAddingToCart(true);

      await addItem(selectedVariant.id, quantity,);

      console.log("Added to cart");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  }

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };

  return (
    <>
      <title>Xoxxly | {product.name}</title>

      <div className="background-container" style={bgImageUrl}>
        <MerchHeader />

        <div className="product-page" ref={divRef}>
          <div className="product-page-outer-container">
            <div className="product-images">
              <div className="product-thumbnail-list">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    className={`product-thumbnail ${selectedImage === index
                      ? "product-thumbnail-selected"
                      : ""
                      }`}
                    onClick={() => setSelectedImage(index)}
                    type="button"
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${image}`}
                      alt={`${product.name} thumbnail ${index + 1}`}
                    />
                  </button>
                ))}
              </div>

              <div className="product-main-image-container">
                <img
                  className="product-main-image"
                  src={`${import.meta.env.BASE_URL}${mainImage}`}
                  alt={product.name}
                />
              </div>
            </div>

            <div className="product-info">
              <p className="product-category">{product.category}</p>

              <h1 className="product-title">{product.name}</h1>

              <p className="product-price">{formattedPrice}</p>

              <p className="product-description">
                {product.description}
              </p>

              {availableColours.length > 0 && (
                <div className="product-variants">
                  <h2>Colour</h2>

                  <div className="product-variant-list">
                    {availableColours.map((colour) => (
                      <button key={colour} type="button" className={`product-variant-button ${selectedColour === colour ? "product-variant-selected" : ""}`} onClick={() => handleColourChange(colour,)}>{colour}</button>
                    ),
                    )}
                  </div>
                </div>
              )}

              {availableSizes.length > 0 && (
                <div className="product-variants">
                  <h2>Size</h2>

                  <div className="product-variant-list">
                    {availableSizes.map((size) => (
                      <button key={size} type="button" className={`product-variant-button ${selectedSize === size ? "product-variant-selected" : ""}`} onClick={() => handleSizeChange(size)}>{size}</button>
                    ),
                    )}
                  </div>
                </div>
              )}

              <div className="product-quantity">
                <h2>Quantity</h2>

                <div className="product-quantity-controls">
                  <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1),)} className="product-quantity-button">
                    −
                  </button>

                  <span>{quantity}</span>

                  <button type="button" onClick={() => setQuantity((current) => current + 1,)} className="product-quantity-button">
                    +
                  </button>
                </div>
              </div>

              <button type="button" className="product-add-to-cart" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.isSoldOut || isAddingToCart}>
                {isAddingToCart ? "Adding..." : selectedVariant?.isSoldOut ? "Sold Out" : "Add to Cart"}
              </button>

              {product.details && product.details.length > 0 && (
                <div className="product-details">
                  <h2>Details</h2>

                  <ul>
                    {product.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
