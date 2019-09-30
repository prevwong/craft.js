export const connectTarget = (
  render: any,
  methods: Exclude<NodeRef, "dom" | "event">
): React.ReactElement => {
  if (!_inNodeContext) return render;
  const previousRef = render.ref;
  invariant(
    previousRef !== "string",
    "Cannot connect to an element with an existing string ref. Please convert it into a callback ref instead."
  );

  if (methods) {
    setRef(ref => {
      Object.keys(methods).forEach((key: keyof Exclude<NodeRef, "dom">) => {
        ref[key] = methods[key] as any;
      });
    });
  }

  console.log(render);
  return cloneElement(render, {
    ref: (dom: HTMLElement) => {
      if (dom) {
        setRef(ref => (ref.dom = dom));
      }
      if (previousRef) previousRef(dom);
    },
    onMouseOver: (e: React.MouseEvent) => {
      e.stopPropagation();
      setNodeEvent("hover");
      if (render.props.onMouseOver) render.props.onMouseOver(e);
    },
    onMouseDown: (e: React.MouseEvent) => {
      e.stopPropagation();
      setNodeEvent("active");
      if (render.props.onMouseDown) render.props.onMouseDown(e);
    }
  });
};
