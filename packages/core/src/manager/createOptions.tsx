import { Options } from "../interfaces";
import { defaultPlaceholder } from "../render/RenderPlaceholder";

export const createOptions = (data: Partial<Options>) => {
  return {
    onRender: ({ render }) => render,
    resolver: {},
    renderPlaceholder: defaultPlaceholder,
    nodes: null,
    enabled: true,
    ...data
  } as Options;
}