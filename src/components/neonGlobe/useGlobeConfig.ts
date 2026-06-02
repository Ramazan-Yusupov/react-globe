import { useEffect, useMemo } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import { countries } from "./data";
import { createFlagObject } from "./renderers";
import type { GlobeConnection, GlobeMarker } from "./types";

export function useGlobeConfig(
  markers: GlobeMarker[],
  connections: GlobeConnection[],
) {
  const globe = useMemo(
    () =>
      new ThreeGlobe({
        waitForGlobeReady: false,
        animateIn: true,
      }),
    [],
  );

  useEffect(() => {
    const globeMaterial = globe.globeMaterial() as THREE.MeshPhongMaterial;
    globeMaterial.color = new THREE.Color("#1f3142");
    globeMaterial.emissive = new THREE.Color("#1f3142");
    globeMaterial.emissiveIntensity = 0.45;
    globeMaterial.shininess = 18;
    globeMaterial.opacity = 1;
    globeMaterial.transparent = true;

    globe
      .globeImageUrl("/earth-night.jpg")
      .showAtmosphere(true)
      .atmosphereColor("#4dff95")
      .atmosphereAltitude(0.18)
      .showGraticules(false)
      .globeCurvatureResolution(3)
      .polygonsData(countries.features)
      .polygonCapColor(() => "rgba(0,0,0,0)")
      .polygonSideColor(() => "rgba(0,0,0,0)")
      .polygonStrokeColor(() => "rgba(58,140,98,0.22)")
      .polygonAltitude(0.004)
      .polygonsTransitionDuration(0)
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
      .objectAltitude((marker: GlobeMarker) => marker.altitude ?? 0.055)
      .objectFacesSurface(true)
      .objectThreeObject((marker: GlobeMarker) => createFlagObject(marker));
  }, [connections, globe, markers]);

  return { globe };
}
