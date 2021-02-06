// https://github.com/react-dnd/react-dnd
import { isValidElement, ReactElement } from 'react';
import { cloneElement } from 'react';
import invariant from 'tiny-invariant';

import { ChainableConnectors, ConnectorsRecord } from './interfaces';

function setRef(ref: any, node: any) {
  if (node) {
    if (typeof ref === 'function') {
      ref(node);
    } else {
      ref.current = node;
    }
  }
}

export function cloneWithRef(
  element: any,
  newRef: any
): React.ReactElement<any> {
  const previousRef = element.ref;
  invariant(
    typeof previousRef !== 'string',
    'Cannot connect to an element with an existing string ref. ' +
      'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' +
      'Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute'
  );

  if (!previousRef) {
    // When there is no ref on the element, use the new ref directly
    return cloneElement(element, {
      ref: newRef,
    });
  } else {
    return cloneElement(element, {
      ref: (node: any) => {
        setRef(previousRef, node);
        setRef(newRef, node);
      },
    });
  }
}

function throwIfCompositeComponentElement(element: React.ReactElement<any>) {
  if (typeof element.type === 'string') {
    return;
  }

  throw new Error();
}

export function wrapHookToRecognizeElement(
  hook: (node: any, ...args: any[]) => void
) {
  return (elementOrNode = null, ...args: any) => {
    // When passed a node, call the hook straight away.
    if (!isValidElement(elementOrNode)) {
      if (!elementOrNode) {
        return;
      }

      const node = elementOrNode;
      node && hook(node, ...args);
      return node;
    }

    // If passed a ReactElement, clone it and attach this function as a ref.
    // This helps us achieve a neat API where user doesn't even know that refs
    // are being used under the hood.
    const element: ReactElement | null = elementOrNode;
    throwIfCompositeComponentElement(element as any);

    return cloneWithRef(element, hook);
  };
}

// A React wrapper for our connectors
// Wrap all our connectors so that would additionally accept React.ReactElement
export function wrapConnectorHooks<H extends ConnectorsRecord>(
  connectors: H
): ChainableConnectors<H, React.ReactElement | HTMLElement> {
  return Object.keys(connectors).reduce((accum, key) => {
    accum[key] = wrapHookToRecognizeElement((...args) => {
      // @ts-ignore
      return connectors[key](...args);
    });

    return accum;
  }, {}) as any;
}
