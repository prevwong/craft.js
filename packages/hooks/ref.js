import React, { useContext, useReducer, useCallback, useMemo } from 'react'
import ReactDOM from 'react-dom'
import produce from 'immer'

const AppContext = React.createContext(null)
const NodeContext = React.createContext(null)

const initialState = {
  nodes: {
    a: { id: 'a', children: ['b'], title: 'I am A', events: {} },
    b: { id: 'b', title: 'I am B', events: {}, children: ['c'] },
    c: { id: 'c', title: 'I am C', events: {} }
  },
  events: {
    dragging: null,
    hover: null,
    active: null
  }
}

const nodeState = {
  id: null
}


const reducer = (state, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'increment':
        draft.nodes[action.id].title = draft.nodes[action.id].title + 1
        break
      case 'setActive':
        if (draft.events.active) {
          draft.nodes[draft.events.active.id].events.active = false
        }
        draft.nodes[action.id].events.active = true
        draft.events.active = draft.nodes[action.id]
        break
    }
  })

const nodeReducer = (state, action) =>
  produce(state, draft => {
    switch (action.type) {
      
    }
  })

function ContextProvider (props) {
  const [count, dispatch] = useReducer(reducer, initialState)

  const contextValue = {
    count,
    dispatch
  }

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}

function NodeProvider ({node, children, getAll}) {
  return (
    <NodeContext.Provider value={{node, getAll}}>
      {children}
    </NodeContext.Provider>
  )
}

let Node = React.memo(({ nodeId, node, getAll, dispatch, eventsDispatch }) => {
  // const p = useContext(NodeContext);  
  const { title, children, events } = node
  console.log("re-render", getAll())
  return (  
    <div>
      <p>
        Node {node.id}: {title} --- Active: {JSON.stringify(events)}
      </p>
      <button onClick={() => dispatch({ type: 'setActive', id: nodeId })}>
        Set active
      </button>
      <button onClick={() => dispatch({ type: 'increment', id: nodeId })}>
        Increment
      </button>
      {children &&
        children.map(id => {
          return <WrappedNode key={id} nodeId={id} />
        })}
    </div>
  )
});

const connectNode = mapStateToProps => {
  return function (Component) {
    return function (props) {
      const { node, getAll } = useContext(NodeContext)
      return (
        <Component {...props} node={node} getAll={getAll} />
      )
    }
  }
}


const connect = mapStateToProps => {
  return function (Component) {
    return function (props) {
      const { count, dispatch } = useContext(AppContext)

      const state = useMemo(() => mapStateToProps(count.nodes[props.nodeId]), [
        count.nodes[props.nodeId]
      ])

      const getAll = useCallback(() => count.nodes, [])
      
      return (
        <NodeProvider node={state} getAll={getAll}>
          <Component {...props} dispatch={dispatch} />
        </NodeProvider>
      )
    }
  }
}

const ConnectedNode = connectNode()(Node);

const WrappedNode = connect(state => ({
  id: state.id,
  title: state.title,
  events: state.events,
  children: state.children
}))(ConnectedNode)

function App (props) {
  return (
    <ContextProvider>
      <WrappedNode nodeId='a' />
    </ContextProvider>
  )
}

export default App
