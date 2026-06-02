import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import countriesRaw from "../../node_modules/three-globe/example/country-polygons/ne_110m_admin_0_countries.geojson?raw";

export type GlobeMarker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  flagImage: string;
  color?: string;
  altitude?: number;
};

export type GlobeConnection = {
  id: string;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  color?: string;
  altitude?: number;
};

type NeonGlobeProps = {
  className?: string;
  markers: GlobeMarker[];
  connections: GlobeConnection[];
};

const GLOBE_RADIUS = 100;
const countries = JSON.parse(countriesRaw) as { features: unknown[] };

function createRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawFlagCardBase(
  ctx: CanvasRenderingContext2D,
  marker: GlobeMarker,
  canvas: HTMLCanvasElement,
) {
  const accent = marker.color ?? "#5bff9a";

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  createRoundedRect(ctx, 8, 8, 240, 128, 28);
  ctx.fillStyle = "rgba(3, 10, 7, 0.92)";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(91, 255, 154, 0.5)";
  ctx.stroke();

  ctx.shadowColor = accent;
  ctx.shadowBlur = 18;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#d7ffe8";
  ctx.font = "600 20px Inter, Segoe UI, sans-serif";
  ctx.fillText(marker.name, canvas.width / 2, 108);
}

function createFlagTexture(marker: GlobeMarker) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 144;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return texture;
  }

  drawFlagCardBase(ctx, marker, canvas);

  const img = new Image();
  img.src = marker.flagImage;

  img.onload = () => {
    drawFlagCardBase(ctx, marker, canvas);
    ctx.shadowBlur = 0;
    ctx.save();
    createRoundedRect(ctx, 82, 24, 92, 54, 12);
    ctx.clip();
    ctx.drawImage(img, 82, 24, 92, 54);
    ctx.restore();
    texture.needsUpdate = true;
  };

  img.onerror = () => {
    drawFlagCardBase(ctx, marker, canvas);
    ctx.fillStyle = "#f4fff8";
    ctx.font = "700 16px Inter, Segoe UI, sans-serif";
    ctx.fillText("FLAG", canvas.width / 2, 52);
    texture.needsUpdate = true;
  };

  texture.needsUpdate = true;
  return texture;
}

function createFlagObject(marker: GlobeMarker) {
  const root = new THREE.Group();

  const accent = marker.color ?? "#5bff9a";
  const texture = createFlagTexture(marker);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 10, 12),
    new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.75,
    }),
  );
  stem.position.y = 5;

  const flare = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 18, 18),
    new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.95,
    }),
  );

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 18, 18),
    new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
    }),
  );

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  sprite.position.y = 13;
  sprite.scale.set(13, 7.3, 1);

  root.add(stem, flare, halo, sprite);
  return root;
}

function createStars(count: number, distance: number) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const radius = distance * (0.85 + Math.random() * 0.45);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.cos(phi);
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  return positions;
}

function GlobeObject({ globe }: { globe: ThreeGlobe }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    globe.setPointOfView(camera);
  });

  return (
    <group ref={groupRef} scale={0.62}>
      <primitive object={globe} />

      <mesh scale={1.12}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#3dff88"
          side={THREE.BackSide}
          transparent
          opacity={0.04}
        />
      </mesh>
    </group>
  );
}

function Scene({ globe, stars }: { globe: ThreeGlobe; stars: Float32Array }) {
  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(stars, 3));
    return geometry;
  }, [stars]);

  return (
    <>
      <color attach="background" args={["#020604"]} />

      <fog attach="fog" args={["#020604", 210, 480]} />

      <ambientLight color="#7dffd0" intensity={0.6} />
      <directionalLight
        color="#b5ffd6"
        intensity={1.4}
        position={[120, 80, 160]}
      />
      <pointLight
        color="#3dff88"
        intensity={1400}
        distance={500}
        position={[0, 20, 180]}
      />
      <pointLight
        color="#89ffba"
        intensity={950}
        distance={420}
        position={[-160, -40, -140]}
      />

      <points geometry={starGeometry}>
        <pointsMaterial
          color="#7effb6"
          size={1.35}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </points>

      <GlobeObject globe={globe} />

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={175}
        maxDistance={360}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.78}
        rotateSpeed={0.55}
        zoomSpeed={0.85}
      />
      <PerspectiveCamera makeDefault position={[0, 18, 300]} fov={24} />
    </>
  );
}

export function NeonGlobe({ className, markers, connections }: NeonGlobeProps) {
  const globe = useMemo(
    () =>
      new ThreeGlobe({
        waitForGlobeReady: false,
        animateIn: true,
      }),
    [],
  );

  const stars = useMemo(() => createStars(1100, 420), []);

  useEffect(() => {
    const globeMaterial = globe.globeMaterial() as THREE.MeshPhongMaterial;
    globeMaterial.color = new THREE.Color("#030b07");
    globeMaterial.emissive = new THREE.Color("#05100a");
    globeMaterial.emissiveIntensity = 0.9;
    globeMaterial.shininess = 18;
    globeMaterial.opacity = 0.94;
    globeMaterial.transparent = true;

    globe
      .showAtmosphere(true)
      .atmosphereColor("#4dff95")
      .atmosphereAltitude(0.18)
      .showGraticules(false)
      .globeCurvatureResolution(3)
      .polygonsData((countries as { features: unknown[] }).features)
      .polygonCapColor(() => "rgba(0,0,0,0)")
      .polygonSideColor(() => "rgba(0,0,0,0)")
      .polygonStrokeColor(() => "rgba(97,255,164,0.34)")
      .polygonAltitude(0.004)
      .polygonsTransitionDuration(0)
      .pointsData(markers)
      .pointLat("lat")
      .pointLng("lng")
      .pointColor((marker: GlobeMarker) => marker.color ?? "#5bff9a")
      .pointAltitude(0.012)
      .pointRadius(0.34)
      .pointsMerge(true)
      .pointsTransitionDuration(0)
      .arcsData(connections)
      .arcStartLat((connection: GlobeConnection) => connection.start.lat)
      .arcStartLng((connection: GlobeConnection) => connection.start.lng)
      .arcEndLat((connection: GlobeConnection) => connection.end.lat)
      .arcEndLng((connection: GlobeConnection) => connection.end.lng)
      .arcColor((connection: GlobeConnection) => [
        connection.color ?? "#89ffb8",
        "#effff5",
        connection.color ?? "#89ffb8",
      ])
      .arcAltitude((connection: GlobeConnection) => connection.altitude ?? 0.24)
      .arcStroke(0.34)
      .arcCurveResolution(72)
      .arcCircularResolution(12)
      .arcDashLength(0.34)
      .arcDashGap(1.1)
      .arcDashAnimateTime(2200)
      .arcsTransitionDuration(0)
      .objectsData(markers)
      .objectLat("lat")
      .objectLng("lng")
      .objectAltitude((marker: GlobeMarker) => marker.altitude ?? 0.01)
      .objectFacesSurface(true)
      .objectThreeObject((marker: GlobeMarker) => createFlagObject(marker));
  }, [connections, globe, markers]);

  return (
    <div
      className={[
        "relative overflow-hidden",
        "bg-[radial-gradient(circle_at_top,_rgba(32,90,55,0.28),_transparent_36%),linear-gradient(180deg,_#04110a_0%,_#020604_55%,_#010302_100%)]",
        className ?? "",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(118,255,181,0.2),_transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,_rgba(49,255,146,0.14),_transparent_34%)]" />

      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Scene globe={globe} stars={stars} />
      </Canvas>
    </div>
  );
}
