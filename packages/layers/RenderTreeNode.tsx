import React from "react";

export default class RenderTreeNode extends React.Component<any> {
    render() {
        const { node } = this.props;
        console.log(node)
        const {id, canvasName, type, children} = node;
        return (
            <li>
                <a>{typeof type === "function" ? type.name : type} {canvasName ? canvasName : null}</a>
                {
                    children && Object.keys(children).length && (
                        <ul>
                            {
                                Object.keys(children).map((childId) => {
                                    return <RenderTreeNode key={childId} node={children[childId]} />
                                })
                            }
                        </ul>
                    )
                }
            </li>
        )
    }
}