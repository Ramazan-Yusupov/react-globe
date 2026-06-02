import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import { GLOBE_RADIUS } from "./neonGlobe/data";
import { createStars } from "./neonGlobe/renderers";
import type { GlobeConnection, GlobeMarker } from "./neonGlobe/types";
import { useGlobeConfig } from "./neonGlobe/useGlobeConfig";

type NeonGlobeProps = {
  className?: string;
  markers: GlobeMarker[];
  connections: GlobeConnection[];
};

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

      <ambientLight color="#cfe6ff" intensity={1} />
      <directionalLight
        color="#fff4d6"
        intensity={3.2}
        position={[160, 120, 220]}
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
  const { globe } = useGlobeConfig(markers, connections);
  const stars = useMemo(() => createStars(1100, 420), []);

  return (
    <div className={["relative overflow-hidden", className ?? ""].join(" ")}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 " />
      <div className="pointer-events-none absolute inset-0 " />

      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Scene globe={globe} stars={stars} />
      </Canvas>
    </div>
  );
}

export type { GlobeConnection, GlobeMarker } from "./neonGlobe/types";
