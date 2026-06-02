import countriesRaw from "../../../node_modules/three-globe/example/country-polygons/ne_110m_admin_0_countries.geojson?raw";
export const GLOBE_RADIUS = 100;

export const countries = JSON.parse(countriesRaw) as { features: unknown[] };
