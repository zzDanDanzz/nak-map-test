import { AnyPaint } from "mapbox-gl";
import { SourceProps } from "react-map-gl";

export interface TileStyles {
  sources: Sources;
  layers: ILayer[];
}

type Sources = Record<string, SourceProps>;

interface ILayer {
  id: string;
  source: string;
  "source-layer": string;
  type: string;
  paint: AnyPaint;
}