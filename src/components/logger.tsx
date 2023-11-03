import { useAtom } from "jotai";
import { memo } from "react";
import { loggingAtom } from "../common/atoms";

const colors = ["text-red-600", "text-green-600", "text-blue-600"];

function _Logger() {
  const [logs, setLogs] = useAtom(loggingAtom);
  return (
    <div className="grow p-3 border-solid rounded-lg border-neutral-300 border m-1.5 flex flex-col gap-2 overflow-y-auto">
      <div className="flex justify-between">
        <h2 className="text-lg">Logs: </h2>
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
