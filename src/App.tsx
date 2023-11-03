/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useSetAtom } from "jotai";
import "mapbox-gl/dist/mapbox-gl.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircleLayer,
  Layer,
  MapProvider,
  Map as ReactMapGl,
  Source,
  SourceProps,
  useMap,
} from "react-map-gl";
import { useImmer } from "use-immer";
import { loggingAtom } from "./atoms";
import constants from "./constants";
import { TileStyles } from "./types";
import Logger from "./components/logger";

type ConfigType = {
  mapStyle: string;
  tileStyle: string;
  fromCache: boolean;
};

const defaults: ConfigType = {
  mapStyle: "https://dev.map.ir/vector/styles/main/mapir-xyz-light-style.json",
  tileStyle: "",
  fromCache: false,
};

function App() {
  const [config, setConfig] = useImmer(defaults);
  const { mainMap } = useMap();

  const dumpToConsole = () => {
    const featuers = mainMap?.queryRenderedFeatures(undefined, {
      layers: ["nak-layer"],
    });
    console.log("🚀 dumping rendered features:", featuers);
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col h-full basis-10/12">
        <div>
          <fieldset className="flex flex-wrap gap-2">
            <legend>Config</legend>
            <div className="flex gap-2 basis-1/3">
              <label htmlFor="mapStyle">map style url:</label>
              <input
                className="flex-grow"
                type="text"
                name="mapStyle"
                value={config.mapStyle}
                onChange={(e) =>
                  setConfig((c) => {
                    c.mapStyle = e.target.value;
                  })
                }
              />
            </div>
            <div className="flex gap-2 basis-1/3">
              <label htmlFor="tileStyle">tile style url:</label>
              <input
                className="flex-grow"
                type="text"
                name="tileStyle"
                value={config.tileStyle}
                onChange={(e) =>
                  setConfig((c) => {
                    c.tileStyle = e.target.value;
                  })
                }
              />
            </div>
            <input
              type="checkbox"
              name="fromCache"
              checked={config.fromCache}
              onChange={(e) =>
                setConfig((c) => {
                  c.fromCache = e.target.checked;
                })
              }
            />
            <label htmlFor="fromCache">with ?data_from_cache=true</label>
          </fieldset>
          <button onClick={dumpToConsole}>queryRenderedFeatures</button>
        </div>
        {config.tileStyle && <Map {...config} />}
      </div>
      <Logger />
    </div>
  );
}

const Map = ({ mapStyle, tileStyle, fromCache }: ConfigType) => {
  const [sourceProps, setSourceProps] = useState<SourceProps>();
  const [circleLayer, setCircleLayer] = useState<Omit<CircleLayer, 'id'> >();

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
  }, [baseUrl, fromCache, tileStyle]);

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

            console.log(
              "🚀 ~ file: App.tsx:219 ~ Map ~ resourceTiming:",
              resourceTiming
            );

            setLogs((prevL) => {
              const id = `{${z}}/{${x}}/{${y}}`;
              return [...prevL, { id, time: resourceTiming.duration }];
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

const AppWithProviders = () => {
  return (
    <MapProvider>
      <App />
    </MapProvider>
  );
};

export default AppWithProviders;
