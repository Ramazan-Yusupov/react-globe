import * as THREE from "three";
import type { GlobeMarker } from "./types";

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
  createRoundedRect(ctx, 38, 28, 210, 102, 14);
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
}

export function createFlagTexture(marker: GlobeMarker) {
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
    createRoundedRect(ctx, 92, 47, 102, 64, 12);
    ctx.clip();
    ctx.drawImage(img, 92, 47, 102, 64);
    ctx.restore();
    texture.needsUpdate = true;
  };

  img.onerror = () => {
    drawFlagCardBase(ctx, marker, canvas);
    ctx.fillStyle = "#f4fff8";
    ctx.font = "700 16px Inter, Segoe UI, sans-serif";
    ctx.fillText("FLAG", canvas.width / 2, 64);
    texture.needsUpdate = true;
  };

  texture.needsUpdate = true;
  return texture;
}

export function createFlagObject(marker: GlobeMarker) {
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

export function createStars(count: number, distance: number) {
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
