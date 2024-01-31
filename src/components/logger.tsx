import { useAtom } from "jotai";
import { memo, useEffect, useState } from "react";
import { loggingAtom } from "../common/atoms";
import { flushSync } from "react-dom";
import { useMap } from "react-map-gl";

const colors = ["text-red-600", "text-green-600", "text-blue-600"];

function useStickyState(defaultValue: unknown, key: string) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function _Logger() {
  const [logs, setLogs] = useAtom(loggingAtom);
  const [isHidden, setIsHidden] = useStickyState(false, "is-logs-hidden");
  const { mainMap } = useMap();

  if (isHidden) {
    return (
      <button
        onClick={() => {
          flushSync(() => {
            setIsHidden(false);
          });
          mainMap?.resize();
        }}
        style={{
          width: "3rem",
          alignSelf: "baseline",
        }}
      >
        show logs
      </button>
    );
  }

  return (
    <div className="grow p-3 border-solid rounded-lg border-neutral-300 border m-1.5 flex flex-col gap-2 overflow-y-auto max-w-[300px]">
      <div className="flex justify-between">
        <h2 className="text-lg">Logs: </h2>
        <button
          onClick={() => {
            flushSync(() => {
              setIsHidden(true);
            });
            mainMap?.resize();
          }}
        >
          hide
        </button>
        <button onClick={() => setLogs([])}>clear</button>
      </div>
      <div className="flex flex-col">
        <div>
          {`z/y/x`.split("/").map((c, i) => (
            <span key={c} className={`${colors[i]}`}>
              {c}
              {i !== 2 && <span className="text-black font-bold">/</span>}
            </span>
          ))}
        </div>
        <span className="text-sm">Download duration</span>
        <span className="text-neutral-500">(Latest at the top)</span>
      </div>
      {logs.map((l) => (
        <>
          <div className="flex flex-col">
            <div>
              {l.id.split("/").map((c, i) => (
                <span key={c} className={`${colors[i]}`}>
                  {c}
                  {i !== 2 && <span className="text-black font-bold">/</span>}
                </span>
              ))}
            </div>
            <span>duration: {Math.round(l.time)} ms</span>
          </div>
          <div className="h-0.5 bg-neutral-300 shrink-0" />
        </>
      ))}
    </div>
  );
}

const Logger = memo(_Logger);

export default Logger;
