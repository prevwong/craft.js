import { Resolver } from "../interfaces";
import { Canvas } from "../nodes";

export const resolveComponent = (resolver: Resolver, comp: React.ElementType | string) => {
    let Comp;
    const name = (comp as any).name || (comp as any).displayName;

    if (comp === Canvas) return "Canvas";

    if (resolver[name]) return name;

    if (!Comp) {
        for (let i = 0; i < Object.keys(resolver).length; i++) {
            const name = Object.keys(resolver)[i],
                fn = resolver[name];
            if (fn === comp) {
                Comp = name;
                break;
            }
        }
    }

    // if ( !Comp && comp == Canvas) return "Canvas";
    if ( !Comp && typeof comp === "string" ) return comp;
    return Comp;
}
