import "mapbox-gl/dist/mapbox-gl.css";
import Map from "./components/map";
import { MapProvider, useMap } from "react-map-gl";
import { useImmer } from "use-immer";
import ConfigForm from "./components/config-form";
import Logger from "./components/logger";
import { ConfigType } from "./common/types";

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
          <ConfigForm config={config} setConfig={setConfig} />
          <button onClick={dumpToConsole}>queryRenderedFeatures</button>{" "}
          <span className="text-neutral-500">
            (dump layer's rendered features to console)
          </span>
        </div>
        {config.tileStyle && <Map {...config} />}
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
