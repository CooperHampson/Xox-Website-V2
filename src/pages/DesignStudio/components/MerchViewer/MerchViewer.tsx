import {
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Canvas,
  type ThreeEvent,
} from '@react-three/fiber';

import {
  OrbitControls,
  Center,
  Decal,
  useGLTF,
  Bounds,
} from '@react-three/drei';

import * as THREE from 'three';

import './MerchViewer.css';

export type PlacedArtwork = {
  id: number;
  assetId: number;
  placement: {
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
    scale: number;
    rotation: number;
  };
};

export type MerchAsset = {
  id: number;
  name: string;
  url: string;
};

type MerchViewerProps = {
  colour: string;
  assets: MerchAsset[];
  placedArtworks: PlacedArtwork[];
  selectedArtworkId: number | null;

  onSelectArtwork: (
    artworkId: number,
  ) => void;

  onArtworkPositionChange: (
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
  ) => void;
};

type ModelBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

function ArtworkDecal({
  url,
  position,
  normal,
  scale,
  rotation,
  selected,
  onSelect,
  onStartDrag,
  mesh,
}: {
  url: string;
  position: THREE.Vector3;
  normal: THREE.Vector3;
  scale: number;
  rotation: number;
  selected: boolean;
  onSelect: () => void;
  onStartDrag: (
    event: ThreeEvent<PointerEvent>,
  ) => void;
  mesh: React.RefObject<THREE.Mesh>;
}) {
  const texture = useMemo(
    () =>
      new THREE.TextureLoader().load(url),
    [url],
  );

  const displayScale = selected
    ? scale * 1.08
    : scale;

  const surfaceQuaternion =
    useMemo(() => {
      const quaternion =
        new THREE.Quaternion();

      quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal.clone().normalize(),
      );

      return quaternion;
    }, [normal]);

  return (
    <Decal
      mesh={mesh}
      position={position}
      quaternion={surfaceQuaternion}
      rotation={[
        0,
        0,
        THREE.MathUtils.degToRad(
          rotation,
        ),
      ]}
      scale={[
        displayScale,
        displayScale,
        displayScale,
      ]}
      map={texture}
      onPointerDown={(event) => {
        event.stopPropagation();

        onSelect();

        onStartDrag(event);
      }}
      onClick={(event) => {
        event.stopPropagation();

        onSelect();
      }}
    />
  );
}

function MerchModel({
  colour,
  assets,
  placedArtworks,
  selectedArtworkId,
  onSelectArtwork,
  onArtworkPositionChange,
  onDraggingChange,
}: {
  colour: string;

  assets: MerchAsset[];

  placedArtworks: PlacedArtwork[];

  selectedArtworkId: number | null;

  onSelectArtwork: (
    artworkId: number,
  ) => void;

  onArtworkPositionChange: (
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
  ) => void;

  onDraggingChange: (
    dragging: boolean,
  ) => void;
}) {
  const { scene } = useGLTF(
    '/models/shirt.glb',
  );

  const renderedMeshRef =
    useRef<THREE.Mesh>(null!);

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);

  /*
   * Find the actual mesh inside the GLB.
   */
  const sourceMesh =
    useMemo<THREE.Mesh | null>(() => {
      let foundMesh:
        | THREE.Mesh
        | null = null;

      scene.traverse((child) => {
        if (
          foundMesh === null &&
          child instanceof THREE.Mesh
        ) {
          foundMesh = child;
        }
      });

      return foundMesh;
    }, [scene]);

  /*
   * Calculate the model's bounds
   * dynamically from the loaded model.
   */
  const modelBounds =
    useMemo<ModelBounds | null>(() => {
      const box =
        new THREE.Box3().setFromObject(
          scene,
        );

      if (box.isEmpty()) {
        return null;
      }

      return {
        minX: box.min.x,
        maxX: box.max.x,
        minY: box.min.y,
        maxY: box.max.y,
        minZ: box.min.z,
        maxZ: box.max.z,
      };
    }, [scene]);

  if (!sourceMesh) {
    return null;
  }

  if (!modelBounds) {
    return null;
  }

  const bounds = modelBounds;

  const sourceMaterial =
    sourceMesh.material;

  if (
    !(
      sourceMaterial instanceof
      THREE.MeshStandardMaterial
    )
  ) {
    return null;
  }

  /*
   * Clone the original material so
   * we don't modify the cached GLB.
   */
  const merchMaterial =
    sourceMaterial.clone();

  /*
   * Remove the baked artwork/textures
   * from the original shirt model.
   */
  merchMaterial.map = null;

  merchMaterial.normalMap = null;

  merchMaterial.roughnessMap =
    null;

  merchMaterial.metalnessMap =
    null;

  merchMaterial.aoMap = null;

  /*
   * Apply the selected shirt colour.
   */
  merchMaterial.color.set(colour);

  merchMaterial.roughness = 0.8;

  merchMaterial.metalness = 0;

  merchMaterial.needsUpdate = true;

  const modelHeight =
    bounds.maxY -
    bounds.minY;

  /*
   * Artwork scale is still based on
   * the shirt's model height.
   */
  function getArtworkScale(
    artwork: PlacedArtwork,
  ) {
    return (
      artwork.placement.scale *
      modelHeight
    );
  }

  /*
   * Start dragging the currently
   * selected artwork.
   */
  function handleArtworkDragStart(
    event: ThreeEvent<PointerEvent>,
  ) {
    if (selectedArtworkId === null) {
      return;
    }

    event.stopPropagation();

    setIsDragging(true);

    onDraggingChange(true);
  }

  /*
   * During dragging, use the actual
   * camera ray to find the point on
   * the shirt underneath the mouse.
   *
   * This gives us a true 3D surface
   * position instead of reconstructing
   * the position from X/Y.
   */
  function handlePointerMove(
    event: ThreeEvent<PointerEvent>,
  ) {
    if (
      !isDragging ||
      selectedArtworkId === null ||
      !renderedMeshRef.current
    ) {
      return;
    }

    event.stopPropagation();

    const mesh =
      renderedMeshRef.current;

    const raycaster =
      new THREE.Raycaster();

    raycaster.set(
      event.ray.origin,
      event.ray.direction,
    );

    const intersections =
      raycaster.intersectObject(
        mesh,
        false,
      );

    if (intersections.length === 0) {
      return;
    }

    const intersection =
      intersections[0];

    if (!intersection.face) {
      return;
    }

    /*
     * Convert the hit point from WORLD
     * coordinates into the shirt mesh's
     * local coordinate system.
     */
    const localPoint =
      mesh.worldToLocal(
        intersection.point.clone(),
      );

    /*
     * The face normal is already expressed
     * in the mesh's local coordinate system.
     */
    const localNormal =
      intersection.face.normal
        .clone()
        .normalize();

    /*
     * Keep the decal slightly above the
     * shirt surface to prevent z-fighting.
     */
    const surfaceOffset =
      modelHeight * 0.003;

    const decalPosition =
      localPoint
        .clone()
        .add(
          localNormal
            .clone()
            .multiplyScalar(
              surfaceOffset,
            ),
        );

    onArtworkPositionChange(
      selectedArtworkId,
      {
        position: {
          x: decalPosition.x,
          y: decalPosition.y,
          z: decalPosition.z,
        },

        normal: {
          x: localNormal.x,
          y: localNormal.y,
          z: localNormal.z,
        },
      },
    );
  }

  /*
   * Finish artwork dragging.
   */
  function handlePointerUp(
    event: ThreeEvent<PointerEvent>,
  ) {
    event.stopPropagation();

    setIsDragging(false);

    onDraggingChange(false);
  }

  return (
    <Center>
      <group>
        <mesh
          ref={renderedMeshRef}
          geometry={sourceMesh.geometry}
          material={merchMaterial}
          position={sourceMesh.position}
          rotation={sourceMesh.rotation}
          scale={sourceMesh.scale}
          onPointerMove={
            handlePointerMove
          }
          onPointerUp={
            handlePointerUp
          }
        />

        {placedArtworks.map(
          (artwork) => {
            const asset =
              assets.find(
                (item) =>
                  item.id ===
                  artwork.assetId,
              );

            if (!asset) {
              return null;
            }

            const position =
              new THREE.Vector3(
                artwork.placement.position.x,
                artwork.placement.position.y,
                artwork.placement.position.z,
              );

            const normal =
              new THREE.Vector3(
                artwork.placement.normal.x,
                artwork.placement.normal.y,
                artwork.placement.normal.z,
              );

            const scale =
              getArtworkScale(
                artwork,
              );

            return (
              <ArtworkDecal
                key={artwork.id}
                url={asset.url}
                position={position}
                normal={normal}
                scale={scale}
                rotation={
                  artwork.placement
                    .rotation
                }
                selected={
                  artwork.id ===
                  selectedArtworkId
                }
                onSelect={() =>
                  onSelectArtwork(
                    artwork.id,
                  )
                }
                onStartDrag={
                  handleArtworkDragStart
                }
                mesh={renderedMeshRef}
              />
            );
          },
        )}
      </group>
    </Center>
  );
}

useGLTF.preload(
  '/models/shirt.glb',
);

export function MerchViewer({
  colour,
  assets,
  placedArtworks,
  selectedArtworkId,
  onSelectArtwork,
  onArtworkPositionChange,
}: MerchViewerProps) {
  const [
    isArtworkDragging,
    setIsArtworkDragging,
  ] = useState(false);

  return (
    <div className="merch-viewer">
      <Canvas
        camera={{
          position: [4, 3, 5],
          fov: 45,
        }}
      >
        <ambientLight
          intensity={2}
        />

        <directionalLight
          position={[5, 5, 5]}
          intensity={3}
        />

        <Bounds
          fit
          clip
          observe
          margin={1.2}
        >
          <MerchModel
            colour={colour}
            assets={assets}
            placedArtworks={
              placedArtworks
            }
            selectedArtworkId={
              selectedArtworkId
            }
            onSelectArtwork={
              onSelectArtwork
            }
            onArtworkPositionChange={
              onArtworkPositionChange
            }
            onDraggingChange={
              setIsArtworkDragging
            }
          />
        </Bounds>

        <OrbitControls
          enablePan={false}
          enableZoom={
            !isArtworkDragging
          }
          enableRotate={
            !isArtworkDragging
          }
        />
      </Canvas>
    </div>
  );
}