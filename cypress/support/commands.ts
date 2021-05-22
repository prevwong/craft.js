import './dnd';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getByTestId(
        selector: string,
        ...additionalArguments: any[]
      ): Chainable<Element>;
    }
  }
}

/**
 * Will select elements that have a data-cy=$test-id attribute
 * Usage: `cy.getByTestId('test-id')`
 * @example HTML: <div data-cy="test-id" /> Selector: cy.getByTestId('test-id')
 */
Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args);
});
