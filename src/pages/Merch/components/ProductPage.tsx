import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { MerchItem, MerchProductVariant, } from "../../../types/merch";
import { getMerch, getMerchVariants, } from "../../../api/merchApi";
import { useCart } from "./cart/CartContext";
import { useCurrency } from "../currency/CurrencyContext";
import { convertPrice, formatPrice } from "../currency/CurrencyConverter";
import { MerchHeader } from "./MerchHeader";
import { useHeaderOcclusion } from "../hooks/useHeaderOcclusion";
import type { CSSProperties } from "react";

import "./ProductPage.css";


const COLOUR_HEX_MAP: Record<string, string> = {
  black: "#212121",
  'black charcoal': "#000000",
  'charcoal black': "#616161",
  'true navy': "#1e2b44",
  white: "#FFFFFF",
  butter: "#fff7e3",
  navy: "#424154",
  blue: "#2563EB",
  'mystic blue': "#5068ab",
  'carolina blue': "#a1c2d9",
  cobalt: "#30478a",
  'royal blue': "#304ea5",
  royal: "#222985",
  'light blue': "#7eb1e0",
  midnight: "#3a4e63",
  'collegiate navy': "#020b26",
  'collegiate royal': "#114aa0",
  'pebble blue': "#2595d2",
  'mint green': "#47b7be",
  hemp: "#4f5232",
  loden: "#8e845e",
  red: "#bb1035",
  scarlet: "#f31424",
  crimson: "#bb5151",
  watermelon: "#d15c68",
  green: "#15803D",
  spruce: "#263d2d",
  olive: "#41401d",
  'alpine green': "#3c442f",
  'pine green': "#113433",
  cypress: "#6b6d4f",
  moss: "#6b7053",
  grey: "#92928f",
  gray: "#92928f",
  'dark grey': "#2d2a2a",
  graphite: "#8b8e8f",
  'grey three': "#b1b0ae",
  'athletic heather': "#939393",
  'black heather': "#2f2e32",
  'heather grey': "#b9b9b9",
  'heather grey/white': "#a3a3a3",
  'heather grey/black': "#afafb3",
  'charcoal heather': "#1c1f26",
  'white heather': "#f0f0f0",
  pink: "#F4A7BB",
  'baby pink': "#ffc6cd",
  berry: "#8e5a7b",
  purple: "#7E22CE",
  yellow: "#FACC15",
  sand: "#d5b17c",
  gold: "#ffa10e",
  orange: "#EA580C",
  yam: "#db642f",
  clay: "#a14821",
  brown: "#1f0a03",
  chestnut: "#814733",
  beige: "#D8C3A5",
  cream: "#FFF1D0",
  ecru: "#ece9df",
};

function normalizeColour(colour: string): string {
  return colour.trim().toLowerCase();
}

function getColourHex(colour: string): string {
  return COLOUR_HEX_MAP[normalizeColour(colour)] ?? "#E5E7EB";
}

function getVariantImages(
  variant: MerchProductVariant | null,
): string[] {
  const images = variant?.metadata?.images;

  return Array.isArray(images)
    ? images.filter(
      (image): image is string =>
        typeof image === "string" && image.trim().length > 0,
    )
    : [];
}

function getImageSrc(image: string): string {
  if (/^https?:\/\//i.test(image) || image.startsWith("data:")) {
    return image;
  }

  return `${import.meta.env.BASE_URL}${image}`;
}

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

  const priceInCents = selectedVariant?.price ?? product.price;

  const convertedPrice = convertPrice(
    String(priceInCents),
    currentCurrency.code,
    exchangeRates
  );

  const formattedPrice = formatPrice(
    convertedPrice,
    currentCurrency.code,
  );

  const selectedColourVariant =
    variants.find(
      (variant) =>
        normalizeColour(variant.colour ?? "") ===
        normalizeColour(selectedColour ?? ""),
    ) ?? selectedVariant;

  const colourImages = getVariantImages(selectedColourVariant);

  // Keep older products working until colour galleries have been added.
  const displayedImages =
    colourImages.length > 0 ? colourImages : product.images;

  const safeSelectedImage =
    displayedImages.length > 0
      ? Math.min(selectedImage, displayedImages.length - 1)
      : 0;

  const mainImage = displayedImages[safeSelectedImage];


  const availableColours = Array.from(
    new Map(
      variants
        .map((variant) => variant.colour?.trim())
        .filter((colour): colour is string => Boolean(colour))
        .map((colour) => [normalizeColour(colour), colour]),
    ).values(),
  );

  const availableSizes = Array.from(
    new Set(
      variants.map((variant) => variant.size).filter((size): size is string => size !== null && size !== undefined,),
    ),
  );


  function handleColourChange(colour: string) {
    setSelectedColour(colour);
    setSelectedImage(0);

    const normalizedColour = normalizeColour(colour);

    const matchingVariant = variants.find(
      (variant) =>
        normalizeColour(variant.colour ?? "") === normalizedColour &&
        variant.size === selectedSize,
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      return;
    }

    const firstColourVariant = variants.find(
      (variant) =>
        normalizeColour(variant.colour ?? "") === normalizedColour,
    );

    if (firstColourVariant) {
      setSelectedVariant(firstColourVariant);
      setSelectedSize(firstColourVariant.size ?? null);
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

  return (
    <>
      <title>Xoxxly | {product.name}</title>

      <div className="background-container">
        <MerchHeader />

        <div className="product-page" ref={divRef}>
          <div className="product-page-outer-container">
            <div className="product-images">
              <div className="product-thumbnail-list">
                {displayedImages.map((image, index) => (
                  <button
                    key={image}
                    className={`product-thumbnail ${safeSelectedImage === index
                      ? "product-thumbnail-selected"
                      : ""
                      }`}
                    onClick={() => setSelectedImage(index)}
                    type="button"
                  >
                    <img
                      src={getImageSrc(image)}
                      alt={`${product.name} thumbnail ${index + 1}`}
                    />
                  </button>
                ))}
              </div>

              <div className="product-main-image-container">
                {mainImage && (
                  <img
                    className="product-main-image"
                    src={getImageSrc(mainImage)}
                    alt={`${product.name} - ${selectedColour ?? ""}`}
                  />
                )}
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
                  <h2>
                    Colour
                    {selectedColour && (
                      <span className="product-selected-colour">
                        {" "}: {selectedColour}
                      </span>
                    )}
                  </h2>

                  <div className="product-variant-list product-colour-list">
                    {availableColours.map((colour) => {
                      const isSelected =
                        normalizeColour(selectedColour ?? "") ===
                        normalizeColour(colour);

                      return (
                        <button
                          key={colour}
                          type="button"
                          className={`product-colour-swatch ${isSelected ? "product-colour-swatch-selected" : ""
                            }`}
                          style={{ "--swatch-colour": getColourHex(colour) } as CSSProperties}
                          onClick={() => handleColourChange(colour)}
                          aria-label={`Select colour ${colour}`}
                          aria-pressed={isSelected}
                          title={colour}
                        >
                          <span className="product-colour-swatch-circle" />
                        </button>
                      );
                    })}
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
