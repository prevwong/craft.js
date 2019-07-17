import { Placeholder } from "../render/RenderPlaceholder";

export type Options = {
  onRender: React.FC<{ render: React.ReactElement }>,
  renderPlaceholder: React.FC<Placeholder>
  resolver: Resolver,
  nodes: string
}

export type Resolver = Record<string, string | React.ElementType>;

