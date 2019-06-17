// import { Nodes, Node } from "~types";
// import React from "react";
// import Canvas from "../Canvas";

// const childrenToJsx = (childrenNodes: Node[], components) => {
//   return childrenNodes.map((child: Node, i) => {
//     if (typeof child === "string") return child;
//     const { type, props } = child;

//     const Component = components[type] ? components[type] : type;

//     if (props.children) {
//       props.children = childrenToJsx(props.children, components);
//     }

//     return <Component key={i} {...props} />
//   });
// }

// export const loadState = (state: string, componentsList: Function[]) => {
//   const nodes = JSON.parse(state);
//   const standardComponents = [Canvas];
//   componentsList = [
//     ...componentsList,
//     ...standardComponents
//   ]
//   const components = componentsList.reduce((result, func) => {
//     result[func.name] = func;
//     return result;
//   }, {});
//   // console.log(JSON.parse(state, true))
//   return Object.keys(nodes).reduce((results: Nodes, nodeId: string) => {
//     const node = nodes[nodeId];
    
//     node.type = components[node.type] ? components[node.type] : node.type;

//     if (node.props.children) {
//       node.props.children = childrenToJsx(node.props.children, components)
//     }
//     // console.log("re", nodeId, )
//     results[nodeId] = node;
//     return results;
//   }, {});
// }
