/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useSetAtom } from "jotai";
import "mapbox-gl/dist/mapbox-gl.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircleLayer,
  Layer,
  Map as ReactMapGl,
  Source,
  SourceProps,
} from "react-map-gl";
import { loggingAtom } from "../common/atoms";
import constants from "../common/constants";
import { ConfigType, TileStyles } from "../common/types";


const Map = ({
  mapStyle,
  tileStyle,
  fromCache,
  serviceIDRef,
}: ConfigType & { serviceIDRef: React.MutableRefObject<string> }) => {
  const [sourceProps, setSourceProps] = useState<SourceProps>();
  const [circleLayer, setCircleLayer] = useState<Omit<CircleLayer, "id">>();

  const setLogs = useSetAtom(loggingAtom);

  const baseUrl = useMemo(
    () => tileStyle.split("mym/styles")[0] as string,
    [tileStyle]
  );

  useEffect(() => {
    if (tileStyle === "") return;

    const fetchTileStyles = async () => {
      const res = await fetch(tileStyle, {
        headers: {
          "x-api-key": constants.headers["x-api-key"],
        },
      });
      const data = (await res.json()) as TileStyles;

      const sources = Object.entries(data.sources).map(([id, { tiles }]) => ({
        id,
        tiles,
      }));

      const tiles = sources[0].tiles;

      if (!tiles) return console.error("NO TILE URL");

      const tileUrl = tiles[0];

      serviceIDRef.current = tileUrl.split("tile/layers/")[1].split("@EPSG")[0];

      const tileUrlParts = tileUrl.split("tile/layers");

      const tileUrlPathPart = tileUrlParts[1];

      const finalTileUrl = `${baseUrl}/tile/layers${tileUrlPathPart}${
        fromCache ? "?data_from_cache=true" : ""
      }`;

      setSourceProps({ type: "vector", tiles: [finalTileUrl] });

      setCircleLayer({
        source: "nak-source",
        "source-layer": data.layers[0]["source-layer"],
        type: "circle",
        paint: constants.styles.CIRLCE_LAYER_PAINT,
      });
    };

    fetchTileStyles();
  }, [baseUrl, fromCache, serviceIDRef, tileStyle]);

  const transformRequest = useCallback((url: string) => {
    return {
      url,
      headers: {
        "x-api-key": constants.headers["x-api-key"],
      },
    };
  }, []);

  return (
    <ReactMapGl
      id="mainMap"
      initialViewState={{
        longitude: 51.414178828767945,
        latitude: 35.68490079732125,
        zoom: 11,
      }}
      onLoad={(e) => {
        console.log(`map: `, e.target);
        e.target.showTileBoundaries = true;
      }}
      mapStyle={mapStyle}
      style={{
        flexGrow: 1,
        width: "100%",
        height: "100%",
      }}
      transformRequest={transformRequest}
      hash
      collectResourceTiming
      onData={(e) => {
        if (e.dataType === "source" && e.tile) {
          const resourceTiming = e.tile.resourceTiming?.[0];
          if (resourceTiming?.name?.includes(baseUrl)) {
            const { x, y, z } = e.tile.tileID.canonical;
            setLogs((prevL) => {
              const id = `${z}/${x}/${y}`;
              return [{ id, time: resourceTiming.duration }, ...prevL];
            });
          }
        }
      }}
    >
      {sourceProps && (
        <Source id="nak-source" {...sourceProps}>
          {circleLayer && <Layer id="nak-layer" {...circleLayer} />}
        </Source>
      )}
    </ReactMapGl>
  );
};

export default Map;
