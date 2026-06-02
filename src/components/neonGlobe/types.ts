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

export type GlobePoint = {
  lat: number;
  lng: number;
  color: string;
  altitude: number;
  radius: number;
};
