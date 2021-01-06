import { NodeId } from '@craftjs/core';
import React from 'react';
import { Node, Range } from 'slate';

export type SlateResolvers = {
  editor: React.ElementType;
  elements: Record<string, React.ElementType>;
  leaf: React.ElementType;
};

export type SlateSetupContextType = {
  resolvers: SlateResolvers;
};

export type SlateNodeContextType = {
  id: NodeId;
  enabled: boolean;
  actions: {
    setEditorValue: (value: Node[]) => void;
    enableEditing: () => void;
    disableEditing: () => void;
    setSelection: (selection: Range) => void;
  };
};
