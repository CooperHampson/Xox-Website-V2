import {
  useState,
  type ChangeEvent,
} from 'react';

import { useParams } from 'react-router-dom';

import {
  MerchViewer,
  type PlacedArtwork,
} from './components/MerchViewer/MerchViewer';

import './DesignStudioPage.css';

type DesignAsset = {
  id: number;
  name: string;
  url: string;
};

export default function DesignStudioPage() {
  const { designId } = useParams();

  const isEditing =
    Boolean(designId);

  const [
    selectedColour,
    setSelectedColour,
  ] = useState('#ffffff');

  const [assets, setAssets] =
    useState<DesignAsset[]>([]);

  const [
    selectedAssetIds,
    setSelectedAssetIds,
  ] = useState<number[]>([]);

  const [
    placedArtworks,
    setPlacedArtworks,
  ] = useState<PlacedArtwork[]>([]);

  const [
    selectedArtworkId,
    setSelectedArtworkId,
  ] = useState<number | null>(null);

  function handleAssetUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files = event.target.files;

    if (!files) {
      return;
    }

    const newAssets: DesignAsset[] =
      Array.from(files).map(
        (file, index) => ({
          id:
            Date.now() + index,
          name: file.name,
          url: URL.createObjectURL(
            file,
          ),
        }),
      );

    setAssets(
      (currentAssets) => [
        ...currentAssets,
        ...newAssets,
      ],
    );

    event.target.value = '';
  }

  function handleAssetSelection(
    assetId: number,
  ) {
    setSelectedAssetIds(
      (currentIds) => {
        if (
          currentIds.includes(
            assetId,
          )
        ) {
          return currentIds.filter(
            (id) =>
              id !== assetId,
          );
        }

        return [
          ...currentIds,
          assetId,
        ];
      },
    );

    const existingArtwork =
      placedArtworks.find(
        (artwork) =>
          artwork.assetId ===
          assetId,
      );

    if (existingArtwork) {
      setSelectedArtworkId(
        existingArtwork.id,
      );

      return;
    }

    const newArtwork: PlacedArtwork =
      {
        id: Date.now(),
        assetId,
        placement: {
          position: {
            x: 0,
            y: 50,
            z: 5.7,
          },
          normal: {
            x: 0,
            y: 0,
            z: 1,
          },
          scale: 2.5,
          rotation: 0,
        },
      };

    setPlacedArtworks(
      (currentArtworks) => [
        ...currentArtworks,
        newArtwork,
      ],
    );

    setSelectedArtworkId(
      newArtwork.id,
    );
  }

  function handleDeleteSelectedAssets() {
    setAssets(
      (currentAssets) =>
        currentAssets.filter(
          (asset) =>
            !selectedAssetIds.includes(
              asset.id,
            ),
        ),
    );

    setPlacedArtworks(
      (currentArtworks) =>
        currentArtworks.filter(
          (artwork) =>
            !selectedAssetIds.includes(
              artwork.assetId,
            ),
        ),
    );

    if (
      selectedArtworkId !==
      null
    ) {
      const selectedArtwork =
        placedArtworks.find(
          (artwork) =>
            artwork.id ===
            selectedArtworkId,
        );

      if (
        selectedArtwork &&
        selectedAssetIds.includes(
          selectedArtwork.assetId,
        )
      ) {
        setSelectedArtworkId(
          null,
        );
      }
    }

    setSelectedAssetIds([]);
  }

  function handleArtworkSelect(
    artworkId: number,
  ) {
    setSelectedArtworkId(
      artworkId,
    );
  }

  function handleArtworkPositionChange(
    artworkId: number,
    surface: {
      position: {
        x: number;
        y: number;
        z: number;
      };
      normal: {
        x: number;
        y: number;
        z: number;
      };
    },
  ) {
    setPlacedArtworks(
      (currentArtworks) =>
        currentArtworks.map(
          (artwork) =>
            artwork.id ===
            artworkId
              ? {
                  ...artwork,
                  placement: {
                    ...artwork.placement,
                    position:
                      surface.position,
                    normal:
                      surface.normal,
                  },
                }
              : artwork,
        ),
    );
  }

  function handleArtworkScaleChange(
    scale: number,
  ) {
    if (
      selectedArtworkId ===
      null
    ) {
      return;
    }

    setPlacedArtworks(
      (currentArtworks) =>
        currentArtworks.map(
          (artwork) =>
            artwork.id ===
            selectedArtworkId
              ? {
                  ...artwork,
                  placement: {
                    ...artwork.placement,
                    scale,
                  },
                }
              : artwork,
        ),
    );
  }

  function handleArtworkRotationChange(
    rotation: number,
  ) {
    if (
      selectedArtworkId ===
      null
    ) {
      return;
    }

    setPlacedArtworks(
      (currentArtworks) =>
        currentArtworks.map(
          (artwork) =>
            artwork.id ===
            selectedArtworkId
              ? {
                  ...artwork,
                  placement: {
                    ...artwork.placement,
                    rotation,
                  },
                }
              : artwork,
        ),
    );
  }

  const selectedArtwork =
    placedArtworks.find(
      (artwork) =>
        artwork.id ===
        selectedArtworkId,
    );

  return (
    <main className="design-studio-page">
      <header className="design-studio-header">
        <h1>
          {isEditing
            ? 'Edit Merch Design'
            : 'Design Studio'}
        </h1>

        <p>
          {isEditing
            ? `Editing design ${designId}`
            : 'Create a new merch design.'}
        </p>
      </header>

      <div className="design-studio-layout">
        <aside className="design-studio-sidebar design-studio-assets">
          <h2>Assets</h2>

          <label className="upload-asset-button">
            Upload Asset

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={
                handleAssetUpload
              }
              hidden
            />
          </label>

          <div className="assets-list">
            {assets.map(
              (asset) => {
                const isSelected =
                  selectedAssetIds.includes(
                    asset.id,
                  );

                return (
                  <div
                    key={asset.id}
                    className={`asset-item ${
                      isSelected
                        ? 'asset-item-selected'
                        : ''
                    }`}
                    onClick={() =>
                      handleAssetSelection(
                        asset.id,
                      )
                    }
                  >
                    <input
                      type="checkbox"
                      checked={
                        isSelected
                      }
                      onChange={() =>
                        handleAssetSelection(
                          asset.id,
                        )
                      }
                      onClick={(
                        event,
                      ) =>
                        event.stopPropagation()
                      }
                      aria-label={`Select ${asset.name}`}
                    />

                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="asset-preview"
                    />

                    <span className="asset-name">
                      {asset.name}
                    </span>
                  </div>
                );
              },
            )}
          </div>

          <button
            type="button"
            className="delete-selected-button"
            onClick={
              handleDeleteSelectedAssets
            }
            disabled={
              selectedAssetIds.length ===
              0
            }
          >
            Delete Selected
          </button>
        </aside>

        <section className="design-studio-viewer">
          <MerchViewer
            colour={
              selectedColour
            }
            assets={assets}
            placedArtworks={
              placedArtworks
            }
            selectedArtworkId={
              selectedArtworkId
            }
            onSelectArtwork={
              handleArtworkSelect
            }
            onArtworkPositionChange={
              handleArtworkPositionChange
            }
          />
        </section>

        <aside className="design-studio-sidebar design-studio-controls">
          <h2>Merch</h2>

          <div className="control-section">
            <h3>Template</h3>

            <div className="template-options">
              <button type="button">
                Shirt
              </button>

              <button type="button">
                Hoodie
              </button>

              <button type="button">
                Water Bottle
              </button>
            </div>
          </div>

          <div className="control-section">
            <h3>Colour</h3>

            <div className="colour-options">
              <button
                type="button"
                className="colour-option colour-white"
                aria-label="White"
                onClick={() =>
                  setSelectedColour(
                    '#ffffff',
                  )
                }
              />

              <button
                type="button"
                className="colour-option colour-black"
                aria-label="Black"
                onClick={() =>
                  setSelectedColour(
                    '#111111',
                  )
                }
              />

              <button
                type="button"
                className="colour-option colour-red"
                aria-label="Red"
                onClick={() =>
                  setSelectedColour(
                    '#d32f2f',
                  )
                }
              />

              <button
                type="button"
                className="colour-option colour-blue"
                aria-label="Blue"
                onClick={() =>
                  setSelectedColour(
                    '#1976d2',
                  )
                }
              />

              <button
                type="button"
                className="colour-option colour-green"
                aria-label="Green"
                onClick={() =>
                  setSelectedColour(
                    '#388e3c',
                  )
                }
              />
            </div>
          </div>

          {selectedArtwork && (
            <>
              <div className="control-section">
                <h3>
                  Artwork Scale
                </h3>

                <label>
                  Size

                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={
                      selectedArtwork
                        .placement
                        .scale
                    }
                    onChange={(
                      event,
                    ) =>
                      handleArtworkScaleChange(
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <span>
                  {
                    selectedArtwork
                      .placement
                      .scale
                  }
                </span>
              </div>

              <div className="control-section">
                <h3>
                  Artwork Rotation
                </h3>

                <label>
                  Rotation

                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={
                      selectedArtwork
                        .placement
                        .rotation
                    }
                    onChange={(
                      event,
                    ) =>
                      handleArtworkRotationChange(
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </label>

                <span>
                  {
                    selectedArtwork
                      .placement
                      .rotation
                  }
                  °
                </span>
              </div>
            </>
          )}

          <div className="control-section">
            <h3>
              Extra Features
            </h3>

            <label>
              <input
                type="checkbox"
                name="front-pocket"
              />
              Front Pocket
            </label>

            <label>
              <input
                type="checkbox"
                name="back-print"
              />
              Back Print
            </label>

            <label>
              <input
                type="checkbox"
                name="sleeve-print"
              />
              Sleeve Print
            </label>
          </div>

          <div className="design-actions">
            <button
              type="button"
              className="save-design-button"
            >
              Save Merch Design
            </button>

            <button
              type="button"
              className="publish-design-button"
            >
              Publish Merch Design
            </button>

            <button
              type="button"
              className="delete-design-button"
            >
              Delete Merch Design
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}