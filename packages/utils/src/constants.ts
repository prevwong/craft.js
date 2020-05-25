export const ROOT_NODE = "ROOT";
export const DEPRECATED_ROOT_NODE = "canvas-ROOT";

// TODO: Use a better way to store/display error messages
export const ERROR_NOPARENT = "Parent id cannot be ommited";
export const ERROR_DUPLICATE_NODEID =
  "Attempting to add a node with duplicated id";
export const ERROR_INVALID_NODEID =
  "Node does not exist, it may have been removed";
export const ERROR_ROOT_CANVAS_NO_ID =
  'A <Canvas /> that is a child of a non Canvas node must specify an `id` prop, eg: <Canvas id="MyCanvas">...</Canvas> ';
export const ERROR_MISSING_PLACEHOLDER_PLACEMENT =
  "Placeholder required placement info (parent, index, or where) is missing";
export const ERROR_MOVE_INCOMING_PARENT = "Target parent rejects incoming node";
export const ERROR_MOVE_OUTGOING_PARENT =
  "Current parent rejects outgoing node";
export const ERROR_MOVE_NONCANVAS_CHILD =
  "Cannot move node that is not a direct child of a Canvas node";
export const ERROR_MOVE_TO_NONCANVAS_PARENT =
  "Cannot move node into a non-Canvas parent";
export const ERROR_MOVE_TOP_LEVEL_NODE = "A top-level Node cannot be moved";
export const ERROR_MOVE_ROOT_NODE = "Root Node cannot be moved";

export const ERROR_MOVE_TO_DESCENDANT = "Cannot move node into a descendant";
export const ERROR_NOT_IN_RESOLVER =
  "The component type specified for this node does not exist in the resolver";
export const ERROR_INFINITE_CANVAS =
  "The component specified in the <Canvas> `is` prop has additional Canvas specified in it's render template.";
export const ERROR_CANNOT_DRAG =
  "The node has specified a canDrag() rule that prevents it from being dragged";
export const ERROR_INVALID_NODE_ID = "Invalid parameter Node Id specified";
export const ERROR_FRAME_IMMEDIATE_NON_CANVAS =
  "The immediate child of <Frame /> has to be a Canvas";
