import {
  NeonGlobe,
  type GlobeConnection,
  type GlobeMarker,
} from "./components/NeonGlobe";

const markers: GlobeMarker[] = [
  {
    id: "ru",
    name: "Россия",
    lat: 55.7558,
    lng: 37.6173,
    flagImage: "/flags/ru.svg",
    altitude: 0.085,
  },
  {
    id: "us",
    name: "США",
    lat: 40.7128,
    lng: -74.006,
    flagImage: "/flags/us.svg",
  },
  {
    id: "kz",
    name: "Казахстан",
    lat: 43.2389,
    lng: 76.8897,
    flagImage: "/flags/kz.svg",
  },
  {
    id: "sg",
    name: "Сингапур",
    lat: 1.3521,
    lng: 103.8198,
    flagImage: "/flags/sg.svg",
  },
  {
    id: "jp",
    name: "Япония",
    lat: 35.6764,
    lng: 139.65,
    flagImage: "/flags/jp.svg",
  },
];

const connections: GlobeConnection[] = [
  {
    id: "ru-kz",
    start: { lat: 55.7558, lng: 37.6173 },
    end: { lat: 43.2389, lng: 76.8897 },
    altitude: 0.2,
  },
  {
    id: "ru-sg",
    start: { lat: 55.7558, lng: 37.6173 },
    end: { lat: 1.3521, lng: 103.8198 },
    altitude: 0.28,
  },
  {
    id: "ru-jp",
    start: { lat: 55.7558, lng: 37.6173 },
    end: { lat: 35.6764, lng: 139.65 },
    altitude: 0.24,
  },
  {
    id: "ru-us",
    start: { lat: 55.7558, lng: 37.6173 },
    end: { lat: 40.7128, lng: -74.006 },
    altitude: 0.32,
  },
];

export function App() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#010302] text-white">
      <NeonGlobe
        className="h-full w-full"
        markers={markers}
        connections={connections}
      />
    </main>
  );
}
