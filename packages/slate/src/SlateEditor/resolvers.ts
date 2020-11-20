import { resolvers as elementResolvers } from './Nodes';
import { SlateEditor } from './SlateEditor';

export const resolvers = {
  SlateEditor,
  ...elementResolvers,
};
