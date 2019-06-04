
import React from "react";

const context = React.createContext<any>({
  id: null,
  insert: () => { }
});

export default context;