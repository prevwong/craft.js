---
id: editor-state
title: EditorState
sidebar_label: EditorState
---

import {API, Badge} from "@site/src/components";

<Badge type="type" />

## Reference
### Properties
<API items={[
  ["nodes", "Record<NodeId, Node>", "A map of all the Nodes in the editor"],
  ["events", "Object", [
    ["selected", "Set<NodeId>"],
    ["hovered", "Set<NodeId>"],
    ["dragged", "Set<NodeId>"],
  ]],
  ["options", "Object", [
    ["resolver", "Map<String, React.ComponentType>", "A map of User Components that will be used in the editor"],
    ["enabled?", "boolean", "Optional. If set to false, all editing capabilities will be disabled"],
    ["indicator", "Object", [
      ["success", "String", "Color to use when the user hovers over a droppable location"],
      ["error", "String", "Color to use when the usre hovers over a non-droppable location"],
      ["transition", "string", "CSS transition to use for when the Indicator moves around"],
      ["thickness", "number", "Thickness of the Indicator"]
    ]],
    ["onRender?", "React.ComponentType<{element: React.ReactElement}>", "Optional. Specify a custom component to render every User Element in the editor."],
    ["onNodesChange?", "() => void", "Optional. A callback method when the values of any of the nodes in the state changes"]
  ]]
]} />


> Note: `options` can be specified as props in the [`<Editor />`](Editor.md)