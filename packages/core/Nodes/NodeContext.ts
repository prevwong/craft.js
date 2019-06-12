
import React from "react";

const NodeContext = React.createContext<any>({
  id: null,
  insert: () => { }
});

export default NodeContext;