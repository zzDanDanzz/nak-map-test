import { AnyPaint } from "mapbox-gl";
import { VectorTileSource } from "react-map-gl";

export interface TileStyles {
  sources: Sources;
  layers: ILayer[];
}

type Sources = Record<string, VectorTileSource>;

interface ILayer {
  id: string;
  source: string;
  "source-layer": string;
  type: string;
  paint: AnyPaint;
}

export type ConfigType = {
  mapStyle: string;
  tileStyle: string;
  fromCache: boolean;
};


