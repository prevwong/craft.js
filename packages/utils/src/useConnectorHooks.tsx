import { isValidElement, ReactElement } from 'react'
import { cloneElement } from 'react'
import invariant from 'tiny-invariant'
import { useMemo } from 'react'
// import { useInternalManager } from 'craftjs/lib/manager/useInternalManager'

/**
 * Thank you react-dnd!
 */


function setRef(ref: any, node: any) {
  if ( node ) {
    if (typeof ref === 'function') {
      ref(node)
    } else {
      ref.current = node
    }
  }
}

export function cloneWithRef(
  element: any,
  newRef: any,
): React.ReactElement<any> {
  const previousRef = element.ref
  invariant(
    typeof previousRef !== 'string',
    'Cannot connect to an element with an existing string ref. ' +
    'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' +
    'Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute',
  )

  if (!previousRef) {
    // When there is no ref on the element, use the new ref directly
    return cloneElement(element, {
      ref: newRef,
    })
  } else {
    return cloneElement(element, {
      ref: (node: any) => {
        setRef(previousRef, node)
        setRef(newRef, node)
      },
    })
  }
}

function throwIfCompositeComponentElement(element: React.ReactElement<any>) {
  if (typeof element.type === 'string') {
    return
  }

  // const displayName =
  //   (element.type as any).displayName || element.type.name || 'the component'

  // TODO: add error message
  throw new Error()
}

function wrapHookToRecognizeElement(hook: (node: any, opts: any) => void) {
  return (elementOrNode = null, opts: any) => {
    // When passed a node, call the hook straight away.
    if (!isValidElement(elementOrNode)) {
      const node = elementOrNode
      node && hook(node, opts)
      return node
    }

    // If passed a ReactElement, clone it and attach this function as a ref.
    // This helps us achieve a neat API where user doesn't even know that refs
    // are being used under the hood.
    const element: ReactElement | null = elementOrNode
    throwIfCompositeComponentElement(element as any)

    return cloneWithRef(element, hook)
  }
}


export type ConnectableElement =
  | React.RefObject<any>
  | React.ReactElement
  | Element
  | null

export type ConnectorElementWrapper = (elementOrNode: ConnectableElement, options?: any) => React.ReactElement | null

type ConnectorMethod = (element: HTMLElement, options?: any) => void

export type useConnectorHooks<T extends string> =Record<T, (node: ConnectableElement, options?: any) => void>;

export function useConnectorHooks<
  T extends string
  >(hooks: Record<T, ConnectorMethod | [ConnectorMethod, ConnectorMethod]>, active: boolean = true): useConnectorHooks<T> {
  return useMemo(() => {
    return Object.keys(hooks).reduce((accum, key: any) => {
      let hook,
          cleanupHook;

      if (hooks[key] instanceof Array) {
        hook = hooks[key][0],
        cleanupHook = hooks[key][1];
      } else {
        hook = hooks[key];
      }

      accum[key] = (active || (!active && !cleanupHook)) ? (hook && wrapHookToRecognizeElement(hook)) : (cleanupHook && wrapHookToRecognizeElement(cleanupHook))
      return accum;
    }, {})
  }, [active]) as any;
}