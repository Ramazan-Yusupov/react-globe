declare module "three-globe" {
  import * as THREE from "three";

  export default class ThreeGlobe extends THREE.Object3D {
    constructor(config?: { waitForGlobeReady?: boolean; animateIn?: boolean });

    globeMaterial(): THREE.Material;
    showAtmosphere(value: boolean): this;
    atmosphereColor(value: string): this;
    atmosphereAltitude(value: number): this;
    showGraticules(value: boolean): this;
    globeCurvatureResolution(value: number): this;
    polygonsData(value: unknown[]): this;
    polygonCapColor(value: unknown): this;
    polygonSideColor(value: unknown): this;
    polygonStrokeColor(value: unknown): this;
    polygonAltitude(value: number): this;
    polygonsTransitionDuration(value: number): this;

    pointsData(value: unknown[]): this;
    pointLat(value: unknown): this;
    pointLng(value: unknown): this;
    pointColor(value: unknown): this;
    pointAltitude(value: unknown): this;
    pointRadius(value: unknown): this;
    pointsMerge(value: boolean): this;
    pointsTransitionDuration(value: number): this;

    arcsData(value: unknown[]): this;
    arcStartLat(value: unknown): this;
    arcStartLng(value: unknown): this;
    arcEndLat(value: unknown): this;
    arcEndLng(value: unknown): this;
    arcColor(value: unknown): this;
    arcAltitude(value: unknown): this;
    arcStroke(value: number): this;
    arcCurveResolution(value: number): this;
    arcCircularResolution(value: number): this;
    arcDashLength(value: number): this;
    arcDashGap(value: number): this;
    arcDashAnimateTime(value: number): this;
    arcsTransitionDuration(value: number): this;

    ringsData(value: unknown[]): this;
    ringLat(value: unknown): this;
    ringLng(value: unknown): this;
    ringColor(value: unknown): this;
    ringMaxRadius(value: number): this;
    ringPropagationSpeed(value: number): this;
    ringRepeatPeriod(value: number): this;

    objectsData(value: unknown[]): this;
    objectLat(value: unknown): this;
    objectLng(value: unknown): this;
    objectAltitude(value: unknown): this;
    objectFacesSurface(value: boolean): this;
    objectThreeObject(value: unknown): this;

    setPointOfView(camera: THREE.Camera): this;
    getGlobeRadius(): number;
  }
}

declare module "*.geojson" {
  const value: {
    type: string;
    features: unknown[];
  };

  export default value;
}

declare module "*.geojson?raw" {
  const value: string;

  export default value;
}
