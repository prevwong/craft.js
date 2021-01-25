/**
 * Check if a specified event is blocked by a child
 * that's a descendant of the specified element
 */
export const isEventBlockedByDescendant = (e, eventName, el) => {
  // Store initial Craft event value
  if (!e.craft) {
    e.craft = {
      blockedEvents: {},
    };
  }

  const blockingElements = (e.craft && e.craft.blockedEvents[eventName]) || [];

  for (let i = 0; i < blockingElements.length; i++) {
    const blockingElement = blockingElements[i];

    if (el !== blockingElement && el.contains(blockingElement)) {
      return true;
    }
  }

  return false;
};
