export const ROOT_NODE = 'ROOT';
export const DEPRECATED_ROOT_NODE = 'canvas-ROOT';

// TODO: Use a better way to store/display error messages
export const ERROR_NOPARENT = 'Parent id cannot be ommited';
export const ERROR_DUPLICATE_NODEID =
  'Attempting to add a node with duplicated id';
export const ERROR_INVALID_NODEID =
  'Node does not exist, it may have been removed';
export const ERROR_TOP_LEVEL_ELEMENT_NO_ID =
  'A <Element /> that is used inside a User Component must specify an `id` prop, eg: <Element id="text_element">...</Element> ';
export const ERROR_MISSING_PLACEHOLDER_PLACEMENT =
  'Placeholder required placement info (parent, index, or where) is missing';
export const ERROR_MOVE_CANNOT_DROP =
  'Node cannot be dropped into target parent';
export const ERROR_MOVE_INCOMING_PARENT = 'Target parent rejects incoming node';
export const ERROR_MOVE_OUTGOING_PARENT =
  'Current parent rejects outgoing node';
export const ERROR_MOVE_NONCANVAS_CHILD =
  'Cannot move node that is not a direct child of a Canvas node';
export const ERROR_MOVE_TO_NONCANVAS_PARENT =
  'Cannot move node into a non-Canvas parent';
export const ERROR_MOVE_TOP_LEVEL_NODE = 'A top-level Node cannot be moved';
export const ERROR_MOVE_ROOT_NODE = 'Root Node cannot be moved';

export const ERROR_MOVE_TO_DESCENDANT = 'Cannot move node into a descendant';
export const ERROR_NOT_IN_RESOLVER =
  'The component type specified for this node (%node_type%) does not exist in the resolver';
export const ERROR_INFINITE_CANVAS =
  "The component specified in the <Canvas> `is` prop has additional Canvas specified in it's render template.";
export const ERROR_CANNOT_DRAG =
  'The node has specified a canDrag() rule that prevents it from being dragged';
export const ERROR_INVALID_NODE_ID = 'Invalid parameter Node Id specified';
export const ERROR_DELETE_TOP_LEVEL_NODE =
  'Attempting to delete a top-level Node';

export const ERROR_RESOLVER_NOT_AN_OBJECT = `Resolver in <Editor /> has to be an object. For (de)serialization Craft.js needs a list of all the User Components. 
    
More info: https://craft.js.org/r/docs/api/editor#props`;

export const ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER = `An Error occurred while deserializing components: Cannot find component <%displayName% /> in resolver map. Please check your resolver in <Editor />

Available components in resolver: %availableComponents%

More info: https://craft.js.org/r/docs/api/editor#props`;

export const ERROR_USE_EDITOR_OUTSIDE_OF_EDITOR_CONTEXT = `You can only use useEditor in the context of <Editor />. 

Please only use useEditor in components that are children of the <Editor /> component.`;

export const ERROR_USE_NODE_OUTSIDE_OF_EDITOR_CONTEXT = `You can only use useNode in the context of <Editor />. 

Please only use useNode in components that are children of the <Editor /> component.`;
