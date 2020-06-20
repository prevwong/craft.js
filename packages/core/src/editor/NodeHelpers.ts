import { EditorState, Node, NodeId } from '@craftjs/core'
import invariant from 'tiny-invariant'
import {
  deprecationWarning,
  ERROR_CANNOT_DRAG,
  ERROR_DUPLICATE_NODEID,
  ERROR_INVALID_NODE_ID,
  ERROR_MOVE_INCOMING_PARENT,
  ERROR_MOVE_NONCANVAS_CHILD,
  ERROR_MOVE_OUTGOING_PARENT,
  ERROR_MOVE_TO_DESCENDANT,
  ERROR_MOVE_TO_NONCANVAS_PARENT,
  ERROR_MOVE_TOP_LEVEL_NODE,
  ROOT_NODE,
} from '@craftjs/utils'
import { serializeNode } from '../utils/serializeNode'
import { mergeTrees } from '../utils/mergeTrees'

export function NodeHelpers(state: EditorState, id: NodeId) {
  invariant(typeof id == 'string', ERROR_INVALID_NODE_ID)

  const node = state.nodes[id]

  const nodeHelpers = (id) => NodeHelpers(state, id)

  const getNodeFromIdOrNode = (node: NodeId | Node) =>
    typeof node === 'string' ? state.nodes[node] : node

  return {
    isCanvas() {
      return !!node.data.isCanvas
    },
    isRoot() {
      return node.id === ROOT_NODE
    },
    isLinkedNode() {
      return (
        node.data.parent &&
        nodeHelpers(node.data.parent).linkedNodes().includes(node.id)
      )
    },
    isTopLevelNode() {
      return this.isRoot() || this.isLinkedNode()
    },
    isDeletable() {
      return !this.isTopLevelNode()
    },
    isParentOfTopLevelNodes: () => !!node.data.linkedNodes,
    isParentOfTopLevelCanvas() {
      deprecationWarning('query.node(id).isParentOfTopLevelCanvas', {
        suggest: 'query.node(id).isParentOfTopLevelNodes',
      })
      return this.isParentOfTopLevelNodes()
    },
    get() {
      return node
    },
    ancestors(deep = false) {
      function appendParentNode(
        id: NodeId,
        result: NodeId[] = [],
        depth: number = 0
      ) {
        const node = state.nodes[id]
        if (!node) {
          return result
        }

        result.push(id)

        if (!node.data.parent) {
          return result
        }

        if (deep || (!deep && depth === 0)) {
          result = appendParentNode(node.data.parent, result, depth + 1)
        }
        return result
      }
      return appendParentNode(node.data.parent)
    },
    descendants(deep = false) {
      function appendChildNode(
        id: NodeId,
        result: NodeId[] = [],
        depth: number = 0
      ) {
        if (deep || (!deep && depth === 0)) {
          const node = state.nodes[id]

          if (!node) {
            return result
          }

          // Include linkedNodes if any
          const linkedNodes = nodeHelpers(id).linkedNodes()

          linkedNodes.forEach((nodeId) => {
            result.push(nodeId)
            result = appendChildNode(nodeId, result, depth + 1)
          })

          const childNodes = node.data.nodes

          if (!childNodes) {
            return result
          }

          // Include child Nodes if any
          if (childNodes) {
            childNodes.forEach((nodeId) => {
              result.push(nodeId)
              result = appendChildNode(nodeId, result, depth + 1)
            })
          }
        }
        return result
      }
      return appendChildNode(id)
    },
    linkedNodes() {
      return Object.values(node.data.linkedNodes || {})
    },
    isDraggable(onError?: (err: string) => void) {
      try {
        const targetNode = node
        invariant(!this.isTopLevelNode(), ERROR_MOVE_TOP_LEVEL_NODE)
        invariant(
          NodeHelpers(state, targetNode.data.parent).isCanvas(),
          ERROR_MOVE_NONCANVAS_CHILD
        )
        invariant(
          targetNode.rules.canDrag(targetNode, nodeHelpers),
          ERROR_CANNOT_DRAG
        )
        return true
      } catch (err) {
        if (onError) {
          onError(err)
        }
        return false
      }
    },
    isDroppable(target: NodeId | Node, onError?: (err: string) => void) {
      const isNewNode = typeof target == 'object' && !state.nodes[target.id]
      const targetNode = getNodeFromIdOrNode(target),
        newParentNode = node
      try {
        //  If target is a NodeId (thus it's already in the state), check if it's a top-level node
        if (typeof target === 'string') {
          invariant(
            !nodeHelpers(target).isTopLevelNode(),
            ERROR_MOVE_TOP_LEVEL_NODE
          )
        }

        invariant(this.isCanvas(), ERROR_MOVE_TO_NONCANVAS_PARENT)
        invariant(
          newParentNode.rules.canMoveIn(targetNode, newParentNode, nodeHelpers),
          ERROR_MOVE_INCOMING_PARENT
        )

        if (isNewNode) {
          return true
        }

        const currentParentNode =
          targetNode.data.parent && state.nodes[targetNode.data.parent]

        invariant(currentParentNode.data.isCanvas, ERROR_MOVE_NONCANVAS_CHILD)

        invariant(
          currentParentNode ||
            (!currentParentNode && !state.nodes[targetNode.id]),
          ERROR_DUPLICATE_NODEID
        )

        const targetDeepNodes = nodeHelpers(targetNode.id).descendants()

        invariant(
          !targetDeepNodes.includes(newParentNode.id) &&
            newParentNode.id !== targetNode.id,
          ERROR_MOVE_TO_DESCENDANT
        )
        invariant(
          currentParentNode.rules.canMoveOut(
            targetNode,
            currentParentNode,
            nodeHelpers
          ),
          ERROR_MOVE_OUTGOING_PARENT
        )

        return true
      } catch (err) {
        if (onError) {
          onError(err)
        }
        return false
      }
    },
    toSerializedNode() {
      return serializeNode(node.data, state.options.resolver)
    },
    toNodeTree() {
      const childNodes = (node.data.nodes || []).map((childNodeId) => {
        return NodeHelpers(state, childNodeId).toNodeTree()
      })

      return mergeTrees(node, childNodes)
    },

    /**
     Deprecated NodeHelpers
     **/

    decendants(deep = false) {
      deprecationWarning('query.node(id).decendants', {
        suggest: 'query.node(id).descendants',
      })
      return this.descendants(deep)
    },
    isTopLevelCanvas() {
      return !this.isRoot() && !node.data.parent
    },
  }
}
