import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useState } from "react";
import {
  CircleLayer,
  Layer,
  Map,
  MapProvider,
  Source,
  SourceProps,
  useMap,
} from "react-map-gl";
import { useImmer } from "use-immer";
import constants from "./constants";
import { TileStyles } from "./types";

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
  const [layerID, setLayerID] = useState<string>();
  const { mainMap } = useMap();

  useEffect(() => {
    console.log({ config });
  }, [config]);

  const dumpToConsole = () => {
    if (!layerID) return;
    const featuers = mainMap?.queryRenderedFeatures(undefined, {
      layers: [layerID],
    });
    console.log("🚀 dumping rendered features:", featuers);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="">
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
      {config.tileStyle && <OptimizedMap setLayerID={setLayerID} {...config} />}
    </div>
  );
}

const OptimizedMap = ({
  mapStyle,
  tileStyle,
  fromCache,
  setLayerID,
}: ConfigType & {
  setLayerID: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const [sourceProps, setSourceProps] = useState<SourceProps>();
  const [circleLayer, setCircleLayer] = useState<CircleLayer>();

  useEffect(() => {
    if (tileStyle === "") return;

    const fetchTileStyles = async () => {
      const res = await fetch(tileStyle, {
        headers: {
          "x-api-key": constants.headers["x-api-key"],
        },
      });
      const data = (await res.json()) as TileStyles;
      Object.entries(data.sources).map(([id, srcDef]) => {
        const url = srcDef.tiles?.[0];
        if (!url) {
          console.error("NO TILE URL");
          return;
        }
        const parts = url.split("tile/layers");
        const baseUrl = tileStyle.split("mym/styles")[0] as string;
        const tileUrl = `${baseUrl}/tile/layers${parts[1]}${
          fromCache ? "?data_from_cache=true" : ""
        }`;
        setSourceProps({ id, type: "vector", tiles: [tileUrl] });
      });

      const { id, source, "source-layer": sourceLayer } = data.layers[0];
      setLayerID(id);
      setCircleLayer({
        id,
        source,
        "source-layer": sourceLayer,
        type: "circle",
        paint: {
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "rxlevel"],
            -100,
            "#7FFF00",
            -75,
            "#DC143C",
            -50,
            "#008b74",
            -25,
            "#ff009d",
            -0,
            "#00eeff",
            100,
            "red",
          ],
        },
      });
    };

    fetchTileStyles();
  }, [fromCache, setLayerID, tileStyle]);


  const transformRequest = useCallback(
    (url: string) => {
      return {
        url,
        headers: {
          "x-api-key": constants.headers["x-api-key"],
        },
      };
    },
    []
  );

  return (
    <Map
      id="mainMap"
      initialViewState={{
        longitude: 51.414178828767945,
        latitude: 35.68490079732125,
        zoom: 11,
      }}
      onLoad={(e) => console.log(e)}
      mapStyle={mapStyle}
      style={{
        flexGrow: 1,
        width: "100%",
        height: "100%",
      }}
      transformRequest={transformRequest}
      hash
    >
      {sourceProps && (
        <Source {...sourceProps}>
          <Layer {...circleLayer} />
        </Source>
      )}
    </Map>
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
