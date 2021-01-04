import React from 'react';

export type SlateResolvers = {
  editor: React.ElementType;
  elements: Record<string, React.ElementType>;
  leaf: React.ElementType;
};
