import { EditorState, NodeId, NodeEventTypes } from '../interfaces';

export function EventHelpers(state: EditorState, eventType: NodeEventTypes) {
  const event = state.events[eventType];
  return {
    contains(id: NodeId) {
      return event.has(id);
    },
    isEmpty() {
      return this.all().length === 0;
    },
    first() {
      const values = this.all();
      return values[0];
    },
    last() {
      const values = this.all();
      return values[values.length - 1];
    },
    all() {
      return Array.from(event);
    },
    size() {
      return this.all().length;
    },
    at(i: number) {
      return this.all()[i];
    },
    raw() {
      return event;
    },
  };
}
