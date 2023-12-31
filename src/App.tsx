/* eslint-disable @typescript-eslint/no-explicit-any */
import "mapbox-gl/dist/mapbox-gl.css";
import { MapProvider, useMap } from "react-map-gl";
import { useImmer } from "use-immer";
import { ConfigType } from "./common/types";
import ConfigForm from "./components/config-form";
import Logger from "./components/logger";
import Map from "./components/map";

const defaults: ConfigType = {
  mapStyle: "https://dev.map.ir/vector/styles/main/mapir-xyz-light-style.json",
  PBF_Url: "",
  sourceLayer: "",
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

  // const fitBoundsToBbox = async () => {
  //   const baseUrl = config.tileStyle.split("mym/styles")[0];
  //   const url = `${baseUrl}mym/tiles/${serviceIDRef.current}`;

  //   const _res = await fetch(url, {
  //     method: "GET",
  //     headers: {
  //       ["x-api-key"]: constants.headers["x-api-key"],
  //     },
  //   });

  //   const res = await _res.json();

  //   const polygon = res.data.meta.datasource.bbox;
  //   !polygon && console.warn(`no data.meta.datasource.bbox found.`);

  //   const bbox = getBbox(polygon);

  //   mainMap?.fitBounds(bbox, { padding: 75 });
  // };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col h-full basis-10/12">
        <div>
          <ConfigForm config={config} setConfig={setConfig} />
          <button onClick={dumpToConsole}>queryRenderedFeatures</button>{" "}
          <span className="text-neutral-500">
            (dump layer's rendered features to console)
          </span>
          {/* <button
            onClick={() => {
              fitBoundsToBbox().catch((err) => {
                console.warn("Failed at fitBoundsToBbox");
                console.error(err);
              });
            }}
          >
            fitBounds to bbox
          </button>{" "} */}
        </div>
        {config.PBF_Url && <Map {...config} />}
      </div>
      <Logger />
    </div>
  );
}

const AppWithProviders = () => {
  return (
    <MapProvider>
      <App />
    </MapProvider>
  );
};

export default AppWithProviders;
