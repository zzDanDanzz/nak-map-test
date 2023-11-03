import { useAtom } from "jotai";
import { loggingAtom } from "../atoms";
import { PropsWithChildren, memo } from "react";

function _Logger() {
  const [logs, setLogs] = useAtom(loggingAtom);
  return (
    <div className="grow p-3 border-solid rounded-lg border-neutral-300 border m-1.5 flex flex-col gap-2">
      <div className="flex justify-between">
        <h2 className="text-lg">download logs: </h2>
        <button onClick={() => setLogs([])}>clear</button>
      </div>
      {logs.map((l, i) => (
        <div key={i} className="flex flex-col">
          <div>
            <Brackets>z</Brackets>/<Brackets>y</Brackets>/<Brackets>x</Brackets>
          </div>
          <div>{l.id}</div>
          <span>{Math.round(l.time)} ms</span>
          <div className="h-0.5 bg-neutral-300" />
        </div>
      ))}
    </div>
  );
}

function Brackets({ children }: PropsWithChildren) {
  return `{${children}}`;
}

const Logger = memo(_Logger);

export default Logger