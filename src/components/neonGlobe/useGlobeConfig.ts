import { useEffect, useMemo } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import { CITY_LIGHTS, countries } from "./data";
import { createFlagObject } from "./renderers";
import type { GlobeConnection, GlobeMarker, GlobePoint } from "./types";

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

  const globePoints = useMemo<GlobePoint[]>(
    () => [
      ...CITY_LIGHTS,
      ...markers.map((marker) => ({
        lat: marker.lat,
        lng: marker.lng,
        color: marker.color ?? "#5bff9a",
        altitude: 0.012,
        radius: 0.34,
      })),
    ],
    [markers],
  );

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
      .polygonsData(countries.features)
      .polygonCapColor(() => "rgba(0,0,0,0)")
      .polygonSideColor(() => "rgba(0,0,0,0)")
      .polygonStrokeColor(() => "rgba(97,255,164,0.5)")
      .polygonAltitude(0.004)
      .polygonsTransitionDuration(0)
      .pointsData(globePoints)
      .pointLat("lat")
      .pointLng("lng")
      .pointColor("color")
      .pointAltitude("altitude")
      .pointRadius("radius")
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
      .objectAltitude((marker: GlobeMarker) => marker.altitude ?? 0.055)
      .objectFacesSurface(true)
      .objectThreeObject((marker: GlobeMarker) => createFlagObject(marker));
  }, [connections, globe, globePoints, markers]);

  return { globe };
}
