import { Updater } from "use-immer";
import { ConfigType } from "../common/types";

function ConfigForm({
  setConfig,
  config,
}: {
  config: ConfigType;
  setConfig: Updater<ConfigType>;
}) {
  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend>Config</legend>

      <div className="flex gap-2 basis-1/3">
        <label htmlFor="mapStyle">map style url:</label>
        <input
          className="flex-grow"
          type="text"
          id="mapStyle"
          value={config.mapStyle}
          onChange={(e) =>
            setConfig((c) => {
              c.mapStyle = e.target.value;
            })
          }
        />
      </div>

      <div className="flex gap-2 basis-1/3">
        <label htmlFor="PBF_Url">pbf url:</label>
        <input
          className="flex-grow"
          type="text"
          id="PBF_Url"
          value={config.PBF_Url}
          onChange={(e) =>
            setConfig((c) => {
              c.PBF_Url = e.target.value;
            })
          }
        />
      </div>

      <div>
        <input
          type="checkbox"
          id="fromCache"
          checked={config.fromCache}
          onChange={(e) =>
            setConfig((c) => {
              c.fromCache = e.target.checked;
            })
          }
        />
        <label htmlFor="fromCache">
          data_from_cache (checked = 1; unchecked = 0)
        </label>
      </div>
    </fieldset>
  );
}

export default ConfigForm;
