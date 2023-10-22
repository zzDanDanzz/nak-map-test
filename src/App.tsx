import "mapbox-gl/dist/mapbox-gl.css";
import { FormEvent, useEffect, useState } from "react";
import constants from "./constants";
import { CircleLayer, Layer, Map, Source, SourceProps } from "react-map-gl";

const defaults = {
  mapStyle: "https://dev.map.ir/vector/styles/main/mapir-xyz-light-style.json",
  tileStyle: "",
  viewPublicBase: "",
};

function App() {
  const [config, setConfig] = useState(defaults);

  function onSubmit(
    e: FormEvent & { target: FormEvent["target"] & { elements?: unknown } }
  ) {
    e.preventDefault();
    const {
      mapStyle: { value: mapStyle },
      tileStyle: { value: tileStyle },
      viewPublicBase: { value: viewPublicBase },
    } = e.target.elements as never;

    setConfig({ mapStyle, tileStyle, viewPublicBase });
  }

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
            <div className="flex gap-2 basis-1/3">
              <label htmlFor="viewPublicBase">view public base url:</label>
              <input
                className="flex-grow"
                type="text"
                name="viewPublicBase"
                defaultValue={defaults.viewPublicBase}
              />
            </div>

            <input type="submit" value="Submit" />
          </fieldset>
        </form>
      </div>
      {config.viewPublicBase && (
        <OptimizedMap
          mapStyle={config.mapStyle}
          tileStyle={config.tileStyle}
          viewPublicBase={config.viewPublicBase}
        />
      )}
    </div>
  );
}

const OptimizedMap = ({
  mapStyle,
  tileStyle,
  viewPublicBase,
}: {
  mapStyle: string;
  tileStyle: string;
  viewPublicBase: string;
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

      const layer = data.layers[0];

      setCircleLayer({
        id: layer.id,
        source: layer.source,
        "source-layer": layer["source-layer"],
        type: "circle",
      });
    };

    fetchTileStyles();
  }, [tileStyle]);

  return (
    <Map
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
          url = `${viewPublicBase}/tile/layers${parts[1]}`;
        }
        return {
          url,
          method: "GET",
          headers: {
            "x-api-key": constants.headers["x-api-key"],
          },
        };
      }}
    >
      {sourceProps && viewPublicBase && (
        <Source {...sourceProps}>
          <Layer {...circleLayer} />
        </Source>
      )}
    </Map>
  );
};

export default App;

interface TileStyles {
  sources: Sources;
  layers: ILayer[];
}

interface Sources {
  mym_709aa156c2c5c376a1e5eed14b782f68_7: Mym;
}

interface Mym {
  type: string;
  tiles: string[];
}

interface ILayer {
  id: string;
  source: string;
  "source-layer": string;
  type: string;
  paint: Paint;
}

interface Paint {
  "circle-stroke-color": string;
  "circle-stroke-width": number;
  "circle-color": string;
  "circle-opacity": number;
}
