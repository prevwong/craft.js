export type CaretPoint = {
  nodeId: string;
  offset: number;
};

export type CaretSelection = {
  anchor: CaretPoint;
  focus: CaretPoint;
};

export type CaretData = Record<string, any>;

export type Caret = {
  selection: CaretSelection;
  data: CaretData;
};
