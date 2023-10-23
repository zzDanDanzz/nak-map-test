import "mapbox-gl/dist/mapbox-gl.css";
import { FormEvent, useEffect, useMemo, useState } from "react";
import constants from "./constants";
import {
  CircleLayer,
  Layer,
  Map,
  MapProvider,
  Source,
  SourceProps,
  useMap,
} from "react-map-gl";
import { TileStyles } from "./types";

type ConfigType = {
  mapStyle: "https://dev.map.ir/vector/styles/main/mapir-xyz-light-style.json";
  tileStyle: "";
  fromCache: false;
};

const defaults: ConfigType = {
  mapStyle: "https://dev.map.ir/vector/styles/main/mapir-xyz-light-style.json",
  tileStyle: "",
  fromCache: false,
};

function App() {
  const [config, setConfig] = useState(defaults);
  const [layerID, setLayerID] = useState<string>();
  const { mainMap } = useMap();

  function onSubmit(
    e: FormEvent & { target: FormEvent["target"] & { elements?: unknown } }
  ) {
    e.preventDefault();
    const {
      mapStyle: { value: mapStyle },
      tileStyle: { value: tileStyle },
      fromCache: { checked: fromCache },
    } = e.target.elements as never;

    const newConfig = { mapStyle, tileStyle, fromCache };

    setConfig(newConfig);
  }

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
        <form onSubmit={onSubmit}>
          <fieldset className="flex flex-wrap gap-2">
            <legend>Config</legend>
            <div className="flex gap-2 basis-1/3">
              <label htmlFor="mapStyle">map style url:</label>
              <input
                className="flex-grow"
                type="text"
                name="mapStyle"
                defaultValue={defaults.mapStyle}
              />
            </div>

            <div className="flex gap-2 basis-1/3">
              <label htmlFor="tileStyle">tile style url:</label>
              <input
                className="flex-grow"
                type="text"
                name="tileStyle"
                defaultValue={defaults.tileStyle}
              />
            </div>
            <input type="submit" value="Submit" />

            <input
              type="checkbox"
              name="fromCache"
              defaultChecked={defaults.fromCache}
            />
            <label htmlFor="fromCache">with ?data_from_cache=true</label>
          </fieldset>
        </form>
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
        setSourceProps({ id, ...srcDef });
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
  }, [setLayerID, tileStyle]);

  const viewPublicBase = useMemo(() => {
    const baseUrl = tileStyle.split("mym/styles")[0] as string;
    return baseUrl;
  }, [tileStyle]);

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
      transformRequest={(url) => {
        if (url.includes("tile/layers")) {
          const parts = url.split("tile/layers");
          url = `${viewPublicBase}/tile/layers${parts[1]}${
            fromCache ? "?data_from_cache=true" : ""
          }`;
        }
        return {
          url,
          method: "GET",
          headers: {
            "x-api-key": constants.headers["x-api-key"],
          },
        };
      }}
      hash
    >
      {sourceProps && viewPublicBase && (
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
