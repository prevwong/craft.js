import { useReduxMethods, SubscriberAndCallbacksFor } from "@craftjs/utils";
import { EditorEvents, Options } from "../interfaces";
import Actions from "./actions";
import { QueryMethods } from "./query";

export type EditorStore = SubscriberAndCallbacksFor<typeof Actions>

export const useEditorStore = (
  nodes = {}, 
  events: EditorEvents = {
    selected: null, 
    dragged: null, 
    hovered:null, 
    indicator:null
  },
  options: Partial<Options> = {}
): EditorStore => {

  return useReduxMethods(
    Actions,
    {
      nodes,
      events,
      options,
    },
    QueryMethods
  );
}
