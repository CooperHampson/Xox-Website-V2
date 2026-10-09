import { useEffect, useState } from 'react';

import {
  createMerchProduct,
  createMerchVariant,
  deleteMerchProduct,
  deleteMerchVariant,
  getAdminMerchProducts,
  getAdminMerchVariants,
  updateMerchProduct,
  updateMerchVariant,
  uploadColourImages,
} from '../../../../api/merchApi';

import type {
  MerchItem,
  MerchProductVariant,
} from '../../../../types/merch';

import './AdminSection.css';

export default function AdminMerchSection() {
  const [products, setProducts] = useState<MerchItem[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<MerchItem | null>(null);

  const [variants, setVariants] = useState<
    MerchProductVariant[]
  >([]);

  const [loadingProducts, setLoadingProducts] =
    useState(false);

  const [loadingVariants, setLoadingVariants] =
    useState(false);

  const [productSaving, setProductSaving] =
    useState(false);

  const [variantSaving, setVariantSaving] =
    useState(false);

  const [error, setError] = useState('');

  const [editingProductId, setEditingProductId] =
    useState<string | null>(null);

  const [editingVariantId, setEditingVariantId] =
    useState<string | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    featured: false,
    description: '',
    images: '',
    details: '',
    tags: '',
    colours: '',
    materials: '',
    isOnPromotion: false,
    promotionPrice: '',
    isSoldOut: false,
    isPublished: true,
  });

  const [variantForm, setVariantForm] = useState({
    sku: '',
    name: '',
    colour: '',
    size: '',
    material: '',
    price: '',
    isSoldOut: false,
    isPublished: true,
  });
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [galleryColour, setGalleryColour] = useState('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [gallerySaving, setGallerySaving] = useState(false);
  const [galleryError, setGalleryError] = useState('');
  const [gallerySuccess, setGallerySuccess] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      setError('');

      const data = await getAdminMerchProducts();

      setProducts(data);
    } catch {
      setError('Failed to load merch products.');
    } finally {
      setLoadingProducts(false);
    }
  }

  async function selectProduct(product: MerchItem) {
    try {
      setSelectedProduct(product);
      setLoadingVariants(true);
      setError('');

      const data = await getAdminMerchVariants(
        product.id,
      );

      setVariants(data);

      resetVariantForm();
    } catch {
      setError('Failed to load product variants.');
    } finally {
      setLoadingVariants(false);
    }
  }

  function resetProductForm() {
    setEditingProductId(null);

    setProductForm({
      name: '',
      category: '',
      featured: false,
      description: '',
      images: '',
      details: '',
      tags: '',
      colours: '',
      materials: '',
      isOnPromotion: false,
      promotionPrice: '',
      isSoldOut: false,
      isPublished: true,
    });
  }

  function resetVariantForm() {
    setEditingVariantId(null);

    setVariantForm({
      sku: '',
      name: '',
      colour: '',
      size: '',
      material: '',
      price: '',
      isSoldOut: false,
      isPublished: true,
    });
  }

  function startCreatingProduct() {
    setCreatingProduct(true);
    setSelectedProduct(null);
    setVariants([]);
    resetProductForm();
    resetVariantForm();
    setError('');
  }

  function startEditingProduct(product: MerchItem) {
    setCreatingProduct(false);
    setSelectedProduct(product);
    setEditingProductId(product.id);

    setProductForm({
      name: product.name,
      category: product.category,
      featured: product.featured,
      description: product.description,

      images: product.images.join('\n'),

      details: (product.details ?? []).join(
        '\n',
      ),

      tags: (product.tags ?? []).join(', '),

      colours: (product.colours ?? []).join(
        ', ',
      ),

      materials: (product.materials ?? []).join(
        ', ',
      ),

      isOnPromotion:
        product.isOnPromotion ?? false,

      promotionPrice:
        product.promotionPrice ?? '',

      isSoldOut:
        product.isSoldOut ?? false,

      isPublished:
        product.isPublished ?? true,
    });

    setError('');
  }

  function startEditingVariant(
    variant: MerchProductVariant,
  ) {
    setEditingVariantId(variant.id);

    setVariantForm({
      sku: variant.sku,
      name: variant.name ?? '',
      colour: variant.colour ?? '',
      size: variant.size ?? '',
      material: variant.material ?? '',
      price: (Number(variant.price) / 100).toFixed(2),
      isSoldOut: variant.isSoldOut,
      isPublished: variant.isPublished,
    });

    setError('');
  }

  async function handleSaveProduct() {
    setError('');

    if (!productForm.name.trim()) {
      setError('Product name is required.');
      return;
    }

    if (!productForm.category.trim()) {
      setError('Product category is required.');
      return;
    }

    if (!productForm.description.trim()) {
      setError('Product description is required.');
      return;
    }

    let promotionPrice: number | undefined;

    if (productForm.isOnPromotion) {
      promotionPrice = Number(
        productForm.promotionPrice,
      );

      if (
        !Number.isFinite(promotionPrice) ||
        promotionPrice < 0
      ) {
        setError(
          'Promotion price must be a valid number.',
        );
        return;
      }
    }

    try {
      setProductSaving(true);

      const payload = {
        name: productForm.name.trim(),
        category: productForm.category.trim(),
        featured: productForm.featured,
        description: productForm.description.trim(),

        images: productForm.images
          .split('\n')
          .map((value) => value.trim())
          .filter(Boolean),

        details: productForm.details
          .split('\n')
          .map((value) => value.trim())
          .filter(Boolean),

        tags: productForm.tags
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),

        colours: productForm.colours
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),

        materials: productForm.materials
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),

        isOnPromotion: productForm.isOnPromotion,

        promotionPrice: productForm.isOnPromotion
          ? promotionPrice
          : undefined,

        isSoldOut: productForm.isSoldOut,
        isPublished: productForm.isPublished,
      };

      if (editingProductId) {
        const updated =
          await updateMerchProduct(
            editingProductId,
            payload,
          );

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === updated.id
              ? updated
              : product,
          ),
        );

        setSelectedProduct(updated);
      } else {
        const created =
          await createMerchProduct({ ...payload, price: 0 });

        setProducts((currentProducts) => [
          created,
          ...currentProducts,
        ]);

        setSelectedProduct(created);
        setEditingProductId(created.id);
        setCreatingProduct(false);
      }
    } catch {
      setError('Failed to save product.');
    } finally {
      setProductSaving(false);
    }
  }

  async function handleDeleteProduct() {
    if (!selectedProduct) {
      return;
    }

    const confirmed = window.confirm(
      `Delete product "${selectedProduct.name}"? This will also delete its variants.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setProductSaving(true);

      await deleteMerchProduct(
        selectedProduct.id,
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.id !== selectedProduct.id,
        ),
      );

      setSelectedProduct(null);
      setVariants([]);

      resetProductForm();
      resetVariantForm();
    } catch {
      setError('Failed to delete product.');
    } finally {
      setProductSaving(false);
    }
  }

  async function handleSaveVariant() {
    if (!selectedProduct) {
      setError('Select a product first.');
      return;
    }

    setError('');

    if (!variantForm.sku.trim()) {
      setError('SKU is required.');
      return;
    }

    const priceInDollars = Number(variantForm.price);

    if (
      variantForm.price.trim() === '' ||
      !Number.isFinite(priceInDollars) ||
      priceInDollars < 0
    ) {
      setError('Variant price must be a valid number.');
      return;
    }

    const priceInCents = Math.round(priceInDollars * 100);

    try {
      setVariantSaving(true);

      const payload = {
        sku: variantForm.sku.trim(),

        name:
          variantForm.name.trim() || undefined,

        colour:
          variantForm.colour.trim() || undefined,

        size:
          variantForm.size.trim() || undefined,

        material:
          variantForm.material.trim() || undefined,

        price: priceInCents,
        isSoldOut: variantForm.isSoldOut,
        isPublished: variantForm.isPublished,
      };

      if (editingVariantId) {
        const updated =
          await updateMerchVariant(
            selectedProduct.id,
            editingVariantId,
            payload,
          );

        setVariants((currentVariants) =>
          currentVariants.map((variant) =>
            variant.id === updated.id
              ? updated
              : variant,
          ),
        );
      } else {
        const created =
          await createMerchVariant(
            selectedProduct.id,
            payload,
          );

        setVariants((currentVariants) => [
          ...currentVariants,
          created,
        ]);
      }

      resetVariantForm();
    } catch {
      setError('Failed to save variant.');
    } finally {
      setVariantSaving(false);
    }
  }

  async function handleDeleteVariant(
    variant: MerchProductVariant,
  ) {
    if (!selectedProduct) {
      return;
    }

    const confirmed = window.confirm(
      `Delete variant "${variant.sku}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setVariantSaving(true);

      await deleteMerchVariant(
        selectedProduct.id,
        variant.id,
      );

      setVariants((currentVariants) =>
        currentVariants.filter(
          (item) => item.id !== variant.id,
        ),
      );

      if (editingVariantId === variant.id) {
        resetVariantForm();
      }
    } catch {
      setError('Failed to delete variant.');
    } finally {
      setVariantSaving(false);
    }
  }

  async function handleUploadColourImages() {
    if (!selectedProduct) {
      setGalleryError('Select a product first.');
      return;
    }

    if (!galleryColour) {
      setGalleryError('Select a colour.');
      return;
    }

    if (galleryFiles.length === 0) {
      setGalleryError('Select at least one image.');
      return;
    }

    if (galleryFiles.length > 20) {
      setGalleryError('You can upload a maximum of 20 images at once.');
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    const invalidFile = galleryFiles.find(
      (file) =>
        !allowedTypes.includes(file.type) ||
        file.size > 5 * 1024 * 1024,
    );

    if (invalidFile) {
      setGalleryError(
        'Use JPEG, PNG, or WebP images, each no larger than 5 MB.',
      );
      return;
    }

    try {
      setGallerySaving(true);
      setGalleryError('');
      setGallerySuccess('');
      setGalleryImages([]);

      const result = await uploadColourImages(
        selectedProduct.id,
        galleryColour,
        galleryFiles,
      );

      setGalleryImages(result.images);
      setGalleryFiles([]);
      setGallerySuccess(
        `Gallery uploaded successfully for ${galleryColour}.`,
      );

      // Refresh variants so the admin data reflects the latest gallery.
      const refreshedVariants = await getAdminMerchVariants(
        selectedProduct.id,
      );

      setVariants(refreshedVariants);
    } catch {
      setGalleryError('Failed to upload the colour gallery.');
    } finally {
      setGallerySaving(false);
    }
  }

  return (
    <section>
      <p className="area-title">Merch Management</p>

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '24px',
        }}
      >
        {/* PRODUCTS */}

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p className="area-smaller-title">Products</p>

            <button
              type="button"
              onClick={startCreatingProduct}
              className="ap-button"
            >
              Add Product
            </button>
          </div>

          {loadingProducts ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="merch-table-container">
              <table className="merch-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Variants</th>
                    <th>Published</th>
                    <th>Sold Out</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>

                      <td>
                        {product.category}
                      </td>

                      <td>{product._count?.variants ?? 0}{' '}{(product._count?.variants ?? 0) === 1 ? 'variant' : 'variants'}</td>

                      <td>
                        {product.isPublished
                          ? 'Yes'
                          : 'No'}
                      </td>

                      <td>
                        {product.isSoldOut
                          ? 'Yes'
                          : 'No'}
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            startEditingProduct(
                              product,
                            )
                          }
                          className="table-button"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            selectProduct(product)
                          }
                          className="table-button"
                        >
                          Manage Variants
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PRODUCT / VARIANT MANAGEMENT */}

        <div>
          {!creatingProduct && !editingProductId &&
            !selectedProduct ? (
            <p className="area-smaller-title">
              Select a product to edit it or
              manage its variants.
            </p>
          ) : (
            <>
              {/* PRODUCT EDITOR */}

              <p className="area-smaller-title">
                {editingProductId
                  ? 'Edit Product'
                  : 'Create Product'}
              </p>

              <div>
                <label className="merch-label">
                  Name
                  <input
                    type="text"
                    value={
                      productForm.name
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        name:
                          event.target.value,
                      })
                    }
                    className="merch-input"
                  />
                </label>
              </div>

              <div>
                <label className="merch-label">
                  Category
                  <input
                    type="text"
                    value={
                      productForm.category
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        category:
                          event.target.value,
                      })
                    }
                    className="merch-input"
                  />
                </label>
              </div>

              <div>
                <label className="merch-label">
                  Description
                  <textarea
                    value={
                      productForm.description
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        description:
                          event.target.value,
                      })
                    }
                    className="merch-input"
                  />
                </label>
              </div>

              <div>
                <label className="merch-label">
                  Images
                  <textarea
                    placeholder="One image URL per line"
                    value={
                      productForm.images
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        images:
                          event.target.value,
                      })
                    }
                    className="merch-input"
                  />
                </label>
              </div>

              <div>
                <label className="merch-label">
                  Details
                  <textarea
                    placeholder="One detail per line"
                    value={
                      productForm.details
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        details:
                          event.target.value,
                      })
                    }
                    className="merch-input"
                  />
                </label>
              </div>

              <div>
                <label className="merch-label">
                  Tags
                  <input
                    type="text"
                    placeholder="shirt, cotton, summer"
                    value={
                      productForm.tags
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        tags:
                          event.target.value,
                      })
                    }
                    className="merch-input"
                  />
                </label>
              </div>

              <div>
                <label className="merch-label">
                  Colours
                  <input
                    type="text"
                    placeholder="Black, White, Red"
                    value={
                      productForm.colours
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        colours:
                          event.target.value,
                      })
                    }
                    className="merch-input"
                  />
                </label>
              </div>

              <div>
                <label className="merch-label">
                  Materials
                  <input
                    type="text"
                    placeholder="Cotton, Polyester"
                    value={
                      productForm.materials
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        materials:
                          event.target.value,
                      })
                    }
                    className="merch-input"
                  />
                </label>
              </div>

              <div>
                <label className="merch-label">
                  <input
                    type="checkbox"
                    checked={
                      productForm.featured
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        featured:
                          event.target.checked,
                      })
                    }
                    className="merch-input"
                  />
                  Featured
                </label>
              </div>

              <div>
                <label className="merch-label">
                  <input
                    type="checkbox"
                    checked={
                      productForm.isOnPromotion
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        isOnPromotion:
                          event.target.checked,
                      })
                    }
                    className="merch-input"
                  />
                  On Promotion
                </label>
              </div>

              {productForm.isOnPromotion && (
                <div>
                  <label className="merch-label">
                    Promotion Price
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        productForm.promotionPrice
                      }
                      onChange={(event) =>
                        setProductForm({
                          ...productForm,
                          promotionPrice:
                            event.target.value,
                        })
                      }
                      className="merch-input"
                    />
                  </label>
                </div>
              )}

              <div>
                <label className="merch-label">
                  <input
                    type="checkbox"
                    checked={
                      productForm.isSoldOut
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        isSoldOut:
                          event.target.checked,
                      })
                    }
                    className="merch-input"
                  />
                  Sold Out
                </label>
              </div>

              <div>
                <label className="merch-label">
                  <input
                    type="checkbox"
                    checked={
                      productForm.isPublished
                    }
                    onChange={(event) =>
                      setProductForm({
                        ...productForm,
                        isPublished:
                          event.target.checked,
                      })
                    }
                    className="merch-input"
                  />
                  Published
                </label>
              </div>

              <div>
                <button
                  type="button"
                  onClick={
                    handleSaveProduct
                  }
                  disabled={
                    productSaving
                  }
                  className="ap-button"
                >
                  {productSaving
                    ? 'Saving...'
                    : editingProductId
                      ? 'Save Product'
                      : 'Create Product'}
                </button>

                <button
                  type="button"
                  onClick={
                    resetProductForm
                  }
                  disabled={
                    productSaving
                  }
                  className="ap-button"
                >
                  Cancel
                </button>

                {editingProductId && (
                  <button
                    type="button"
                    onClick={
                      handleDeleteProduct
                    }
                    disabled={
                      productSaving
                    }
                    className="ap-button"
                  >
                    Delete Product
                  </button>
                )}
              </div>

              {/* VARIANTS */}

              {selectedProduct && (
                <>
                  <hr className="variant-hr" />

                  <p className="area-smaller-title">
                    Variants —{' '}
                    {selectedProduct.name}
                  </p>

                  {loadingVariants ? (
                    <p className="merch-text">
                      Loading variants...
                    </p>
                  ) : variants.length ===
                    0 ? (
                    <p className="merch-text">
                      No variants yet.
                    </p>
                  ) : (
                    <div className="merch-variants-table-container">
                      <table className="merch-variants-table">
                        <thead>
                          <tr>
                            <th>SKU</th>
                            <th>Price</th>
                            <th>Colour</th>
                            <th>Size</th>
                            <th>
                              Sold Out
                            </th>
                            <th>
                              Published
                            </th>
                            <th>
                              Actions
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {variants.map(
                            (variant) => (
                              <tr
                                key={
                                  variant.id
                                }
                              >
                                <td>
                                  {
                                    variant.sku
                                  }
                                </td>

                                <td>
                                  {(Number(variant.price) / 100).toLocaleString(
                                    'en-US',
                                    {
                                      style: 'currency',
                                      currency: 'USD',
                                    },
                                  )}
                                </td>

                                <td>
                                  {variant.colour ??
                                    '—'}
                                </td>

                                <td>
                                  {variant.size ??
                                    '—'}
                                </td>

                                <td>
                                  {variant.isSoldOut
                                    ? 'Yes'
                                    : 'No'}
                                </td>

                                <td>
                                  {variant.isPublished
                                    ? 'Yes'
                                    : 'No'}
                                </td>

                                <td>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      startEditingVariant(
                                        variant,
                                      )
                                    }
                                    className="table-button"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteVariant(
                                        variant,
                                      )
                                    }
                                    disabled={
                                      variantSaving
                                    }
                                    className="table-button"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <hr />

                  <p className="area-smaller-title">
                    Colour Image Galleries
                  </p>

                  <p className="merch-text">
                    Upload up to 20 images for a colour. Uploading a new
                    gallery replaces the existing gallery for that colour.
                    Each image must be JPEG, PNG, or WebP and no larger
                    than 5 MB.
                  </p>

                  <div>
                    <label className="merch-label">
                      Colour

                      <select
                        value={galleryColour}
                        onChange={(event) => {
                          setGalleryColour(event.target.value);
                          setGalleryImages([]);
                          setGalleryError('');
                          setGallerySuccess('');
                        }}
                        className="merch-input"
                      >
                        <option value="">Select a colour</option>

                        {[...new Set(
                          variants
                            .map((variant) => variant.colour?.trim())
                            .filter((colour): colour is string => Boolean(colour)),
                        )].map((colour) => (
                          <option key={colour} value={colour}>
                            {colour}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div>
                    <div className="merch-image-upload-control">
                      <label
                        htmlFor="merch-gallery-images"
                        className="merch-image-upload-button"
                      >
                        Choose images
                      </label>

                      <input
                        id="merch-gallery-images"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={(event) => {
                          setGalleryFiles(Array.from(event.target.files ?? []));
                        }}
                        className="merch-image-file-input"
                      />

                      <span className="merch-image-file-count">
                        {galleryFiles.length > 0
                          ? `${galleryFiles.length} selected`
                          : "No images selected"}
                      </span>
                    </div>

                    <p className="merch-text">
                      {galleryFiles.length} image
                      {galleryFiles.length === 1 ? '' : 's'} selected
                    </p>
                  </div>

                  {galleryError && (
                    <p style={{ color: 'red', fontFamily: "Raleway" }}>{galleryError}</p>
                  )}

                  {gallerySuccess && (
                    <p style={{ color: 'green', fontFamily: "Raleway" }}>{gallerySuccess}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleUploadColourImages}
                    disabled={gallerySaving || !galleryColour || galleryFiles.length === 0}
                    className="ap-button"
                  >
                    {gallerySaving ? 'Uploading...' : 'Upload Colour Gallery'}
                  </button>

                  {galleryImages.length > 0 && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '12px',
                        marginTop: '16px',
                      }}
                    >
                      {galleryImages.map((image, index) => (
                        <img
                          key={`${image}-${index}`}
                          src={image}
                          alt={`${galleryColour} gallery image ${index + 1}`}
                          style={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            objectFit: 'cover',
                            borderRadius: '6px',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <p className="merch-text">
                    {editingVariantId
                      ? 'Edit Variant'
                      : 'Add Variant'}
                  </p>

                  <div>
                    <label className="merch-label">
                      SKU
                      <input
                        type="text"
                        value={
                          variantForm.sku
                        }
                        onChange={(event) =>
                          setVariantForm({
                            ...variantForm,
                            sku:
                              event.target
                                .value,
                          })
                        }
                        className="merch-input"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="merch-label">
                      Name
                      <input
                        type="text"
                        value={
                          variantForm.name
                        }
                        onChange={(event) =>
                          setVariantForm({
                            ...variantForm,
                            name:
                              event.target
                                .value,
                          })
                        }
                        className="merch-input"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="merch-label">
                      Colour
                      <input
                        type="text"
                        value={
                          variantForm.colour
                        }
                        onChange={(event) =>
                          setVariantForm({
                            ...variantForm,
                            colour:
                              event.target
                                .value,
                          })
                        }
                        className="merch-input"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="merch-label">
                      Size
                      <input
                        type="text"
                        value={
                          variantForm.size
                        }
                        onChange={(event) =>
                          setVariantForm({
                            ...variantForm,
                            size:
                              event.target
                                .value,
                          })
                        }
                        className="merch-input"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="merch-label">
                      Material
                      <input
                        type="text"
                        value={
                          variantForm.material
                        }
                        onChange={(event) =>
                          setVariantForm({
                            ...variantForm,
                            material:
                              event.target
                                .value,
                          })
                        }
                        className="merch-input"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="merch-label">
                      Price (USD)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variantForm.price}
                        onChange={(event) =>
                          setVariantForm({
                            ...variantForm,
                            price: event.target.value,
                          })
                        }
                        className="merch-input"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="merch-label">
                      <input
                        type="checkbox"
                        checked={
                          variantForm.isSoldOut
                        }
                        onChange={(event) =>
                          setVariantForm({
                            ...variantForm,
                            isSoldOut:
                              event.target
                                .checked,
                          })
                        }
                        className="merch-input"
                      />
                      Sold Out
                    </label>
                  </div>

                  <div>
                    <label className="merch-label">
                      <input
                        type="checkbox"
                        checked={
                          variantForm.isPublished
                        }
                        onChange={(event) =>
                          setVariantForm({
                            ...variantForm,
                            isPublished:
                              event.target
                                .checked,
                          })
                        }
                        className="merch-input"
                      />
                      Published
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleSaveVariant
                    }
                    disabled={
                      variantSaving
                    }
                    className="ap-button"
                  >
                    {variantSaving
                      ? 'Saving...'
                      : editingVariantId
                        ? 'Save Variant'
                        : 'Add Variant'}
                  </button>

                  {editingVariantId && (
                    <button
                      type="button"
                      onClick={
                        resetVariantForm
                      }
                      disabled={
                        variantSaving
                      }
                      className="ap-button"
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}