/* eslint-disable @typescript-eslint/no-explicit-any */
import "mapbox-gl/dist/mapbox-gl.css";
import { MapProvider, useMap } from "react-map-gl";
import { useImmer } from "use-immer";
import { ConfigType } from "./common/types";
import ConfigForm from "./components/config-form";
import Logger from "./components/logger";
import Map from "./components/map";
import constants from "./common/constants";

const defaults: ConfigType = {
  mapStyle: "https://dev.map.ir/vector/styles/main/mapir-xyz-light-style.json",
  PBF_Url: "",
  fromCache: false,
};

function App() {
  const [config, setConfig] = useImmer(defaults);
  const { mainMap } = useMap();

  const renderedFeaturedToConsole = () => {
    const featuers = mainMap?.queryRenderedFeatures(undefined, {
      layers: [constants.layerId],
    });
    console.log("🟡 RENDERED features:", featuers);
  };

  const sourceFeaturesToDumpToConsole = () => {
    const featuers = mainMap?.querySourceFeatures(constants.sourceId, {
      sourceLayer: constants.sourceLayer,
    });
    console.log("🔵 SOURCES features:", featuers);
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col h-full grow">
        <div>
          <ConfigForm config={config} setConfig={setConfig} />
          <button onClick={renderedFeaturedToConsole}>
            queryRenderedFeatures
          </button>
          <button onClick={sourceFeaturesToDumpToConsole}>
            querySourceFeatures
          </button>
          <span className="text-neutral-500">(check console)</span>
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
