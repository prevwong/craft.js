describe('Test History', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.contains('Undo').as('undo-button');
    cy.contains('Redo').as('redo-button');

    // before any changes have been made, both undo and redo should be disabled
    cy.get('@undo-button').should('be.disabled');
    cy.get('@redo-button').should('be.disabled');

    // since we need the root-container in (almost) every test we load it here
    cy.getByTestId('root-container')
      .as('root')
      .children()
      .should('have.length', 4);
  });

  it('should be possible to undo and redo changes to props', () => {
    // first we want to test if we can undo changes made to props
    const originalText = 'Hi world!';
    cy.getByTestId('frame-text')
      .as('frame-text')
      .should('have.text', originalText);

    const newText = 'Hello world!';
    // The Text component uses a ContentEditable inside, so we need to click the <p> to be able to enter text
    cy.get('@frame-text').find('p').click().type(`{selectAll}${newText}`);
    cy.get('@frame-text').should('have.text', newText);

    cy.get('@redo-button').should('be.disabled');
    cy.get('@undo-button').should('not.be.disabled').click();

    cy.get('@frame-text').should('have.text', originalText);

    cy.get('@undo-button').should('be.disabled');
    cy.get('@redo-button').should('not.be.disabled').click();
    cy.get('@frame-text').should('have.text', newText);
  });

  it('should be possible to undo and redo changes made via drag and drop', () => {
    cy.getByTestId('root-container')
      .as('root')
      .children()
      .should('have.length', 4);

    // The first plan is to drag every component into the frame-container component
    cy.getByTestId('frame-container')
      .as('container')
      .children()
      .should('have.length', 1);

    // TODO currently I do not know why but without the wait. test gets flaky
    //      and fails randomly because cypress is not able to drag the card into the container
    cy.wait(100);
    cy.getByTestId('frame-card')
      .as('card')
      .dragAndDrop('@container', { position: 'inside' });
    cy.getByTestId('frame-button')
      .as('button')
      .dragAndDrop('@container', { position: 'inside' });

    cy.getByTestId('frame-text')
      .as('text')
      .dragAndDrop('@container', { position: 'inside' });

    // afterwards all the elements should be inside the Container
    cy.get('@root').children().should('have.length', 1);
    cy.get('@container').children().should('have.length', 4);

    cy.get('@redo-button').should('be.disabled');
    cy.get('@undo-button').should('not.be.disabled').click();

    // we now want to undo all the changes and check along the way, that undoing works as expected
    cy.get('@redo-button').should('not.be.disabled');

    cy.get('@root').children().should('have.length', 2);
    cy.get('@container').children().should('have.length', 3);

    cy.get('@undo-button').click();
    cy.get('@root').children().should('have.length', 3);
    cy.get('@container').children().should('have.length', 2);

    cy.get('@undo-button').click();
    cy.get('@root').children().should('have.length', 4);
    cy.get('@container').children().should('have.length', 1);

    cy.get('@undo-button').should('be.disabled');
    cy.get('@redo-button').should('not.be.disabled');

    // now we want to redo 2 out of 3 times  ...
    cy.get('@redo-button').click();
    cy.get('@redo-button').click();
    cy.get('@redo-button').should('not.be.disabled');

    cy.getByTestId('card-top-text-1').as('card-top-text-1');
    cy.get('@text').dragAndDrop('@card-top-text-1', {
      position: 'below',
    });

    // ... so we can verify that the remaining redo gets overwritten correctly
    cy.get('@redo-button').should('be.disabled');

    // now we undo 3 times to get back to the initial state
    cy.get('@undo-button').click();
    cy.get('@undo-button').click();
    cy.get('@undo-button').click();

    cy.get('@root').children().should('have.length', 4);
  });

  it('should be possible to undo and redo deleted elements', () => {
    // in this test we remove every element
    ['frame-card', 'frame-button', 'frame-text', 'frame-container'].forEach(
      (testId) => {
        // we click on the left side to not accidentally select a component inside Card or Container
        cy.getByTestId(testId).click('left');
        cy.contains('Delete').click();
      }
    );

    cy.get('@undo-button').should('not.be.disabled');
    cy.get('@root').children().should('have.length', 0);

    // we undo the deletions
    cy.get('@undo-button').click();
    cy.get('@undo-button').click();
    cy.get('@undo-button').click();
    cy.get('@undo-button').click();

    cy.get('@root').children().should('have.length', 4);

    cy.get('@undo-button').should('be.disabled');
    cy.get('@redo-button').should('not.be.disabled');

    // and redo the deletions
    cy.get('@redo-button').click();
    cy.get('@redo-button').click();
    cy.get('@redo-button').click();
    cy.get('@redo-button').click();

    cy.get('@root').children().should('have.length', 0);
  });

  it('should be possible to drag elements from the toolbox and undo those changes', () => {
    // we drag every component from the toolbox onto the root
    [
      'toolbox-button',
      'toolbox-text',
      'toolbox-container',
      'toolbox-card',
    ].forEach((testId) => {
      cy.getByTestId(testId).dragAndDrop('@root', {
        position: 'inside',
      });
    });

    // the root now should have 4 more elements
    cy.get('@root').children().should('have.length', 8);

    // and the undo button should not be disabled
    cy.get('@undo-button').should('not.be.disabled');
    cy.get('@redo-button').should('be.disabled');

    // clicking the undo button 4 times should reset the changes
    cy.get('@undo-button').click();
    cy.get('@undo-button').click();
    cy.get('@undo-button').click();
    cy.get('@undo-button').click();

    cy.get('@undo-button').should('be.disabled');
    cy.get('@redo-button').should('not.be.disabled');

    cy.get('@root').children().should('have.length', 4);

    // clicking the redo button 4 times should result in 8 elements under root again
    cy.get('@redo-button').click();
    cy.get('@redo-button').click();
    cy.get('@redo-button').click();
    cy.get('@redo-button').click();

    cy.get('@root').children().should('have.length', 8);
  });

  it('should not be possible to undo/redo changes when the editor is disabled', () => {
    // we delete both the button an the text from the frame
    cy.getByTestId('frame-button').click();
    cy.contains('Delete').click();

    cy.getByTestId('frame-text').click();
    cy.contains('Delete').click();

    // we undo the deletion of the Text element to have a redo action available
    cy.get('@undo-button').click();

    cy.get('@undo-button').should('not.be.disabled');
    cy.get('@redo-button').should('not.be.disabled');

    // we disable the editor
    cy.contains('Enable').click();

    // undo / redo should now be impossible
    cy.get('@undo-button').should('be.disabled');
    cy.get('@redo-button').should('be.disabled');
  });
});
