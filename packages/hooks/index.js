import { StateProvider, useStateValue } from './state';
import ThemedButton from "./ThemedButton";
import React from "react";
import produce from "immer";

const RootRender = () => {
  const [{nodes}, dispatch] = useStateValue();
  return (
    <Wrapper nodeId="rootNode" />
  )
}

function connect(WrappedComponent, select) {
  return function(props) {
    const selectors = select();
    return <WrappedComponent {...selectors} {...props} />;
  };
}


function select() {
  const { dispatch } = useStateValue();
  return {
    dispatch: dispatch
  };
}

const Renderer = React.memo(
  ({nodeId, title}) => {
    const [{ nodes }, dispatch] = useStateValue();
    const {children} = nodes[nodeId];
    console.log("re-render")
    return (
      <div>
        Title: {title}
        <button
          onClick={() => dispatch({
            type: 'updateNode',
            id: nodeId,
            title: `${title} new`
          })}
        >
          Update title
        </button>
        {children && 
          <React.Fragment>
            {
              children.map((id, i) => {
                return <Wrapper title={nodes[id].title} nodeId={id} key={id} />
              })
            }
          </React.Fragment>
        }
      </div>
    )
  }
)

const Wrapper = connect(Renderer, select);
const App = () => {
  const initialState = {
    nodes: {
      rootNode: produce({}, draft => {
        draft.title = "Root"
        draft.children = ["node1", "node2"]
      }),
      node1: produce({}, draft => {
        draft.title = "Node 1"
      }),
      node2: produce({}, draft => {
        draft.title = "Node 2"
      }),
    },
    theme: { primary: 'green' }
  };
  
  const reducer = (state, action) => 
    produce(state, draft => {
        switch (action.type) {
            case 'changeTheme':
                draft.nodes[action.id] = action.newTheme
                break;
            case 'updateNode' :
                draft.nodes[action.id] = produce(draft.nodes[action.id], node => {
                  node.title = action.title;
                })
                break;
        }
    });

  
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
       <RootRender />
    </StateProvider>
  );
}

export default App;