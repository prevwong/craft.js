import { DropPosition, DOMInfo } from '../interfaces';
export default function movePlaceholder(pos: DropPosition, canvasDOMInfo: DOMInfo, // which canvas is cursor at
bestTargetDomInfo: DOMInfo | null, // closest element in canvas (null if canvas is empty)
thickness?: number): {
    top: string;
    left: string;
    width: string;
    height: string;
};
