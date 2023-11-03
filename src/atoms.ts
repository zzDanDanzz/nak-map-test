import { atom } from "jotai";

export const loggingAtom = atom<{ time: number, id: string }[]>([])