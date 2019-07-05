import { useContext, useMemo } from "react";
import { RenderContext } from "./RenderContext";

export const useRenderer = () => {
    const render = useContext(RenderContext);
    return useMemo(() => (render), [render]);
}