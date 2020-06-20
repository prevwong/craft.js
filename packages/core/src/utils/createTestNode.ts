export const createTestNode = (id, data, config = {}) => {
    return {
        id,
        data: {
            props: {},
            custom: {},
            hidden: false,
            isCanvas: false,
            ...data,
        },
        related: {},
        events: { selected: false, dragged: false, hovered: false },
        rules: {
            canMoveIn: () => true,
            canMoveOut: () => true,
            canDrag: () => true,
        },
        ...config,
    }
}
