/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useSetAtom } from "jotai";
import "mapbox-gl/dist/mapbox-gl.css";

import { useCallback } from "react";
import { Layer, Map as ReactMapGl, Source } from "react-map-gl";
import { loggingAtom } from "../common/atoms";
import constants from "../common/constants";
import { ConfigType } from "../common/types";

const Map = ({ mapStyle, PBF_Url, fromCache }: ConfigType) => {
  const setLogs = useSetAtom(loggingAtom);

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
          if (resourceTiming?.name?.includes(PBF_Url.split("@EPSG")[0])) {
            const { x, y, z } = e.tile.tileID.canonical;
            setLogs((prevL) => {
              const id = `${z}/${x}/${y}`;
              return [{ id, time: resourceTiming.duration }, ...prevL];
            });
          }
        }
      }}
    >
      <Source
        type="vector"
        tiles={[`${PBF_Url}?data_from_cache=${fromCache ? "1" : "0"}`]}
        id={constants.sourceId}
      >
        <Layer
          type="circle"
          id={constants.layerId}
          source-layer={constants.sourceLayer}
        />
      </Source>
    </ReactMapGl>
  );
};

export default Map;
