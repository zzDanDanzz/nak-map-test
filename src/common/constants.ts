import { CirclePaint } from "mapbox-gl";

const constants = {
  headers: {
    "x-api-key":
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjdhNjhmNTI5NWJlNTk2NTAxZWM0NjMwYjI0Y2EzNjU0M2ZhMTZmYWFiNmM5OThkNGEzOWZkMDllMjQ2OTY1OTQyYmYxYTc1NTcxOGM0MGRjIn0.eyJhdWQiOiIxNDYiLCJqdGkiOiI3YTY4ZjUyOTViZTU5NjUwMWVjNDYzMGIyNGNhMzY1NDNmYTE2ZmFhYjZjOTk4ZDRhMzlmZDA5ZTI0Njk2NTk0MmJmMWE3NTU3MThjNDBkYyIsImlhdCI6MTU5ODkzOTg0MCwibmJmIjoxNTk4OTM5ODQwLCJleHAiOjE2MDE2MjE4NDAsInN1YiI6IiIsInNjb3BlcyI6WyJiYXNpYyJdfQ.Qyhr8Ruo6IBvs3jR2GH_b1yq_Q5L60UyziISfgbfkmN7TEG6Jj_9n06j0ChpeXv2HAgmBR2qnyClcuVVZgnssFHnOJ0lC_jRieJrzRtASBgC-6ekOK-82kNXm7CGlRiBujV5TegHweyU7iYv_Y_MA4Oy_SjUfBoVHvpAIawxtgnPnpC-u49vVa-nCCDrO-hr72H1K8yxT-SaFUVP61kz5QR9KCSIxihD0Wac3MlBmiG9nW4TAb120UGb603LkKD-4xRM-ywofbQttWGeF6w8X3XrTT4jqxaIfN4fmlaC7e049kEgcMjKOyiTMcn5KO7_hTAcYneKX8STkox-2X0I-g",
  },
  styles: {
    CIRLCE_LAYER_PAINT: {
      "circle-color": [
        "case",
        ["has", "rxlevel"],
        [
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
        "black",
      ],
    } as CirclePaint,
  },

  sourceLayer: "default",
  sourceId: 'nak-source',
  layerId: "nak-layer",
};

export default constants;
