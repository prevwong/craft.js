import { useMethods, SubscriberAndCallbacksFor } from "@craftjs/utils";
import { Actions } from "./actions";
import { QueryMethods } from "./query";

export type EditorStore = SubscriberAndCallbacksFor<typeof Actions>;

export const useEditorStore = (options): EditorStore => {
  return useMethods(
    Actions,
    {
      nodes: {},
      events: {
        selected: null,
        dragged: null,
        hovered: null,
        indicator: null,
      },
      options,
    },
    QueryMethods
  );
};
