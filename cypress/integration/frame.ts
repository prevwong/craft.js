describe('Frame', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should be possible to move the elements around in the frame', () => {
    // at the start the root should have 4 elements
    cy.getByTestId('root-container')
      .as('root-container')
      .children()
      .should('have.length', 4);

    // we want to drop the "Click me" Button inside the CardBottom
    // before that the CardBottom should only have one button
    cy.getByTestId('card-bottom')
      .as('card-bottom')
      .children()
      .should('have.length', 1);
    // we verify that the button is draggable and drop it inside the CardBottom
    cy.getByTestId('frame-button')
      .should('have.attr', 'draggable', 'true')
      .dragAndDrop('@card-bottom', {
        position: 'inside',
      });
    // CardBottom now should have 2 elements
    cy.get('@card-bottom').children().should('have.length', 2);

    // we want to drop the "Hi world!" Text as second element in the CardTop
    // before that we verify that CardTop has two children
    cy.getByTestId('card-top')
      .as('card-top')
      .children()
      .should('have.length', 2);

    cy.getByTestId('card-top-text-1').as('card-top-text-1');
    cy.getByTestId('frame-text')
      .should('have.attr', 'draggable', 'true')
      .dragAndDrop('@card-top-text-1', {
        position: 'below',
      });
    cy.get('@card-top').children().should('have.length', 3);

    // the root should now only have 2 children (the Card and the Container)
    cy.get('@root-container').children().should('have.length', 2);

    // we now want to drop the Card inside the Container
    cy.getByTestId('frame-container')
      .as('frame-container')
      .children()
      .should('have.length', 1);
    cy.getByTestId('frame-card').dragAndDrop('@frame-container', {
      position: 'inside',
    });
    cy.get('@frame-container').children().should('have.length', 2);
    cy.get('@root-container').children().should('have.length', 1);
  });

  it('should not be possible to drag anything inside the frame when the editor is disabled', () => {
    // we disable the editor
    cy.contains('Enable').click();

    // no element should be draggable
    cy.getByTestId('frame-card').should('have.attr', 'draggable', 'false');
    cy.getByTestId('card-top-text-1').should('have.attr', 'draggable', 'false');
    cy.getByTestId('card-top-text-2').should('have.attr', 'draggable', 'false');
    cy.getByTestId('card-bottom-button').should(
      'have.attr',
      'draggable',
      'false'
    );
    cy.getByTestId('frame-button').should('have.attr', 'draggable', 'false');
    cy.getByTestId('frame-text').should('have.attr', 'draggable', 'false');
    cy.getByTestId('frame-container').should('have.attr', 'draggable', 'false');
    cy.getByTestId('frame-container-text').should(
      'have.attr',
      'draggable',
      'false'
    );
  });

  it('should be possible to delete every element', () => {
    // to keep it DRY we use this simple helper
    const deleteByTestId = (testId: string) => {
      cy.getByTestId(testId).click();
      cy.contains('Delete').click();
    };

    // these calls all follow the same schema:
    // 1. verify that the container has a certain number of children before we delete
    // 2. select the element we want to delete
    // 3. delete the element
    // 4. verify that the container now has one less element

    cy.getByTestId('root-container')
      .as('root-container')
      .children()
      .should('have.length', 4);

    cy.getByTestId('card-top').children().should('have.length', 2);
    deleteByTestId('card-top-text-1');
    deleteByTestId('card-top-text-2');
    cy.getByTestId('card-top').children().should('have.length', 0);

    cy.getByTestId('card-bottom').children().should('have.length', 1);
    deleteByTestId('card-bottom-button');
    cy.getByTestId('card-bottom').children().should('have.length', 0);

    deleteByTestId('frame-card');
    cy.get('@root-container').children().should('have.length', 3);

    deleteByTestId('frame-button');
    cy.get('@root-container').children().should('have.length', 2);

    deleteByTestId('frame-text');
    cy.get('@root-container').children().should('have.length', 1);

    cy.getByTestId('frame-container').children().should('have.length', 1);
    deleteByTestId('frame-container-text');
    cy.getByTestId('frame-container').children().should('have.length', 0);

    deleteByTestId('frame-container');
    cy.get('@root-container').children().should('have.length', 0);
  });

  it('should not be possible to delete an element when the editor is disabled', () => {
    // first we disable the editor
    cy.contains('Enable').click();

    // then we check that the SettingsPanel does not open for any of the elements
    [
      'card-top-text-1',
      'card-top-text-2',
      'card-bottom-button',
      'card-top',
      'card-bottom',
      'frame-card',
      'frame-button',
      'frame-text',
      'frame-container-text',
      'frame-container',
    ].forEach((testId) => {
      cy.getByTestId(testId).click();
      cy.contains('Delete').should('not.exist');
    });
  });
});
