import React from "react";
import { DOMInfo, Node } from "~types";
import Root from "../Root";
import { PlaceholderInfo } from "~types/events";


export interface NodeEvent {
  node: Node,
  info: DOMInfo
}

export interface EventProperties {
  active: NodeEvent,
  dragging: NodeEvent,
  hover: NodeEvent,
}


export interface PublicEventMethods {
  setActive: Function
}

export interface RootEventMethods extends PublicEventMethods {
  setNodeEvent: Function
}


export interface RootEventContext extends EventProperties {
  nodesInfo: any,
  placeholder: PlaceholderInfo
  methods: RootEventMethods
}

export interface PublicEventContext extends EventProperties {
  methods: PublicEventMethods
}


export type EventContext<T extends RootEventContext | PublicEventContext> = T;

export const EventContext = React.createContext<EventContext<RootEventContext>>({
  nodesInfo: undefined,
  active: undefined,
  dragging: undefined,
  hover: undefined,
  placeholder: undefined,
  methods: {
    setActive: null,
    setNodeEvent: null
  }
});

