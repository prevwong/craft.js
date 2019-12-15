import { Options } from "../interfaces";

export const createOptions = (data: Partial<Options>) => {
  return {
    onRender: ({ render }) => render,
    resolver: {},
    nodes: null,
    enabled: true,
    indicator: {
      error: "red",
      success: "rgb(98, 196, 98)"
    },
    ...data
  } as Options;
}