import { createContext } from "react";
import { useConnectorHooks } from "@craftjs/utils";

export type EventContext = useConnectorHooks<
  "select" | "drag" | "drop" | "hover" | "create"
>;
export const EventContext = createContext<any>(null);
