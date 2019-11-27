import { isValidElement, ReactElement } from 'react'
import { cloneElement } from 'react'
import invariant from 'invariant'

/**
 * Thank you react-dnd!
 */

export interface Ref<T> {
  current: T
}

export function isRef(obj: any) {
  return (
    // eslint-disable-next-line no-prototype-builtins
    obj !== null && typeof obj === 'object' && obj.hasOwnProperty('current')
  )
}

function setRef(ref: any, node: any) {
  if (typeof ref === 'function') {
    ref(node)
  } else {
    ref.current = node
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

function wrapHookToRecognizeElement(hook: (node: any) => void) {
  return (elementOrNode = null) => {
    // When passed a node, call the hook straight away.
    if (!isValidElement(elementOrNode)) {
      const node = elementOrNode
      hook(node)
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

export type ConnectorElementWrapper = (
  elementOrNode: ConnectableElement
) => React.ReactElement | null


export function wrapConnectorHooks(hooks: any): Record<string, ConnectorElementWrapper> {
  const wrappedHooks: any = {}

  Object.keys(hooks).forEach(key => {
    const hook = hooks[key]
    const wrappedHook = hook && wrapHookToRecognizeElement(hook)
    wrappedHooks[key] = wrappedHook
  })
  return wrappedHooks
}